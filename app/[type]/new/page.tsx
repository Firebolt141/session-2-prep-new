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
    <main className="min-h-screen bg-pink-50 p-4">
      <h1 className="mb-4 text-2xl font-bold capitalize text-pink-900">New {type.slice(0, -1)}</h1>
      <div className="rounded-2xl bg-white p-4 shadow">
        <ItemForm
          type={type}
          onSubmit={async (payload) => {
            await createItem(type, payload);
            router.push(`/${type}`);
          }}
        />
      </div>
    </main>
  );
}
