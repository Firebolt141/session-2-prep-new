'use client';

import { useEffect, useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import Link from 'next/link';
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
    <main className="min-h-screen bg-pink-50 p-4 text-zinc-800">
      <header className="mb-4 flex items-center justify-between">
        <HamburgerMenu open={menuOpen} onToggle={() => setMenuOpen((prev) => !prev)} />
        <div className="rounded-full bg-white px-4 py-2 text-sm shadow">
          {weather ? `${weatherEmoji(weather.weatherCode)} ${weather.temperature}°C` : 'Tokyo weather...'}
        </div>
      </header>

      <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-pink-100">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold text-pink-900">Calendar</h2>
          <button
            className="rounded-xl bg-pink-100 px-3 py-1 text-sm text-pink-700"
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
        <div className="overflow-x-auto">
          <DayPicker mode="single" selected={selected} onSelect={(day) => day && setSelected(day)} month={month} onMonthChange={setMonth} />
        </div>
      </section>

      <div className="mt-4 flex justify-end">
        <Link href="/events/new" className="rounded-xl bg-pink-500 px-4 py-2 text-sm font-semibold text-white">
          + Add item
        </Link>
      </div>

      <section className="mt-4 space-y-4">
        {(['trips', 'events', 'todos', 'wishlist'] as const).map((type) => (
          <div key={type}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold capitalize text-pink-900">{type}</h3>
              <Link href={`/${type}`} className="text-xs text-blue-500">See all</Link>
            </div>
            <div className="space-y-3">
              {filtered[type].map((item) => (
                <ItemCard key={item.id} type={type} item={item} onRefresh={() => undefined} />
              ))}
              {filtered[type].length === 0 && <p className="text-sm text-zinc-500">No items yet.</p>}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
