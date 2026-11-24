import { describe, it, expect } from 'vitest';
import { checkAvailabilityContract } from '@/lib/contract';
import { bookings as cbBookings, rooms as cbRooms } from '@/data/rooms';
import { checkAvailability as checkLowCode } from '../../../low-code/src/lib/availability';
import { bookings as lcBookings, rooms as lcRooms } from '../../../low-code/src/data/rooms';

const REFERENCE_TIME = '08:00';

interface TestCase {
  id: string;
  description: string;
  startTime: string;
  duration: number;
  roomId: string;
  expectedAvailable: boolean;
  expectedReason: string;
}

const testCases: TestCase[] = [
  { id: 'T1', description: 'Valid free interval', startTime: '11:00', duration: 60, roomId: 'lib-201', expectedAvailable: true, expectedReason: 'AVAILABLE' },
  { id: 'T2', description: 'Overlapping booking', startTime: '10:00', duration: 60, roomId: 'lib-201', expectedAvailable: false, expectedReason: 'BOOKING_OVERLAP' },
  { id: 'T3', description: 'Blocked room', startTime: '09:00', duration: 60, roomId: 'sci-310', expectedAvailable: false, expectedReason: 'ROOM_BLOCKED' },
  { id: 'T4', description: 'Zero duration', startTime: '11:00', duration: 0, roomId: 'lib-201', expectedAvailable: false, expectedReason: 'INVALID_DURATION' },
  { id: 'T5', description: 'Duration exceeds max', startTime: '11:00', duration: 121, roomId: 'lib-201', expectedAvailable: false, expectedReason: 'INVALID_DURATION' },
  { id: 'T6', description: 'Past start time', startTime: '07:00', duration: 60, roomId: 'lib-201', expectedAvailable: false, expectedReason: 'PAST_START' },
  { id: 'T7', description: 'Adjacent non-overlapping', startTime: '10:30', duration: 60, roomId: 'lib-201', expectedAvailable: true, expectedReason: 'AVAILABLE' },
  { id: 'T8', description: 'Booking data integrity', startTime: '11:00', duration: 60, roomId: 'lib-201', expectedAvailable: true, expectedReason: 'AVAILABLE' },
];

function cbRoom(roomId: string) {
  return cbRooms.find((r) => r.id === roomId) ?? cbRooms[0];
}
function lcRoom(roomId: string) {
  return lcRooms.find((r) => r.id === roomId) ?? lcRooms[0];
}
function cbRoomBookings(roomId: string) {
  return cbBookings.filter((b) => b.roomId === roomId);
}
function lcRoomBookings(roomId: string) {
  return lcBookings
    .filter((b) => b.roomId === roomId)
    .map((b) => ({ start: b.start, end: b.end, title: b.title }));
}

describe('Task 05 — Identical acceptance tests across both implementations', () => {
  for (const tc of testCases) {
    it(`${tc.id}: ${tc.description} — both implementations match expected`, () => {
      const cbResult = checkAvailabilityContract({
        startTime: tc.startTime,
        duration: tc.duration,
        roomId: tc.roomId,
        blocked: cbRoom(tc.roomId).blocked,
        bookings: cbRoomBookings(tc.roomId),
        currentTime: REFERENCE_TIME,
      });

      const lcResult = checkLowCode({
        startTime: tc.startTime,
        duration: tc.duration,
        roomId: tc.roomId,
        blocked: lcRoom(tc.roomId).blocked,
        bookings: lcRoomBookings(tc.roomId),
        currentTime: REFERENCE_TIME,
      });

      expect(cbResult.availability).toBe(tc.expectedAvailable);
      expect(cbResult.reasonCode).toBe(tc.expectedReason);
      expect(lcResult.availability).toBe(tc.expectedAvailable);
      expect(lcResult.reasonCode).toBe(tc.expectedReason);
    });
  }

  it('T8: booking data integrity — both implementations leave data unchanged', () => {
    const cbSnapshot = JSON.parse(JSON.stringify(cbRoomBookings('lib-201')));
    const lcSnapshot = JSON.parse(JSON.stringify(lcRoomBookings('lib-201')));

    checkAvailabilityContract({
      startTime: '11:00',
      duration: 60,
      roomId: 'lib-201',
      blocked: false,
      bookings: cbRoomBookings('lib-201'),
      currentTime: REFERENCE_TIME,
    });

    checkLowCode({
      startTime: '11:00',
      duration: 60,
      roomId: 'lib-201',
      blocked: false,
      bookings: lcRoomBookings('lib-201'),
      currentTime: REFERENCE_TIME,
    });

    expect(cbRoomBookings('lib-201')).toEqual(cbSnapshot);
    expect(lcRoomBookings('lib-201')).toEqual(lcSnapshot);
  });

  it('both implementations produce the same reason code for every test case', () => {
    for (const tc of testCases) {
      const cbResult = checkAvailabilityContract({
        startTime: tc.startTime,
        duration: tc.duration,
        roomId: tc.roomId,
        blocked: cbRoom(tc.roomId).blocked,
        bookings: cbRoomBookings(tc.roomId),
        currentTime: REFERENCE_TIME,
      });

      const lcResult = checkLowCode({
        startTime: tc.startTime,
        duration: tc.duration,
        roomId: tc.roomId,
        blocked: lcRoom(tc.roomId).blocked,
        bookings: lcRoomBookings(tc.roomId),
        currentTime: REFERENCE_TIME,
      });

      expect(lcResult.reasonCode).toBe(cbResult.reasonCode);
      expect(lcResult.availability).toBe(cbResult.availability);
    }
  });
});
