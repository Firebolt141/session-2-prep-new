'use client';

import Link from 'next/link';
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
      className="space-y-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-pink-100"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className={`font-semibold ${completed ? 'line-through text-zinc-400' : 'text-pink-900'}`}>
          {item.memo}
        </h3>
        <div className="flex gap-2 text-xs">
          <Link className="text-blue-500" href={`/${type}/${item.id}/edit`}>
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
          >
            Delete
          </button>
        </div>
      </div>
      {'location' in item && item.location && <p className="text-sm text-zinc-600">📍 {item.location}</p>}
      {'fromDate' in item && <p className="text-sm text-zinc-600">{dateText(item.fromDate)} → {dateText(item.toDate)}</p>}
      {'date' in item && <p className="text-sm text-zinc-600">🗓️ {dateText(item.date)}</p>}
      {'fromTime' in item && <p className="text-sm text-zinc-600">⏰ {item.fromTime}{item.toTime ? ` - ${item.toTime}` : ''}</p>}
      {item.participants.length > 0 && (
        <p className="text-xs text-zinc-500">With: {item.participants.join(', ')}</p>
      )}
    </article>
  );
}
