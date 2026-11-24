export type AvailabilityReasonCode =
  | 'AVAILABLE'
  | 'INVALID_TIME'
  | 'PAST_TIME'
  | 'DURATION_EXCEEDED'
  | 'ROOM_BLOCKED'
  | 'BOOKING_OVERLAP';

export interface ExplanationRequest {
  roomLabel: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  reasonCode: AvailabilityReasonCode;
  reasonDetail?: string;
}

export interface ExplanationResponse {
  explanation: string;
  source: 'mock';
}
