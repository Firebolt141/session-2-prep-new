'use client';

import Link from 'next/link';
import { CheckCircle2, Clock3, MapPin, Pencil, Trash2, UsersRound } from 'lucide-react';
import { format } from 'date-fns';
import { deleteItem, updateItem } from '@/lib/firestore';
import { CollectionType, Event, Todo, Trip, Wishlist } from '@/types/models';
import { isEventCompleted, isTripCompleted } from '@/lib/date-utils';

const dateText = (value?: string) => (value ? format(new Date(value), 'MMM d') : '');

export function ItemCard({
  type,
  item,
  onRefresh,
}: {
  type: CollectionType;
  item: Trip | Event | Todo | Wishlist;
  onRefresh: () => void;
}) {
  const completed =
    type === 'todos' || type === 'wishlist'
      ? Boolean((item as Todo | Wishlist).completed)
      : type === 'trips'
        ? isTripCompleted(item as Trip)
        : isEventCompleted(item as Event);

  const toggleComplete = async () => {
    if (type !== 'todos' && type !== 'wishlist') return;
    const current = (item as Todo | Wishlist).completed;
    await updateItem(type, item.id, { completed: !current });
    onRefresh();
  };

  return (
    <article
      onClick={toggleComplete}
      className="group relative overflow-hidden rounded-2xl border border-pink-100 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-400 to-fuchsia-400" />

      <div className="mb-2 flex items-start justify-between gap-3 pt-1">
        <h3 className={`text-[15px] font-semibold ${completed ? 'text-zinc-400 line-through' : 'text-zinc-800'}`}>
          {item.memo}
        </h3>
        <div className="flex items-center gap-3 text-xs">
          <Link
            className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline"
            href={`/${type}/${item.id}/edit`}
            onClick={(event) => event.stopPropagation()}
          >
            <Pencil size={12} /> Edit
          </Link>
          <button
            className="text-rose-500"
            onClick={async (event) => {
              event.stopPropagation();
              await deleteItem(type, item.id);
              onRefresh();
            }}
            type="button"
            aria-label="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-1.5 text-sm text-zinc-600">
        {'location' in item && item.location && (
          <p className="flex items-center gap-1.5">
            <MapPin size={14} className="text-pink-500" /> {item.location}
          </p>
        )}
        {'fromDate' in item && <p>🗓️ {dateText(item.fromDate)} → {dateText(item.toDate)}</p>}
        {'date' in item && <p>🗓️ {dateText(item.date)}</p>}
        {'fromTime' in item && (
          <p className="flex items-center gap-1.5">
            <Clock3 size={14} className="text-pink-500" /> {item.fromTime}
            {item.toTime ? ` - ${item.toTime}` : ''}
          </p>
        )}
      </div>

      {item.participants.length > 0 && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-pink-50 p-2">
          <UsersRound size={14} className="mt-0.5 text-pink-500" />
          <div className="flex flex-wrap gap-1">
            {item.participants.map((person) => (
              <span key={person} className="rounded-full bg-white px-2 py-1 text-[11px] text-pink-700 ring-1 ring-pink-100">
                {person}
              </span>
            ))}
          </div>
        </div>
      )}

      {completed && (
        <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
          <CheckCircle2 size={12} /> Completed
        </div>
      )}
    </article>
  );
}
