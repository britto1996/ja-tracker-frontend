import { differenceInCalendarDays, isAfter, addDays } from 'date-fns';

export function daysUntil(deadlineIso: string, now = new Date()): number {
  const deadline = new Date(deadlineIso);
  return differenceInCalendarDays(deadline, now);
}

export function isDueSoon(deadlineIso: string, windowDays = 3, now = new Date()) {
  const d = daysUntil(deadlineIso, now);
  return d >= 0 && d <= windowDays;
}

export function isPastDue(deadlineIso: string, now = new Date()) {
  const deadline = new Date(deadlineIso);
  return isAfter(now, deadline);
}

export function isBeyondGrace(deadlineIso: string, graceDays = 7, now = new Date()) {
  const graceEnd = addDays(new Date(deadlineIso), graceDays);
  return isAfter(now, graceEnd);
}
