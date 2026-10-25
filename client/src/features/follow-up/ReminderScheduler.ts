/**
 * Care Orbit - Reminder Scheduler
 * Owner: Person B (Stage 12)
 * 
 * Schedules follow-up calendar links (.ics) and on-device alerts.
 */

export interface CalendarEvent {
  title: string;
  description: string;
  location?: string;
  startDate: string; // YYYY-MM-DD
}

export function generateIcsCalendarFile(event: CalendarEvent): string {
  const dateFormatted = event.startDate.replace(/-/g, '');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Care Orbit//Health Compass//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location || 'Local Healthcare Centre'}`,
    `DTSTART;VALUE=DATE:${dateFormatted}`,
    `DTEND;VALUE=DATE:${dateFormatted}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadCalendarEvent(event: CalendarEvent) {
  const icsData = generateIcsCalendarFile(event);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.title.replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
