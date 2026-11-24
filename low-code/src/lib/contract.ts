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
  bookings: { start: number; end: number; title: string }[];
  currentTime: string;
}

export interface ContractResult {
  availability: boolean;
  reasonCode: ReasonCode;
  message: string;
}

export const REFERENCE_TIME = '08:00';
