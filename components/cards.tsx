'use client';

import Link from 'next/link';
import { Clock3, MapPin, Trash2 } from 'lucide-react';
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
      className="glass-panel space-y-2 p-4 transition hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className={`text-[15px] font-bold ${completed ? 'text-zinc-400 line-through' : 'text-zinc-800'}`}>
          {item.memo}
        </h3>
        <div className="flex items-center gap-3 text-xs">
          <Link
            className="font-semibold text-blue-600 hover:underline"
            href={`/${type}/${item.id}/edit`}
            onClick={(event) => event.stopPropagation()}
          >
            Edit
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

      {'location' in item && item.location && (
        <p className="flex items-center gap-1 text-sm text-zinc-600">
          <MapPin size={14} className="text-pink-500" /> {item.location}
        </p>
      )}
      {'fromDate' in item && <p className="text-sm text-zinc-600">🗓️ {dateText(item.fromDate)} → {dateText(item.toDate)}</p>}
      {'date' in item && <p className="text-sm text-zinc-600">🗓️ {dateText(item.date)}</p>}
      {'fromTime' in item && (
        <p className="flex items-center gap-1 text-sm text-zinc-600">
          <Clock3 size={14} className="text-pink-500" /> {item.fromTime}
          {item.toTime ? ` - ${item.toTime}` : ''}
        </p>
      )}

      {item.participants.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {item.participants.map((person) => (
            <span key={person} className="rounded-full bg-pink-100 px-2 py-1 text-[11px] text-pink-700">
              {person}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
