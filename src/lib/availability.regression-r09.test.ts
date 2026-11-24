import { describe, it, expect } from 'vitest';
import { checkAvailability, CheckRequest } from '@/lib/availability';
import { Room } from '@/data/rooms';

const openRoom: Room = {
  id: 'test-101',
  name: 'Test Room 101',
  building: 'Test Building',
  capacity: 10,
  blocked: false,
};

const baseValid: CheckRequest = {
  start: 540,
  end: 570,
  currentTime: 480,
  room: openRoom,
  existingBookings: [],
};

describe('R-09: non-finite inputs are rejected', () => {
  it('rejects NaN start time', () => {
    const result = checkAvailability({ ...baseValid, start: NaN });
    expect(result.status).toBe('unavailable');
  });

  it('rejects Infinity end time', () => {
    const result = checkAvailability({ ...baseValid, end: Infinity });
    expect(result.status).toBe('unavailable');
  });

  it('rejects NaN currentTime', () => {
    const result = checkAvailability({ ...baseValid, currentTime: NaN });
    expect(result.status).toBe('unavailable');
  });
});
