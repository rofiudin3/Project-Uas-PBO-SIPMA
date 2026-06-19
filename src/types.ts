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
