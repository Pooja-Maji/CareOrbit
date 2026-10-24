/**
 * SthreeCare - Follow-up and Screening Reminder Service
 * Owner: Person B
 */

export interface ReminderItem {
  id: string;
  title: string;
  body: string;
  scheduledDate: string;
  type: 'follow_up' | 'cycle_logging' | 'screening_annual';
}

const STORAGE_KEY_REMINDERS = 'sthreecare_reminders';

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }
  return false;
}

export function getScheduledReminders(): ReminderItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REMINDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function scheduleReminder(item: ReminderItem): void {
  const current = getScheduledReminders();
  current.push(item);
  localStorage.setItem(STORAGE_KEY_REMINDERS, JSON.stringify(current));

  // If notification permission is granted, notify if due
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    const target = new Date(item.scheduledDate).getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff > 0 && diff < 24 * 60 * 60 * 1000) {
      setTimeout(() => {
        new Notification(item.title, {
          body: item.body,
          icon: '/favicon.svg',
        });
      }, Math.min(diff, 60000));
    }
  }
}

export function dismissReminder(id: string): void {
  const current = getScheduledReminders().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY_REMINDERS, JSON.stringify(current));
}
