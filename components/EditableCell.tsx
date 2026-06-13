'use client';

import { useEffect, useRef, useState } from 'react';

interface EditableCellProps {
  value: string;
  placeholder?: string;
  onSave: (newValue: string) => void;
  multiline?: boolean;
  className?: string;
}

// A text cell that behaves like Google Keep: type, click away, it's saved.
// Only fires onSave if the value actually changed since last save.
export default function EditableCell({
  value,
  placeholder,
  onSave,
  multiline = true,
  className = '',
}: EditableCellProps) {
  const [draft, setDraft] = useState(value);
  const savedValueRef = useRef(value);

  // Keep local draft in sync if the underlying value changes externally
  // (e.g. after a save round-trip or initial load).
  useEffect(() => {
    setDraft(value);
    savedValueRef.current = value;
  }, [value]);

  const handleBlur = () => {
    if (draft !== savedValueRef.current) {
      savedValueRef.current = draft;
      onSave(draft);
    }
  };

  const sharedProps = {
    className: `cell-input ${className}`,
    value: draft,
    placeholder,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
      setDraft(e.target.value),
    onBlur: handleBlur,
  };

  if (multiline) {
    return (
      <textarea
        {...sharedProps}
        rows={2}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = 'auto';
          el.style.height = `${el.scrollHeight}px`;
        }}
      />
    );
  }

  return <input type="text" {...sharedProps} />;
}
