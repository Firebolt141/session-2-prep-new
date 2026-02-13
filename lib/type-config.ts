import { CollectionType } from '@/types/models';

export function normalizeType(value: string): CollectionType | null {
  if (value === 'trips' || value === 'events' || value === 'todos' || value === 'wishlist') {
    return value;
  }
  return null;
}
