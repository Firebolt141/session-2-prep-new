import { describe, expect, it, vi } from 'vitest';
import { isDateInTripRange, isEventCompleted, isTripCompleted, todayIsoDate } from '@/lib/date-utils';

vi.useFakeTimers();
vi.setSystemTime(new Date('2026-02-13T12:00:00'));

describe('date utils', () => {
  it('returns today date in ISO format', () => {
    expect(todayIsoDate()).toBe('2026-02-13');
  });

  it('marks trips as complete after end date', () => {
    expect(
      isTripCompleted({
        id: '1',
        memo: 'Trip',
        participants: [],
        createdAt: '',
        fromDate: '2026-02-01',
        toDate: '2026-02-10',
        location: 'Tokyo',
      }),
    ).toBe(true);
  });

  it('treats date between from/to as part of the trip range', () => {
    expect(
      isDateInTripRange(
        {
          id: '1',
          memo: 'Trip',
          participants: [],
          createdAt: '',
          fromDate: '2026-02-10',
          toDate: '2026-02-15',
          location: 'Tokyo',
        },
        new Date('2026-02-13T10:00:00'),
      ),
    ).toBe(true);
  });

  it('marks events complete after end time', () => {
    expect(
      isEventCompleted({
        id: '2',
        memo: 'Lunch',
        participants: [],
        createdAt: '',
        date: '2026-02-13',
        fromTime: '09:00',
        toTime: '10:00',
        location: 'Cafe',
      }),
    ).toBe(true);
  });
});
