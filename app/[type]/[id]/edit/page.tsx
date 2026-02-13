'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ItemForm, FormData } from '@/components/item-form';
import { getItems, updateItem } from '@/lib/firestore';
import { normalizeType } from '@/lib/type-config';

export default function EditPage({ params }: { params: { type: string; id: string } }) {
  const type = normalizeType(params.type);
  const [item, setItem] = useState<FormData | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!type) return;
    getItems<FormData & { id: string }>(type).then((items) => {
      const found = items.find((entry) => entry.id === params.id) ?? null;
      setItem(found);
    });
  }, [params.id, type]);

  if (!type) return <p className="p-4">Unknown type.</p>;
  if (!item) return <p className="p-4">Loading...</p>;

  return (
    <main className="mx-auto min-h-screen w-full max-w-xl p-4">
      <h1 className="mb-4 text-2xl font-extrabold capitalize text-zinc-800">Edit {type.slice(0, -1)}</h1>
      <div className="glass-panel p-4">
        <ItemForm
          type={type}
          initial={item}
          onSubmit={async (payload) => {
            await updateItem(type, params.id, payload);
            router.push(`/${type}`);
          }}
        />
      </div>
    </main>
  );
}
