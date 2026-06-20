/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppView =
  | 'login'
  | 'register'
  | 'verify'
  | 'dashboard'
  | 'detection-input'
  | 'detection-live'
  | 'notifications'
  | 'history'
  | 'settings'
  | 'profile';

export type Gender = 'Male' | 'Female';

export interface StudentRecord {
  id: string;
  profileUrl: string;
  fullName: string;
  email: string;
  gender: Gender;
  hasHijab: boolean;
  userId: string;
  hasNametag: boolean;
  hasKemejaPutih: boolean;
  hasSabuk: boolean;
  hasKerudungPink: boolean;
  hasRokHitam: boolean;
  hasCelanaHitam: boolean;
  status: 'COMPLETE' | 'INCOMPLETE';
  createdAt: string; // ISO datetime dari backend
  timestamp?: string; // alias untuk kompatibilitas tampilan
}

export interface NotificationLog {
  id?: number;
  recipient: string;
  studentName?: string;
  subject?: string;
  body?: string;
  type?: string;
  status: 'SENT' | 'FAILED';
  sentAt?: string;
  timestamp?: string;
}

export interface DashboardStats {
  total: number;
  complete: number;
  incomplete: number;
  completionRate: number;
}

export type SettingsTab = 'profile' | 'security' | 'preferences' | 'email';

export function formatDateTime(dateTime: any): string {
  if (!dateTime) return '';
  if (typeof dateTime === 'string') {
    return dateTime.replace('T', ' ').substring(0, 19);
  }
  if (Array.isArray(dateTime)) {
    const [year, month, day, hour, minute, second] = dateTime;
    const pad = (n: number) => String(n ?? 0).padStart(2, '0');
    return `${year}-${pad(month)}-${pad(day)} ${pad(hour ?? 0)}:${pad(minute ?? 0)}:${pad(second ?? 0)}`;
  }
  return String(dateTime);
}

