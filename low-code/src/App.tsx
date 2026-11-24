import { useMemo, useState } from 'react';
import {
  CalendarSearch,
  Clock4,
  DoorClosed,
  Info,
  RotateCcw,
  Timer,
} from 'lucide-react';
import { rooms, bookings } from '@/data/rooms';
import { getBookingsForRoom } from '@/lib/bookingSelectors';
import { checkAvailability } from '@/lib/availability';
import type { ContractInput, ContractResult } from '@/lib/contract';
import { REFERENCE_TIME } from '@/lib/contract';
import { formatDuration, minutesToTime, timeToMinutes } from '@/lib/time';
import { RoomOption } from '@/components/RoomOption';
import { ScheduleList } from '@/components/ScheduleList';
import { ResultBanner } from '@/components/ResultBanner';

const REFERENCE_MINUTES = timeToMinutes(REFERENCE_TIME) ?? 480;

function App() {
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0].id);
  const [startTimeStr, setStartTimeStr] = useState('09:00');
  const [durationStr, setDurationStr] = useState('60');
  const [result, setResult] = useState<ContractResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId) ?? rooms[0],
    [selectedRoomId]
  );

  const roomBookings = useMemo(
    () => getBookingsForRoom(bookings, selectedRoomId),
    [selectedRoomId]
  );

  const parsedDuration = parseInt(durationStr, 10);
  const durationValid =
    Number.isFinite(parsedDuration) && parsedDuration > 0 && parsedDuration <= 120;
  const startValid = /^([01]\d|2[0-3]):[0-5]\d$/.test(startTimeStr);
  const startMinutes = timeToMinutes(startTimeStr);
  const startAfterReference =
    startMinutes !== null && startMinutes > REFERENCE_MINUTES;

  const endTimeStr = useMemo(() => {
    const s = timeToMinutes(startTimeStr);
    if (s === null || !durationValid) return '';
    return minutesToTime(s + parsedDuration);
  }, [startTimeStr, parsedDuration, durationValid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const input: ContractInput = {
      startTime: startTimeStr,
      duration: parsedDuration,
      roomId: selectedRoomId,
      blocked: selectedRoom.blocked,
      bookings: roomBookings,
      currentTime: REFERENCE_TIME,
    };

    setResult(checkAvailability(input));
    setSubmitted(true);
  };

  const handleReset = () => {
    setStartTimeStr('09:00');
    setDurationStr('60');
    setResult(null);
    setSubmitted(false);
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    setResult(null);
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white">
              <CalendarSearch size={20} />
            </span>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Smart Campus Room Availability Checker
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Check whether a campus room is free for your requested time. No
            booking is saved — this tool only checks availability.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Room selection + schedule */}
          <section className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <DoorClosed size={18} className="text-slate-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Select a room
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {rooms.map((room) => (
                  <RoomOption
                    key={room.id}
                    room={room}
                    selected={room.id === selectedRoomId}
                    onSelect={() => handleRoomSelect(room.id)}
                  />
                ))}
              </div>

              <div className="mt-6">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Today&apos;s bookings
                </h3>
                <ScheduleList
                  bookings={roomBookings}
                  emptyLabel="No existing bookings — the room is fully open."
                />
              </div>
            </div>
          </section>

          {/* Right: Availability form */}
          <section className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
              aria-label="Availability check form"
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Clock4 size={18} className="text-slate-400" />
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Check a time interval
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <RotateCcw size={13} /> Reset
                </button>
              </div>

              <div className="mb-4 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                <Info size={13} />
                Reference current time is fixed at{' '}
                <span className="font-semibold text-slate-700">
                  {REFERENCE_TIME}
                </span>
                . Your start must be after this.
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span
                    id="start-label"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Start time (HH:MM)
                  </span>
                  <input
                    type="time"
                    value={startTimeStr}
                    onChange={(e) => {
                      setStartTimeStr(e.target.value);
                      setSubmitted(false);
                    }}
                    aria-labelledby="start-label"
                    aria-invalid={submitted && !startAfterReference}
                    placeholder="HH:MM"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  />
                </label>

                <label className="block">
                  <span
                    id="duration-label"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Duration (minutes)
                  </span>
                  <input
                    type="number"
                    value={durationStr}
                    onChange={(e) => {
                      setDurationStr(e.target.value);
                      setSubmitted(false);
                    }}
                    aria-labelledby="duration-label"
                    aria-invalid={submitted && !durationValid}
                    min={1}
                    max={120}
                    step={1}
                    placeholder="1–120"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  />
                </label>
              </div>

              {durationValid && parsedDuration > 0 && (
                <div
                  className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                    parsedDuration > 120
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-sky-50 text-sky-700'
                  }`}
                >
                  <Timer size={13} />
                  Requested duration: {formatDuration(parsedDuration)}
                  {endTimeStr && ` (ends at ${endTimeStr})`}
                  {parsedDuration > 120 && ' — exceeds the 2-hour maximum.'}
                </div>
              )}

              {submitted && !startAfterReference && startValid && (
                <p className="mt-2 text-xs font-medium text-amber-600">
                  Start time must be later than {REFERENCE_TIME}.
                </p>
              )}
              {submitted && !durationValid && (
                <p className="mt-2 text-xs font-medium text-amber-600">
                  Duration must be between 1 and 120 minutes.
                </p>
              )}

              <button
                type="submit"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 active:scale-[0.99] sm:w-auto sm:px-6"
              >
                <CalendarSearch size={17} /> Check Availability
              </button>

              {submitted && result && <ResultBanner result={result} />}

              {submitted && result?.availability && (
                <p className="mt-3 text-xs text-slate-400">
                  No booking data was modified — this is a read-only
                  availability check for {selectedRoom.name}.
                </p>
              )}
            </form>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white/60 p-5">
              <h3 className="mb-2 text-sm font-semibold text-slate-600">
                How availability is decided
              </h3>
              <ul className="grid grid-cols-1 gap-1.5 text-xs leading-relaxed text-slate-500 sm:grid-cols-2">
                <li>Start must be later than {REFERENCE_TIME}.</li>
                <li>Duration must be 1–120 minutes.</li>
                <li>Blocked rooms are always unavailable.</li>
                <li>Overlapping requests are rejected — touching times are fine.</li>
                <li>Existing bookings are never changed by a check.</li>
                <li>Reason codes: AVAILABLE, INVALID_TIME, PAST_START, INVALID_DURATION, BOOKING_OVERLAP, ROOM_BLOCKED.</li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
        <p className="text-center text-xs text-slate-400">
          Low-code prototype — uses fictional sample data. Reference time:{' '}
          {REFERENCE_TIME}.
        </p>
      </footer>
    </div>
  );
}

export default App;
