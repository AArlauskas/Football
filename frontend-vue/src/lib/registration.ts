const REGISTRATION_CLOSES_AT = new Date('2026-06-11T00:00:00');

export const isRegistrationOpen = (now = new Date()) =>
  now < REGISTRATION_CLOSES_AT;
