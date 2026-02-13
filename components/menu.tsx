'use client';

import Link from 'next/link';

const menuItems = [
  { label: 'Trips', href: '/trips' },
  { label: 'Events', href: '/events' },
  { label: 'Todos', href: '/todos' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Past events', href: '/past-events' },
];

export function HamburgerMenu({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div className="relative">
      <button
        className="rounded-full bg-pink-100 px-3 py-2 text-pink-700 shadow"
        onClick={onToggle}
        type="button"
      >
        ☰
      </button>
      {open && (
        <div className="absolute left-0 top-12 z-20 w-48 rounded-2xl bg-white p-3 shadow-lg ring-1 ring-pink-100">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link className="block rounded-lg px-3 py-2 text-sm hover:bg-pink-50" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
