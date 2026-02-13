import { format, isBefore, isSameDay, isWithinInterval, parseISO } from 'date-fns';
import { Event, Trip } from '@/types/models';

export const todayIsoDate = () => format(new Date(), 'yyyy-MM-dd');

export const isDateMatch = (targetIso: string, selected: Date) =>
  isSameDay(parseISO(targetIso), selected);

export const isDateInTripRange = (trip: Trip, selected: Date) =>
  isWithinInterval(selected, {
    start: parseISO(trip.fromDate),
    end: parseISO(trip.toDate),
  });

export const isTripCompleted = (trip: Trip) =>
  isBefore(parseISO(trip.toDate), new Date());

export const isEventCompleted = (event: Event) => {
  const endTime = event.toTime ?? event.fromTime;
  const eventDateTime = new Date(`${event.date}T${endTime}`);
  return isBefore(eventDateTime, new Date());
};
