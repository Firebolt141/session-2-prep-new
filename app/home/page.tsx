'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import Link from 'next/link';
import { CalendarPlus, ChevronDown, Heart, LogOut, Plane, SquareCheckBig } from 'lucide-react';
import { fetchNishiWasedaWeather, weatherEmoji } from '@/lib/weather';
import { subscribeItems } from '@/lib/firestore';
import { Event, Todo, Trip, Wishlist, CollectionType } from '@/types/models';
import { isDateInTripRange, isDateMatch } from '@/lib/date-utils';
import { ItemCard } from '@/components/cards';
import { HamburgerMenu } from '@/components/menu';

const addTypes: { type: CollectionType; label: string; icon: ReactNode }[] = [
  { type: 'events', label: 'Event', icon: <CalendarPlus size={14} /> },
  { type: 'trips', label: 'Trip', icon: <Plane size={14} /> },
  { type: 'todos', label: 'Todo', icon: <SquareCheckBig size={14} /> },
  { type: 'wishlist', label: 'Wishlist', icon: <Heart size={14} /> },
];

export default function HomePage() {
  const [selected, setSelected] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
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
      trips: trips.filter((trip) => isDateInTripRange(trip, selected)),
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
          <p className="text-sm font-semibold text-pink-600">You&apos;re doing amazing — pick a date and make it special ✨</p>
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

        <div className="overflow-x-auto rounded-2xl border border-pink-100 bg-gradient-to-b from-white to-pink-50 p-2 shadow-inner">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(day) => day && setSelected(day)}
            month={month}
            onMonthChange={setMonth}
            className="mx-auto"
          />
        </div>
      </section>

      <div className="relative flex justify-end">
        <button className="cute-button inline-flex items-center gap-2" onClick={() => setAddOpen((prev) => !prev)} type="button">
          Add item <ChevronDown size={16} className={addOpen ? 'rotate-180 transition' : 'transition'} />
        </button>
        {addOpen && (
          <div className="glass-panel absolute right-0 top-12 z-20 w-44 p-2">
            {addTypes.map((entry) => (
              <Link
                key={entry.type}
                href={`/${entry.type}/new`}
                onClick={() => setAddOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-pink-100/70"
              >
                {entry.icon}
                {entry.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <section className="space-y-5 pb-2">
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

      <footer className="pb-8 pt-2">
        <Link href="/" className="subtle-button flex w-full items-center justify-center gap-2">
          <LogOut size={15} /> Logout
        </Link>
      </footer>
    </main>
  );
}
