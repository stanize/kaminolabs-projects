'use client';

import { useState } from 'react';
import { Project, ProjectStatus } from '@/lib/supabase';
import { daysAgoLabel, stalenessBand } from '@/lib/date';
import EditableCell from './EditableCell';

interface ProjectRowProps {
  project: Project;
  onFieldSave: (id: string, field: 'last_summary' | 'next_step' | 'hours_spent', value: string) => void;
  onToggleStatus: (id: string, newStatus: ProjectStatus) => void;
  onDelete: (id: string) => void;
  onAge: (id: string) => void;
}

export default function ProjectRow({
  project,
  onFieldSave,
  onToggleStatus,
  onDelete,
  onAge,
}: ProjectRowProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const band = stalenessBand(project.last_worked_date);
  const label = daysAgoLabel(project.last_worked_date);

  const handleDeleteClick = () => {
    if (confirmingDelete) {
      onDelete(project.id);
    } else {
      setConfirmingDelete(true);
      setTimeout(() => setConfirmingDelete(false), 3000);
    }
  };

  return (
    <tr>
      <td className="col-name">{project.name}</td>
      <td className="col-badge">
        <span className={`badge ${band}`}>{label}</span>
      </td>
      <td className="col-summary">
        <EditableCell
          value={project.last_summary ?? ''}
          placeholder="What did you do?"
          onSave={(v) => onFieldSave(project.id, 'last_summary', v)}
        />
      </td>
      <td className="col-next">
        <EditableCell
          value={project.next_step ?? ''}
          placeholder="What's next?"
          onSave={(v) => onFieldSave(project.id, 'next_step', v)}
        />
      </td>
      <td className="col-hours">
        <EditableCell
          value={project.hours_spent != null ? String(project.hours_spent) : ''}
          placeholder="-"
          multiline={false}
          className="hours-input"
          onSave={(v) => onFieldSave(project.id, 'hours_spent', v)}
        />
      </td>
      <td className="col-action">
        <div className="action-cell">
          {project.status === 'active' ? (
            <button
              className="row-action-btn"
              onClick={() => onToggleStatus(project.id, 'backburner')}
              aria-label="Move to backburner"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 4h3l-3 5h3" />
                <path d="M10 4h4l-4 5h4" />
                <path d="M4 12h4l-4 5h4" />
              </svg>
            </button>
          ) : (
            <button
              className="row-action-btn"
              onClick={() => onToggleStatus(project.id, 'active')}
              aria-label="Activate"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 12c2 -2.5 0 -5.5 -1.5 -6.5c0.5 2 -0.5 4 -2 5.5c-1.5 1.5 -2.5 3.5 -2.5 5.5a6 6 0 1 0 12 0c0 -1.5 -0.5 -3 -1.5 -4.5c-1 1.5 -2.5 2.5 -4.5 0z" />
              </svg>
            </button>
          )}
          {project.status !== 'assets' && (
            <button
              className="row-action-btn assets-btn"
              onClick={() => onToggleStatus(project.id, 'assets')}
              aria-label="Move to assets"
            >
              <span style={{ color: '#2e7d32', fontWeight: 700, fontSize: '15px' }}>$</span>
            </button>
          )}
          <button
            className="row-action-btn danger"
            onClick={handleDeleteClick}
            aria-label={confirmingDelete ? 'Confirm delete' : 'Delete project'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 7h16" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
              <path d="M9 7v-2a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
          <button
            className="row-action-btn icon-age"
            onClick={() => onAge(project.id)}
            aria-label="Age this project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5l0 14" />
              <path d="M18 11l-6 -6" />
              <path d="M6 11l6 -6" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
