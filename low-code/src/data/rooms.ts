export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
  blockedReason?: string;
}

export interface Booking {
  roomId: string;
  start: number;
  end: number;
  title: string;
  bookedBy: string;
}

export const rooms: Room[] = [
  {
    id: 'lib-201',
    name: 'Library Room 201',
    building: 'Main Library',
    capacity: 8,
    blocked: false,
  },
  {
    id: 'sci-310',
    name: 'Science Room 310',
    building: 'Block C — Sciences',
    capacity: 20,
    blocked: true,
    blockedReason: 'Maintenance — HVAC repair scheduled all day.',
  },
];

export const bookings: Booking[] = [
  {
    roomId: 'lib-201',
    start: 9 * 60,
    end: 10 * 60 + 30,
    title: 'Database Systems',
    bookedBy: 'A. Chen',
  },
  {
    roomId: 'lib-201',
    start: 13 * 60,
    end: 14 * 60 + 30,
    title: 'Web Development',
    bookedBy: 'M. Patel',
  },
  {
    roomId: 'lib-201',
    start: 15 * 60,
    end: 16 * 60,
    title: 'Software Engineering',
    bookedBy: 'J. Rivera',
  },
  {
    roomId: 'sci-310',
    start: 9 * 60,
    end: 10 * 60 + 30,
    title: 'Group Project — CS301',
    bookedBy: 'A. Chen',
  },
  {
    roomId: 'sci-310',
    start: 14 * 60,
    end: 15 * 60,
    title: 'Literature Review',
    bookedBy: 'M. Patel',
  },
  {
    roomId: 'sci-310',
    start: 16 * 60 + 30,
    end: 17 * 60 + 30,
    title: 'Thesis Writing',
    bookedBy: 'J. Rivera',
  },
];
