import { describe, it, expect } from 'vitest';
import { getBookingsForRoom } from './bookingSelectors';
import { bookings } from '@/data/rooms';

describe('getBookingsForRoom', () => {
  it('returns only bookings for the selected room', () => {
    const result = getBookingsForRoom(bookings, 'lib-201');
    expect(result.length).toBe(3);
    expect(result.every((b) => b.roomId === 'lib-201')).toBe(true);
  });

  it('sorts bookings by start time', () => {
    const result = getBookingsForRoom(bookings, 'lib-201');
    expect(result).toEqual([...result].sort((a, b) => a.start - b.start));
  });

  it('returns an empty array for an unknown room', () => {
    expect(getBookingsForRoom(bookings, 'UNKNOWN')).toEqual([]);
  });

  it('does not mutate the original bookings array', () => {
    const original = structuredClone(bookings);
    getBookingsForRoom(bookings, 'lib-201');
    expect(bookings).toEqual(original);
  });
});
