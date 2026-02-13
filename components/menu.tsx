'use client';

import { CalendarDays, Heart, Plane, SquareCheckBig, X } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { label: 'Trips', href: '/trips', icon: Plane },
  { label: 'Events', href: '/events', icon: CalendarDays },
  { label: 'Todos', href: '/todos', icon: SquareCheckBig },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
  { label: 'Past events', href: '/past-events', icon: CalendarDays },
];

export function HamburgerMenu({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div className="relative">
      <button className="subtle-button px-3" onClick={onToggle} type="button">
        {open ? <X size={18} /> : '☰'}
      </button>
      {open && (
        <div className="glass-panel absolute left-0 top-12 z-30 w-56 p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-pink-100/70" href={item.href}>
                    <Icon size={15} className="text-pink-600" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
