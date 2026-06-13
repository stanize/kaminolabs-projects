'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase, Project, ProjectStatus } from '@/lib/supabase';
import { daysAgo, todayDateString } from '@/lib/date';
import ProjectRow from '@/components/ProjectRow';
import NewProjectRow from '@/components/NewProjectRow';

type Tab = ProjectStatus;

export default function Tracker() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('active');

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase
      .from('project_tracker')
      .select('*');

    if (error) {
      setError(error.message);
    } else {
      setProjects(data as Project[]);
      setError(null);
    }
    setLoading(false);
  }

  const visibleProjects = useMemo(() => {
    return projects
      .filter((p) => p.status === activeTab)
      .sort((a, b) => daysAgo(b.last_worked_date) - daysAgo(a.last_worked_date));
  }, [projects, activeTab]);

  // Save a single field (summary, next step, or hours) and bump last_worked_date to today.
  async function handleFieldSave(
    id: string,
    field: 'last_summary' | 'next_step' | 'hours_spent',
    value: string
  ) {
    const today = todayDateString();
    const updates: Partial<Project> = {
      last_worked_date: today,
    };

    if (field === 'hours_spent') {
      const trimmed = value.trim();
      updates.hours_spent = trimmed === '' ? null : Number(trimmed);
      if (trimmed !== '' && Number.isNaN(updates.hours_spent as number)) {
        // Don't save invalid numbers; revert by refetching.
        await fetchProjects();
        return;
      }
    } else {
      updates[field] = value;
    }

    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    const { error } = await supabase
      .from('project_tracker')
      .update(updates)
      .eq('id', id);

    if (error) {
      setError(error.message);
      await fetchProjects();
    }
  }

  async function handleToggleStatus(id: string, newStatus: ProjectStatus) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );

    const { error } = await supabase
      .from('project_tracker')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      setError(error.message);
      await fetchProjects();
    }
  }

  async function handleDelete(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));

    const { error } = await supabase
      .from('project_tracker')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
      await fetchProjects();
    }
  }

  async function handleAgeProject(id: string) {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    const [y, m, d] = project.last_worked_date.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 1);
    const newDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, last_worked_date: newDate } : p))
    );

    const { error } = await supabase
      .from('project_tracker')
      .update({ last_worked_date: newDate })
      .eq('id', id);

    if (error) {
      setError(error.message);
      await fetchProjects();
    }
  }

  async function handleCreate(name: string) {
    const today = todayDateString();
    const newProject = {
      name,
      status: activeTab,
      last_worked_date: today,
      last_summary: '',
      next_step: '',
      hours_spent: null,
    };

    const { data, error } = await supabase
      .from('project_tracker')
      .insert(newProject)
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    setProjects((prev) => [...prev, data as Project]);
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Project tracker</h1>
        <span className="subtitle">Pick whatever's been waiting the longest</span>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active
        </button>
        <button
          className={`tab ${activeTab === 'backburner' ? 'active' : ''}`}
          onClick={() => setActiveTab('backburner')}
        >
          Backburner
        </button>
      </div>

      {error && (
        <div className="empty-state" style={{ color: '#a13f2d' }}>
          {error}
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="col-name">Project</th>
              <th className="col-badge">Last worked</th>
              <th className="col-summary">What was done</th>
              <th className="col-next">Next step</th>
              <th className="col-hours">Hours</th>
              <th className="col-action"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  Loading...
                </td>
              </tr>
            ) : (
              <>
                {visibleProjects.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    onFieldSave={handleFieldSave}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDelete}
                    onAge={handleAgeProject}
                  />
                ))}
                {visibleProjects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty-state">
                      Nothing here yet.
                    </td>
                  </tr>
                )}
                <NewProjectRow status={activeTab} onCreate={handleCreate} />
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
