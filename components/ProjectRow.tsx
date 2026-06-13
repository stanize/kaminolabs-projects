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
}

export default function ProjectRow({
  project,
  onFieldSave,
  onToggleStatus,
  onDelete,
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
            >
              Backburner
            </button>
          ) : (
            <button
              className="row-action-btn"
              onClick={() => onToggleStatus(project.id, 'active')}
            >
              Activate
            </button>
          )}
          <button
            className="row-action-btn danger"
            onClick={handleDeleteClick}
          >
            {confirmingDelete ? 'Confirm?' : 'Delete'}
          </button>
        </div>
      </td>
    </tr>
  );
}
