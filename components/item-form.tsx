'use client';

import { useMemo, useRef, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { ParticipantTags } from '@/components/participant-tags';
import { CollectionType } from '@/types/models';

export type FormData = Record<string, string | boolean | string[]>;

type TimeInput = HTMLInputElement & { showPicker?: () => void };

const labelMap: Record<string, string> = {
  fromDate: 'From date',
  toDate: 'To date',
  date: 'Date',
  fromTime: 'From time',
  toTime: 'To time (optional)',
  location: 'Location',
  memo: 'Memo',
};

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
  const fromTimeRef = useRef<TimeInput>(null);
  const toTimeRef = useRef<TimeInput>(null);

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

  const openTimePicker = (ref: React.RefObject<TimeInput | null>) => {
    if (ref.current?.showPicker) ref.current.showPicker();
    ref.current?.focus();
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

            <div className="relative">
              <input
                ref={field === 'fromTime' ? fromTimeRef : field === 'toTime' ? toTimeRef : undefined}
                required={field !== 'toTime'}
                type={field.includes('date') ? 'date' : isTime ? 'time' : 'text'}
                step={isTime ? 300 : undefined}
                className="w-full rounded-xl border border-pink-200 bg-white px-3 py-2 pr-10 outline-none ring-pink-200 transition focus:ring"
                value={String(form[field] ?? '')}
                onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                placeholder={field === 'memo' ? 'Write a sweet note...' : ''}
              />

              {isTime && (
                <button
                  type="button"
                  aria-label={`Open ${field} picker`}
                  onClick={() => openTimePicker(field === 'fromTime' ? fromTimeRef : toTimeRef)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-pink-600 hover:bg-pink-100"
                >
                  <Clock3 size={16} />
                </button>
              )}
            </div>
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
