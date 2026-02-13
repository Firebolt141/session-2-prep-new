'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { isBefore, parseISO, startOfDay } from 'date-fns';
import { ItemCard } from '@/components/cards';
import { getItems } from '@/lib/firestore';
import { normalizeType } from '@/lib/type-config';
import { Event, Trip, ItemRecord, CollectionType } from '@/types/models';

export default function TypeListPage({ params }: { params: { type: string } }) {
  const [items, setItems] = useState<ItemRecord[]>([]);
  const type = normalizeType(params.type);

  useEffect(() => {
    if (!type) return;
    getItems<ItemRecord>(type).then(setItems);
  }, [type]);

  const data = useMemo(() => {
    if (params.type !== 'past-events') return items;
    const today = startOfDay(new Date());
    return items.filter((item) => {
      if ('toDate' in item) return isBefore(parseISO((item as Trip).toDate), today);
      if ('date' in item) return isBefore(parseISO((item as Event).date), today);
      return false;
    });
  }, [items, params.type]);

  const collectionForNew: CollectionType = type ?? 'events';

  return (
    <main className="min-h-screen bg-pink-50 p-4">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize text-pink-900">{params.type.replace('-', ' ')}</h1>
        {params.type !== 'past-events' && (
          <Link href={`/${collectionForNew}/new`} className="rounded-xl bg-pink-500 px-4 py-2 text-white">Add</Link>
        )}
      </header>
      <section className="space-y-3">
        {data.map((item) => (
          <ItemCard
            key={item.id}
            type={type ?? 'events'}
            item={item}
            onRefresh={() => getItems<ItemRecord>(type ?? 'events').then(setItems)}
          />
        ))}
        {data.length === 0 && <p className="text-sm text-zinc-500">Nothing here yet.</p>}
      </section>
    </main>
  );
}
