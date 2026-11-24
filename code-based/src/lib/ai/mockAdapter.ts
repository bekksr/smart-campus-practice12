import {
  ExplanationRequest,
  ExplanationResponse,
} from './types';

export function generateMockExplanation(
  request: ExplanationRequest
): ExplanationResponse {
  const { roomLabel, startTime, endTime, isAvailable, reasonCode, reasonDetail } =
    request;

  let explanation: string;

  if (isAvailable && reasonCode === 'AVAILABLE') {
    explanation = `${roomLabel} is available from ${startTime} to ${endTime}. No existing booking conflicts with this interval.`;
  } else {
    switch (reasonCode) {
      case 'INVALID_TIME':
        explanation = 'The requested time interval is invalid. Please check the start and end times.';
        break;

      case 'PAST_TIME':
        explanation = 'The requested start time must be later than the current time.';
        break;

      case 'DURATION_EXCEEDED':
        explanation = 'The requested interval exceeds the maximum allowed duration of 120 minutes.';
        break;

      case 'ROOM_BLOCKED':
        explanation = `The room ${roomLabel} is unavailable because it is currently blocked.`;
        break;

      case 'BOOKING_OVERLAP':
        explanation = 'The requested interval conflicts with an existing booking.';
        break;

      default:
        explanation = reasonDetail || 'The room is unavailable for the requested interval.';
    }
  }

  return {
    explanation,
    source: 'mock',
  };
}

