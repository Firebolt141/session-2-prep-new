'use client';

import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-5">
      <div className="absolute -left-20 -top-12 h-56 w-56 rounded-full bg-pink-300/40 blur-3xl" />
      <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-fuchsia-300/50 blur-3xl" />

      <section className="glass-panel relative z-10 w-full max-w-sm p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
          <Sparkles size={24} />
        </div>
        <p className="mb-2 text-sm font-medium text-pink-500">Hi Asuka 🌸</p>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-zinc-800">Plan your happy moments</h1>
        <p className="mb-8 text-sm text-zinc-500">A cozy little planner for trips, dates, todos, and wishes.</p>

        <button className="cute-button w-full py-3 text-base" onClick={() => router.push('/home')} type="button">
          Let&apos;s go ✨
        </button>
      </section>
    </main>
  );
}
