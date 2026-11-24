import { timeToMinutes, minutesToTime } from './time';
import { MINUTES_PER_DAY } from './time';
import type { ContractInput, ContractResult, ReasonCode } from './contract';

function result(
  availability: boolean,
  reasonCode: ReasonCode,
  message: string
): ContractResult {
  return { availability, reasonCode, message };
}

export function checkAvailability(input: ContractInput): ContractResult {
  const start = timeToMinutes(input.startTime);
  const currentTime = timeToMinutes(input.currentTime);

  if (start === null) {
    return result(
      false,
      'INVALID_TIME',
      `Start time "${input.startTime}" is not a valid HH:MM time.`
    );
  }

  if (currentTime === null) {
    return result(
      false,
      'INVALID_TIME',
      `Current time "${input.currentTime}" is not a valid HH:MM time.`
    );
  }

  if (start < 0 || start >= MINUTES_PER_DAY) {
    return result(
      false,
      'INVALID_TIME',
      'Start time must be between 00:00 and 23:59.'
    );
  }

  if (!Number.isFinite(input.duration) || input.duration <= 0) {
    return result(
      false,
      'INVALID_DURATION',
      'Duration must be greater than zero minutes.'
    );
  }

  if (input.duration > 120) {
    return result(
      false,
      'INVALID_DURATION',
      `Requested duration (${input.duration} min) exceeds the 2-hour maximum.`
    );
  }

  if (start <= currentTime) {
    return result(
      false,
      'PAST_START',
      `Start time ${input.startTime} must be later than the reference time ${input.currentTime}.`
    );
  }

  if (input.blocked) {
    return result(
      false,
      'ROOM_BLOCKED',
      'This room is currently blocked and unavailable.'
    );
  }

  const end = start + input.duration;

  if (end > MINUTES_PER_DAY) {
    return result(
      false,
      'INVALID_TIME',
      `The requested interval would end at ${minutesToTime(end)}, past 24:00.`
    );
  }

  const conflict = input.bookings.find(
    (b) => start < b.end && b.start < end
  );

  if (conflict) {
    return result(
      false,
      'BOOKING_OVERLAP',
      `The requested interval overlaps an existing booking: ${conflict.title} (${minutesToTime(conflict.start)}–${minutesToTime(conflict.end)}).`
    );
  }

  return result(
    true,
    'AVAILABLE',
    `Room is available from ${minutesToTime(start)} to ${minutesToTime(end)} (${input.duration} min).`
  );
}
