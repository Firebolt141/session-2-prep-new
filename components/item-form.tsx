'use client';

import { useMemo, useState } from 'react';
import { ParticipantTags } from '@/components/participant-tags';
import { CollectionType } from '@/types/models';

export type FormData = Record<string, string | boolean | string[]>;

export function ItemForm({
  type,
  initial,
  onSubmit,
}: {
  type: CollectionType;
  initial?: FormData;
  onSubmit: (payload: FormData) => Promise<void>;
}) {
  const [form, setForm] = useState<FormData>(
    initial ?? {
      fromDate: '',
      toDate: '',
      date: '',
      fromTime: '',
      toTime: '',
      location: '',
      memo: '',
      participants: [],
      completed: false,
    },
  );
  const [error, setError] = useState('');

  const fields = useMemo(() => {
    if (type === 'trips') return ['fromDate', 'toDate', 'location', 'memo'];
    if (type === 'events') return ['date', 'fromTime', 'toTime', 'location', 'memo'];
    if (type === 'todos') return ['date', 'location', 'memo'];
    return ['memo'];
  }, [type]);

  const validate = () => {
    if (type === 'trips' && String(form.fromDate) > String(form.toDate)) {
      return 'Trip start date must be before end date.';
    }
    if (type === 'events' && form.toTime && String(form.fromTime) > String(form.toTime)) {
      return 'Event end time must be after start time.';
    }
    return '';
  };

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const message = validate();
        if (message) {
          setError(message);
          return;
        }
        setError('');
        await onSubmit(form);
      }}
    >
      {fields.map((field) => (
        <label key={field} className="flex flex-col gap-1 text-sm font-semibold text-pink-900">
          {field}
          <input
            required={field !== 'toTime'}
            type={field.toLowerCase().includes('date') ? 'date' : field.toLowerCase().includes('time') ? 'time' : 'text'}
            className="rounded-xl border border-pink-100 px-3 py-2"
            value={String(form[field] ?? '')}
            onChange={(event) => setForm({ ...form, [field]: event.target.value })}
          />
        </label>
      ))}
      <ParticipantTags
        value={(form.participants as string[]) ?? []}
        onChange={(participants) => setForm({ ...form, participants })}
      />
      {error && <p className="text-sm text-rose-500">{error}</p>}
      <button className="w-full rounded-xl bg-pink-500 py-3 font-semibold text-white">Save</button>
    </form>
  );
}
