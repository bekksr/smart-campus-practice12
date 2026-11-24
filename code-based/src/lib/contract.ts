import { checkAvailability } from './availability';
import { rooms, bookings, Room, Booking } from '@/data/rooms';
import { timeToMinutes } from './time';

export const REFERENCE_TIME = '08:00';

export type ReasonCode =
  | 'AVAILABLE'
  | 'INVALID_TIME'
  | 'PAST_START'
  | 'INVALID_DURATION'
  | 'BOOKING_OVERLAP'
  | 'ROOM_BLOCKED';

export interface ContractInput {
  startTime: string;
  duration: number;
  roomId: string;
  blocked: boolean;
  bookings: Booking[];
  currentTime: string;
}

export interface ContractResult {
  availability: boolean;
  reasonCode: ReasonCode;
  message: string;
}

function findRoom(roomId: string): Room | undefined {
  return rooms.find((r) => r.id === roomId);
}

function toReasonCode(
  outcome: ReturnType<typeof checkAvailability>
): ReasonCode {
  if (outcome.status === 'available') {
    return 'AVAILABLE';
  }

  const reason = outcome.reason.toLowerCase();

  if (reason.includes('finite') || reason.includes('between') ||
      reason.includes('earlier') || reason.includes('valid times') ||
      reason.includes('hh:mm')) {
    return 'INVALID_TIME';
  }

  if (reason.includes('current time')) {
    return 'PAST_START';
  }

  if (reason.includes('duration') || reason.includes('2-hour') ||
      reason.includes('must be greater than zero') ||
      reason.includes('must be a positive')) {
    return 'INVALID_DURATION';
  }

  if (reason.includes('blocked')) {
    return 'ROOM_BLOCKED';
  }

  if (reason.includes('overlap')) {
    return 'BOOKING_OVERLAP';
  }

  return 'INVALID_TIME';
}

function toMessage(
  outcome: ReturnType<typeof checkAvailability>
): string {
  if (outcome.status === 'available') {
    return outcome.message;
  }
  return outcome.detail
    ? `${outcome.reason} ${outcome.detail}`
    : outcome.reason;
}

export function checkAvailabilityContract(
  input: ContractInput
): ContractResult {
  const start = timeToMinutes(input.startTime);
  const currentTime = timeToMinutes(input.currentTime);

  if (start === null) {
    return {
      availability: false,
      reasonCode: 'INVALID_TIME',
      message: `Start time "${input.startTime}" is not a valid HH:MM time.`,
    };
  }

  if (currentTime === null) {
    return {
      availability: false,
      reasonCode: 'INVALID_TIME',
      message: `Current time "${input.currentTime}" is not a valid HH:MM time.`,
    };
  }

  if (!Number.isFinite(input.duration) || input.duration <= 0) {
    return {
      availability: false,
      reasonCode: 'INVALID_DURATION',
      message: 'Duration must be greater than zero minutes.',
    };
  }

  if (input.duration > 120) {
    return {
      availability: false,
      reasonCode: 'INVALID_DURATION',
      message: `Requested duration (${input.duration} min) exceeds the 2-hour maximum.`,
    };
  }

  const room = findRoom(input.roomId);
  if (!room) {
    return {
      availability: false,
      reasonCode: 'INVALID_TIME',
      message: `Unknown room "${input.roomId}".`,
    };
  }

  const end = start + input.duration;

  const outcome = checkAvailability({
    start,
    end,
    currentTime,
    room: input.blocked ? { ...room, blocked: true } : room,
    existingBookings: input.bookings,
  });

  return {
    availability: outcome.status === 'available',
    reasonCode: toReasonCode(outcome),
    message: toMessage(outcome),
  };
}

export { rooms, bookings };
export type { Room, Booking };
