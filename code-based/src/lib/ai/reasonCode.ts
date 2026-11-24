import type { CheckOutcome } from '@/lib/availability';
import type { AvailabilityReasonCode } from './types';

export function getAvailabilityReasonCode(
  outcome: CheckOutcome
): AvailabilityReasonCode {
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

  if (reason.includes('duration') || reason.includes('2-hour')) {
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
