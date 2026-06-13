'use client';

import { useState } from 'react';
import { ProjectStatus } from '@/lib/supabase';

interface NewProjectRowProps {
  status: ProjectStatus;
  onCreate: (name: string) => void;
}

// An empty row where only the project name is editable.
// On blur, if a non-empty name was entered, it creates the project.
export default function NewProjectRow({ onCreate }: NewProjectRowProps) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleBlur = () => {
    const trimmed = name.trim();
    if (trimmed && !saving) {
      setSaving(true);
      onCreate(trimmed);
      setName('');
      // Allow creating another new row shortly after.
      setTimeout(() => setSaving(false), 300);
    }
  };

  return (
    <tr>
      <td className="col-name">
        <input
          type="text"
          className="cell-input name-input"
          placeholder="+ Add project"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            }
          }}
        />
      </td>
      <td className="col-badge" />
      <td className="col-summary" />
      <td className="col-next" />
      <td className="col-hours" />
      <td className="col-action" />
    </tr>
  );
}
