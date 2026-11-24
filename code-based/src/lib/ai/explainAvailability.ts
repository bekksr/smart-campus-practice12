import { generateMockExplanation } from './mockAdapter';
import {
  AvailabilityReasonCode,
  ExplanationRequest,
  ExplanationResponse,
} from './types';

const VALID_REASON_CODES: AvailabilityReasonCode[] = [
  'AVAILABLE',
  'INVALID_TIME',
  'PAST_TIME',
  'DURATION_EXCEEDED',
  'ROOM_BLOCKED',
  'BOOKING_OVERLAP',
];

export function explainAvailability(
  request: ExplanationRequest
): ExplanationResponse {
  const { roomLabel, startTime, endTime, isAvailable, reasonCode } = request;

  if (
    !roomLabel.trim() ||
    roomLabel.length > 100 ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(endTime) ||
    !VALID_REASON_CODES.includes(reasonCode)
  ) {
    throw new Error('Invalid explanation request.');
  }

  if (isAvailable !== (reasonCode === 'AVAILABLE')) {
    throw new Error('Availability status and reason code do not match.');
  }

  if (
    reasonCode === 'AVAILABLE' &&
    startTime >= endTime
  ) {
    throw new Error('Available interval must have a valid time range.');
  }

  return generateMockExplanation(request);
}
