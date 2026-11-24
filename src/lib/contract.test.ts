import { describe, it, expect } from 'vitest';
import {
  checkAvailabilityContract,
  ContractInput,
  ReasonCode,
  REFERENCE_TIME,
} from '@/lib/contract';
import { bookings } from '@/data/rooms';

const lib201Bookings = bookings.filter((b) => b.roomId === 'lib-201');

function makeInput(
  overrides: Partial<ContractInput> = {}
): ContractInput {
  return {
    startTime: '11:00',
    duration: 60,
    roomId: 'lib-201',
    blocked: false,
    bookings: lib201Bookings,
    currentTime: REFERENCE_TIME,
    ...overrides,
  };
}

describe('Shared contract output shape', () => {
  it('returns availability, reasonCode, and message on a valid request', () => {
    const result = checkAvailabilityContract(makeInput());

    expect(typeof result.availability).toBe('boolean');
    expect(result.availability).toBe(true);
    expect(result.reasonCode).toBe('AVAILABLE');
    expect(typeof result.message).toBe('string');
    expect(result.message.length).toBeGreaterThan(0);
  });

  it('reasonCode is always one of the canonical codes', () => {
    const validCodes: ReasonCode[] = [
      'AVAILABLE',
      'INVALID_TIME',
      'PAST_START',
      'INVALID_DURATION',
      'BOOKING_OVERLAP',
      'ROOM_BLOCKED',
    ];

    const cases: ContractInput[] = [
      makeInput(),
      makeInput({ startTime: '07:00' }),
      makeInput({ duration: 0 }),
      makeInput({ duration: 121 }),
      makeInput({ startTime: '10:00', duration: 60 }),
      makeInput({ roomId: 'sci-310', blocked: true }),
      makeInput({ startTime: 'invalid' }),
    ];

    for (const input of cases) {
      const result = checkAvailabilityContract(input);
      expect(validCodes).toContain(result.reasonCode);
    }
  });

  it('availability is false for every non-AVAILABLE reason code', () => {
    const cases: ContractInput[] = [
      makeInput({ startTime: '07:00' }),
      makeInput({ duration: 0 }),
      makeInput({ duration: 121 }),
      makeInput({ startTime: '10:00', duration: 60 }),
      makeInput({ roomId: 'sci-310', blocked: true }),
      makeInput({ startTime: 'invalid' }),
    ];

    for (const input of cases) {
      const result = checkAvailabilityContract(input);
      if (result.reasonCode !== 'AVAILABLE') {
        expect(result.availability).toBe(false);
      }
    }
  });
});

describe('Eight acceptance tests (shared contract)', () => {
  it('T1: valid free interval → AVAILABLE', () => {
    const result = checkAvailabilityContract(
      makeInput({ startTime: '11:00', duration: 60 })
    );
    expect(result.availability).toBe(true);
    expect(result.reasonCode).toBe('AVAILABLE');
  });

  it('T2: overlap with existing booking → BOOKING_OVERLAP', () => {
    const result = checkAvailabilityContract(
      makeInput({ startTime: '10:00', duration: 60 })
    );
    expect(result.availability).toBe(false);
    expect(result.reasonCode).toBe('BOOKING_OVERLAP');
  });

  it('T3: blocked room → ROOM_BLOCKED', () => {
    const result = checkAvailabilityContract(
      makeInput({ roomId: 'sci-310', blocked: true, startTime: '09:00', duration: 60 })
    );
    expect(result.availability).toBe(false);
    expect(result.reasonCode).toBe('ROOM_BLOCKED');
  });

  it('T4: zero duration → INVALID_DURATION', () => {
    const result = checkAvailabilityContract(
      makeInput({ startTime: '11:00', duration: 0 })
    );
    expect(result.availability).toBe(false);
    expect(result.reasonCode).toBe('INVALID_DURATION');
  });

  it('T5: duration exceeds maximum → INVALID_DURATION', () => {
    const result = checkAvailabilityContract(
      makeInput({ startTime: '11:00', duration: 121 })
    );
    expect(result.availability).toBe(false);
    expect(result.reasonCode).toBe('INVALID_DURATION');
  });

  it('T6: past start time → PAST_START', () => {
    const result = checkAvailabilityContract(
      makeInput({ startTime: '07:00', duration: 60 })
    );
    expect(result.availability).toBe(false);
    expect(result.reasonCode).toBe('PAST_START');
  });

  it('T7: adjacent non-overlapping interval → AVAILABLE', () => {
    const result = checkAvailabilityContract(
      makeInput({ startTime: '10:30', duration: 60 })
    );
    expect(result.availability).toBe(true);
    expect(result.reasonCode).toBe('AVAILABLE');
  });

  it('T8: booking data integrity — data unchanged after check', () => {
    const snapshot = JSON.parse(JSON.stringify(lib201Bookings));

    checkAvailabilityContract(
      makeInput({ startTime: '11:00', duration: 60 })
    );

    expect(lib201Bookings).toEqual(snapshot);
    expect(lib201Bookings.length).toBe(snapshot.length);
  });
});

describe('Invalid input feedback (AC6)', () => {
  it('invalid startTime format → INVALID_TIME with understandable message', () => {
    const result = checkAvailabilityContract(
      makeInput({ startTime: '25:99' })
    );
    expect(result.availability).toBe(false);
    expect(result.reasonCode).toBe('INVALID_TIME');
    expect(result.message).toContain('valid');
  });

  it('invalid currentTime format → INVALID_TIME', () => {
    const result = checkAvailabilityContract(
      makeInput({ currentTime: 'not-a-time' })
    );
    expect(result.availability).toBe(false);
    expect(result.reasonCode).toBe('INVALID_TIME');
  });

  it('negative duration → INVALID_DURATION', () => {
    const result = checkAvailabilityContract(
      makeInput({ duration: -10 })
    );
    expect(result.availability).toBe(false);
    expect(result.reasonCode).toBe('INVALID_DURATION');
  });
});
