'use client';

import { useEffect, useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { fetchNishiWasedaWeather, weatherEmoji } from '@/lib/weather';
import { subscribeItems } from '@/lib/firestore';
import { Event, Todo, Trip, Wishlist } from '@/types/models';
import { isDateMatch } from '@/lib/date-utils';
import { ItemCard } from '@/components/cards';
import { HamburgerMenu } from '@/components/menu';

export default function HomePage() {
  const [selected, setSelected] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [weather, setWeather] = useState<{ temperature: number; weatherCode: number } | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);

  useEffect(() => {
    fetchNishiWasedaWeather().then(setWeather).catch(() => setWeather(null));
    const unsubTrips = subscribeItems<Trip>('trips', setTrips);
    const unsubEvents = subscribeItems<Event>('events', setEvents);
    const unsubTodos = subscribeItems<Todo>('todos', setTodos);
    const unsubWish = subscribeItems<Wishlist>('wishlist', setWishlist);
    return () => {
      unsubTrips();
      unsubEvents();
      unsubTodos();
      unsubWish();
    };
  }, []);

  const filtered = useMemo(
    () => ({
      trips: trips.filter((trip) => isDateMatch(trip.fromDate, selected) || isDateMatch(trip.toDate, selected)),
      events: events.filter((event) => isDateMatch(event.date, selected)),
      todos: todos.filter((todo) => isDateMatch(todo.date, selected)),
      wishlist,
    }),
    [events, selected, todos, trips, wishlist],
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-xl space-y-4 p-4">
      <header className="flex items-center justify-between gap-2">
        <HamburgerMenu open={menuOpen} onToggle={() => setMenuOpen((prev) => !prev)} />
        <div className="glass-panel px-4 py-2 text-sm font-medium">
          {weather ? `${weatherEmoji(weather.weatherCode)} ${weather.temperature}°C · Nishi-Waseda` : 'Loading weather...'}
        </div>
      </header>

      <section className="glass-panel p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-800">Your Calendar</h2>
          <button
            className="subtle-button"
            onClick={() => {
              const now = new Date();
              setMonth(now);
              setSelected(now);
            }}
            type="button"
          >
            Today
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl bg-white/70 p-2">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(day) => day && setSelected(day)}
            month={month}
            onMonthChange={setMonth}
          />
        </div>
      </section>

      <div className="flex justify-end">
        <Link href="/events/new" className="cute-button inline-flex items-center gap-2">
          <Plus size={16} /> Add item
        </Link>
      </div>

      <section className="space-y-5 pb-10">
        {(['trips', 'events', 'todos', 'wishlist'] as const).map((type) => (
          <div key={type}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-base font-bold capitalize text-zinc-800">{type}</h3>
              <Link href={`/${type}`} className="text-xs font-medium text-pink-600 hover:underline">
                See all
              </Link>
            </div>
            <div className="space-y-3">
              {filtered[type].map((item) => (
                <ItemCard key={item.id} type={type} item={item} onRefresh={() => undefined} />
              ))}
              {filtered[type].length === 0 && (
                <div className="rounded-2xl border border-dashed border-pink-200 bg-white/50 p-4 text-sm text-zinc-500">
                  No {type} for this day yet.
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
