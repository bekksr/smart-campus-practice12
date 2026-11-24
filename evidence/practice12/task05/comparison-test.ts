import { checkAvailabilityContract } from '../code-based/src/lib/contract';
import { checkAvailability as checkLowCode } from '../low-code/src/lib/availability';
import { bookings as cbBookings } from '../code-based/src/data/rooms';
import { bookings as lcBookings } from '../low-code/src/data/rooms';
import { rooms as cbRooms } from '../code-based/src/data/rooms';
import { rooms as lcRooms } from '../low-code/src/data/rooms';

interface TestCase {
  id: string;
  description: string;
  startTime: string;
  duration: number;
  roomId: string;
  expectedAvailable: boolean;
  expectedReason: string;
}

const REFERENCE_TIME = '08:00';

const testCases: TestCase[] = [
  { id: 'T1', description: 'Valid free interval', startTime: '11:00', duration: 60, roomId: 'lib-201', expectedAvailable: true, expectedReason: 'AVAILABLE' },
  { id: 'T2', description: 'Overlapping booking', startTime: '10:00', duration: 60, roomId: 'lib-201', expectedAvailable: false, expectedReason: 'BOOKING_OVERLAP' },
  { id: 'T3', description: 'Blocked room', startTime: '09:00', duration: 60, roomId: 'sci-310', expectedAvailable: false, expectedReason: 'ROOM_BLOCKED' },
  { id: 'T4', description: 'Zero duration', startTime: '11:00', duration: 0, roomId: 'lib-201', expectedAvailable: false, expectedReason: 'INVALID_DURATION' },
  { id: 'T5', description: 'Duration exceeds max', startTime: '11:00', duration: 121, roomId: 'lib-201', expectedAvailable: false, expectedReason: 'INVALID_DURATION' },
  { id: 'T6', description: 'Past start time', startTime: '07:00', duration: 60, roomId: 'lib-201', expectedAvailable: false, expectedReason: 'PAST_START' },
  { id: 'T7', description: 'Adjacent non-overlapping', startTime: '10:30', duration: 60, roomId: 'lib-201', expectedAvailable: true, expectedReason: 'AVAILABLE' },
  { id: 'T8', description: 'Booking data integrity', startTime: '11:00', duration: 60, roomId: 'lib-201', expectedAvailable: true, expectedReason: 'AVAILABLE' },
];

function getCodeBasedRoom(roomId: string) {
  return cbRooms.find((r) => r.id === roomId) ?? cbRooms[0];
}

function getLowCodeRoom(roomId: string) {
  return lcRooms.find((r) => r.id === roomId) ?? lcRooms[0];
}

function getCodeBasedBookings(roomId: string) {
  return cbBookings.filter((b) => b.roomId === roomId);
}

function getLowCodeBookings(roomId: string) {
  return lcBookings.filter((b) => b.roomId === roomId).map((b) => ({
    start: b.start, end: b.end, title: b.title,
  }));
}

let passCount = 0;
let failCount = 0;

console.log('=== TASK05: IDENTICAL ACCEPTANCE TEST COMPARISON ===\n');
console.log('Reference time: 08:00\n');

for (const tc of testCases) {
  // Code-based
  const cbRoom = getCodeBasedRoom(tc.roomId);
  const cbResult = checkAvailabilityContract({
    startTime: tc.startTime,
    duration: tc.duration,
    roomId: tc.roomId,
    blocked: cbRoom.blocked,
    bookings: getCodeBasedBookings(tc.roomId),
    currentTime: REFERENCE_TIME,
  });

  // Low-code
  const lcRoom = getLowCodeRoom(tc.roomId);
  const lcResult = checkLowCode({
    startTime: tc.startTime,
    duration: tc.duration,
    roomId: tc.roomId,
    blocked: lcRoom.blocked,
    bookings: getLowCodeBookings(tc.roomId),
    currentTime: REFERENCE_TIME,
  });

  // T8: data integrity check
  let cbDataIntact = true;
  let lcDataIntact = true;
  if (tc.id === 'T8') {
    const cbSnapshot = JSON.parse(JSON.stringify(getCodeBasedBookings(tc.roomId)));
    checkAvailabilityContract({
      startTime: tc.startTime,
      duration: tc.duration,
      roomId: tc.roomId,
      blocked: cbRoom.blocked,
      bookings: getCodeBasedBookings(tc.roomId),
      currentTime: REFERENCE_TIME,
    });
    cbDataIntact = JSON.stringify(getCodeBasedBookings(tc.roomId)) === JSON.stringify(cbSnapshot);

    const lcSnap = JSON.parse(JSON.stringify(getLowCodeBookings(tc.roomId)));
    checkLowCode({
      startTime: tc.startTime,
      duration: tc.duration,
      roomId: tc.roomId,
      blocked: lcRoom.blocked,
      bookings: getLowCodeBookings(tc.roomId),
      currentTime: REFERENCE_TIME,
    });
    lcDataIntact = JSON.stringify(getLowCodeBookings(tc.roomId)) === JSON.stringify(lcSnap);
  }

  const cbPass = tc.id === 'T8'
    ? cbResult.availability === tc.expectedAvailable && cbDataIntact
    : cbResult.availability === tc.expectedAvailable && cbResult.reasonCode === tc.expectedReason;
  const lcPass = tc.id === 'T8'
    ? lcResult.availability === tc.expectedAvailable && lcDataIntact
    : lcResult.availability === tc.expectedAvailable && lcResult.reasonCode === tc.expectedReason;

  if (cbPass) passCount++; else failCount++;
  if (lcPass) passCount++; else failCount++;

  console.log(`--- ${tc.id}: ${tc.description} ---`);
  console.log(`  Input: room=${tc.roomId}, start=${tc.startTime}, duration=${tc.duration}`);
  console.log(`  Expected: available=${tc.expectedAvailable}, reason=${tc.expectedReason}`);
  console.log(`  Code-based: available=${cbResult.availability}, reason=${cbResult.reasonCode} | ${cbPass ? 'PASS' : 'FAIL'}`);
  console.log(`  Low-code:   available=${lcResult.availability}, reason=${lcResult.reasonCode} | ${lcPass ? 'PASS' : 'FAIL'}`);
  if (tc.id === 'T8') {
    console.log(`  Data integrity: code-based=${cbDataIntact ? 'INTACT' : 'MODIFIED'}, low-code=${lcDataIntact ? 'INTACT' : 'MODIFIED'}`);
  }
  if (cbResult.reasonCode !== lcResult.reasonCode) {
    console.log(`  *** REASON CODE DIFFERENCE DETECTED ***`);
  }
  if (cbResult.availability !== lcResult.availability) {
    console.log(`  *** AVAILABILITY DIFFERENCE DETECTED ***`);
  }
  console.log();
}

console.log('=== SUMMARY ===');
console.log(`Total checks: ${testCases.length * 2}`);
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);
console.log(`Result: ${failCount === 0 ? 'ALL PASS' : 'FAILURES DETECTED'}`);
