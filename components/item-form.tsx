'use client';

import { useMemo, useState } from 'react';
import { ParticipantTags } from '@/components/participant-tags';
import { CollectionType } from '@/types/models';

export type FormData = Record<string, string | boolean | string[]>;

const labelMap: Record<string, string> = {
  fromDate: 'From date',
  toDate: 'To date',
  date: 'Date',
  fromTime: 'From time',
  toTime: 'To time (optional)',
  location: 'Location',
  memo: 'Memo',
};

const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const hour = String(Math.floor(index / 2)).padStart(2, '0');
  const minute = index % 2 === 0 ? '00' : '30';
  return `${hour}:${minute}`;
});

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
  const [submitting, setSubmitting] = useState(false);

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
        if (message) return setError(message);

        try {
          setSubmitting(true);
          setError('');
          await onSubmit(form);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Could not save item. Please try again.');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {fields.map((field) => {
        const isTime = field.includes('time');

        return (
          <label key={field} className="flex flex-col gap-1 text-sm font-semibold text-zinc-700">
            {labelMap[field] ?? field}
            {isTime ? (
              <select
                required={field !== 'toTime'}
                className="w-full rounded-xl border border-pink-200 bg-white px-3 py-2 outline-none ring-pink-200 transition focus:ring"
                value={String(form[field] ?? '')}
                onChange={(event) => setForm({ ...form, [field]: event.target.value })}
              >
                <option value="">Select time</option>
                {timeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                required={field !== 'toTime'}
                type={field.includes('date') ? 'date' : 'text'}
                className="w-full rounded-xl border border-pink-200 bg-white px-3 py-2 outline-none ring-pink-200 transition focus:ring"
                value={String(form[field] ?? '')}
                onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                placeholder={field === 'memo' ? 'Write a sweet note...' : ''}
              />
            )}
          </label>
        );
      })}

      <ParticipantTags
        value={(form.participants as string[]) ?? []}
        onChange={(participants) => setForm({ ...form, participants })}
      />

      {error && <p className="rounded-xl bg-rose-50 p-2 text-sm text-rose-600">{error}</p>}
      <button disabled={submitting} className="cute-button w-full py-3 disabled:cursor-not-allowed disabled:opacity-70">
        {submitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
