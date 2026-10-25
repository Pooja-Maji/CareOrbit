/**
 * Care Orbit - Volunteer Support Request API
 * Owner: Person B
 * 
 * Strict Privacy:
 * Only sends task type, anonymousRef, language preference, and non-medical logistics.
 * Zero health data is ever transmitted.
 */

import { apiClient } from './client';
import type { SupportTask, SupportTaskCreate, SupportTaskStatus, Volunteer } from '@sthreecare/shared';

export const DEMO_VOLUNTEERS: Volunteer[] = [
  {
    id: 'vol_101',
    name: 'Anita Shenoy',
    languages: ['Kannada', 'Tulu', 'English'],
    verified: true,
    hours: 28,
    badge: 'Senior Community Guide',
    phone: '+91 94481 00213',
  },
  {
    id: 'vol_102',
    name: 'Kavitha Rao',
    languages: ['Kannada', 'Hindi', 'English'],
    verified: true,
    hours: 19,
    badge: 'Maternal Care Companion',
    phone: '+91 98802 34112',
  },
  {
    id: 'vol_103',
    name: 'Dr. Shruti Shetty (PT)',
    languages: ['Kannada', 'English'],
    verified: true,
    hours: 42,
    badge: 'Accredited Health Navigator',
    phone: '+91 97410 99881',
  },
];

const LOCAL_STORAGE_KEY_TASKS = 'sthreecare_support_tasks';

function getLocalTasks(): SupportTask[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalTask(task: SupportTask) {
  const tasks = getLocalTasks();
  const existingIdx = tasks.findIndex((t) => t.id === task.id);
  if (existingIdx >= 0) {
    tasks[existingIdx] = task;
  } else {
    tasks.unshift(task);
  }
  localStorage.setItem(LOCAL_STORAGE_KEY_TASKS, JSON.stringify(tasks));
}

export async function createSupportRequest(payload: SupportTaskCreate): Promise<SupportTask> {
  const res = await apiClient<SupportTask>('/support-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (res.data) {
    saveLocalTask(res.data);
    return res.data;
  }

  // Simulated Volunteer Matching Engine
  const matchedVolunteer = DEMO_VOLUNTEERS[Math.floor(Math.random() * DEMO_VOLUNTEERS.length)];
  const newTask: SupportTask = {
    id: 'req_' + Math.random().toString(36).substring(2, 9),
    type: payload.type,
    status: 'matched',
    anonymousRef: payload.anonymousRef,
    volunteerId: matchedVolunteer.id,
    volunteer: matchedVolunteer,
    hours: payload.hours || 1.5,
    notes: payload.notes || 'Non-medical navigation and appointment assistance',
    preferredLanguage: payload.preferredLanguage || 'Kannada',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveLocalTask(newTask);
  return newTask;
}

export async function getSupportRequest(id: string): Promise<SupportTask | null> {
  const res = await apiClient<SupportTask>(`/support-requests/${id}`);
  if (res.data) return res.data;

  const tasks = getLocalTasks();
  return tasks.find((t) => t.id === id) || null;
}

export async function updateSupportTaskStatus(
  id: string,
  status: SupportTaskStatus
): Promise<SupportTask | null> {
  const res = await apiClient<SupportTask>(`/support-requests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  if (res.data) {
    saveLocalTask(res.data);
    return res.data;
  }

  const tasks = getLocalTasks();
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.status = status;
    task.updatedAt = new Date().toISOString();
    saveLocalTask(task);
    return task;
  }

  return null;
}

export async function getUserSupportRequests(anonymousRef: string): Promise<SupportTask[]> {
  const tasks = getLocalTasks();
  return tasks.filter((t) => t.anonymousRef === anonymousRef);
}
