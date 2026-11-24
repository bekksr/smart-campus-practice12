import type { Booking } from '@/data/rooms';

export function getBookingsForRoom(
  bookings: Booking[],
  roomId: string
): Booking[] {
  return bookings
    .filter((b) => b.roomId === roomId)
    .sort((a, b) => a.start - b.start);
}
