'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-100 to-fuchsia-50 p-4">
      <section className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-lg">
        <p className="mb-3 text-sm text-pink-500">Hi Asuka 🌸</p>
        <h1 className="mb-8 text-3xl font-bold text-pink-900">Plan your days together</h1>
        <button
          className="w-full rounded-2xl bg-pink-500 py-3 text-lg font-semibold text-white shadow"
          onClick={() => router.push('/home')}
          type="button"
        >
          Let&apos;s go
        </button>
      </section>
    </main>
  );
}
