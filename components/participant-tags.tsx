'use client';

import { useState } from 'react';

export function ParticipantTags({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const normalized = input.trim();
    if (!normalized || value.includes(normalized)) return;
    onChange([...value, normalized]);
    setInput('');
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-pink-900">Participants</label>
      <div className="flex gap-2">
        <input
          className="w-full rounded-xl border border-pink-100 px-3 py-2"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Add a name"
        />
        <button className="rounded-xl bg-pink-500 px-3 text-white" type="button" onClick={addTag}>
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <button
            key={tag}
            type="button"
            className="rounded-full bg-pink-100 px-3 py-1 text-xs text-pink-700"
            onClick={() => onChange(value.filter((person) => person !== tag))}
          >
            {tag} ✕
          </button>
        ))}
      </div>
    </div>
  );
}
