'use client';

import { useRouter } from 'next/navigation';
import { ItemForm } from '@/components/item-form';
import { createItem } from '@/lib/firestore';
import { normalizeType } from '@/lib/type-config';

export default function NewItemPage({ params }: { params: { type: string } }) {
  const type = normalizeType(params.type);
  const router = useRouter();

  if (!type) return <p className="p-4">Unknown type.</p>;

  return (
    <main className="mx-auto min-h-screen w-full max-w-xl p-4">
      <h1 className="mb-4 text-2xl font-extrabold capitalize text-zinc-800">New {type.slice(0, -1)}</h1>
      <div className="glass-panel p-4">
        <ItemForm
          type={type}
          onSubmit={async (payload) => {
            await createItem(type, payload);
            router.push(`/${type}`);
            router.refresh();
          }}
        />
      </div>
    </main>
  );
}
