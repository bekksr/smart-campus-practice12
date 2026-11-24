import { describe, expect, it } from 'vitest';
import { explainAvailability } from './explainAvailability';
import { ExplanationRequest } from './types';

const validRequest: ExplanationRequest = {
  roomLabel: 'Library Study Room 201',
  startTime: '10:00',
  endTime: '11:00',
  isAvailable: true,
  reasonCode: 'AVAILABLE',
};

describe('explainAvailability', () => {
  it('explains an available room', () => {
    const result = explainAvailability(validRequest);

    expect(result.source).toBe('mock');
    expect(result.explanation).toContain('available');
  });

  it('explains a blocked room', () => {
    const result = explainAvailability({
      ...validRequest,
      isAvailable: false,
      reasonCode: 'ROOM_BLOCKED',
    });

    expect(result.explanation).toContain('blocked');
  });

  it('rejects an empty room name', () => {
    expect(() =>
      explainAvailability({
        ...validRequest,
        roomLabel: '',
      })
    ).toThrow('Invalid explanation request.');
  });

  it('rejects an invalid time format', () => {
    expect(() =>
      explainAvailability({
        ...validRequest,
        startTime: '25:00',
      })
    ).toThrow('Invalid explanation request.');
  });

  it('rejects contradictory availability status', () => {
    expect(() =>
      explainAvailability({
        ...validRequest,
        isAvailable: false,
      })
    ).toThrow('Availability status and reason code do not match.');
  });

  it('rejects room names longer than 100 characters', () => {
    expect(() =>
      explainAvailability({
        ...validRequest,
        roomLabel: 'A'.repeat(101),
      })
    ).toThrow('Invalid explanation request.');
  });
  it('explains a booking overlap', () => {
    const result = explainAvailability({
      ...validRequest,
      isAvailable: false,
      reasonCode: 'BOOKING_OVERLAP',
    });

    expect(result.explanation).toContain('conflicts');
  });

  it('explains invalid time', () => {
    const result = explainAvailability({
      ...validRequest,
      isAvailable: false,
      reasonCode: 'INVALID_TIME',
    });

    expect(result.explanation).toContain('invalid');
  });

  it('explains a past time request', () => {
    const result = explainAvailability({
      ...validRequest,
      isAvailable: false,
      reasonCode: 'PAST_START',
    });

    expect(result.explanation).toContain('later');
  });

  it('explains duration exceeding 120 minutes', () => {
    const result = explainAvailability({
      ...validRequest,
      isAvailable: false,
      reasonCode: 'INVALID_DURATION',
    });

    expect(result.explanation).toContain('120 minutes');
  });
  it('does not modify the original request', () => {
    const request = { ...validRequest };

    explainAvailability(request);

    expect(request).toEqual(validRequest);
  });

  it('rejects an available interval with start after end', () => {
    expect(() =>
      explainAvailability({
        ...validRequest,
        startTime: '11:00',
        endTime: '10:00',
      })
    ).toThrow('Available interval must have a valid time range.');
  });

  it('rejects an available interval with equal start and end', () => {
    expect(() =>
      explainAvailability({
        ...validRequest,
        startTime: '10:00',
        endTime: '10:00',
      })
    ).toThrow('Available interval must have a valid time range.');
  });
});
