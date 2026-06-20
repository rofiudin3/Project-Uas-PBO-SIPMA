/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AppView, StudentRecord, NotificationLog, DashboardStats, Gender, formatDateTime } from './types';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Views
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import VerifyOTPView from './views/VerifyOTPView';
import DashboardView from './views/DashboardView';
import DetectionInputView from './views/DetectionInputView';
import DetectionLiveView from './views/DetectionLiveView';
import HistoryView from './views/HistoryView';
import NotificationsView from './views/NotificationsView';
import SettingsView from './views/SettingsView';
import ProfileView from './views/ProfileView';

import { CheckCircle2 } from 'lucide-react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('login');

  // Admin info
  const [adminId, setAdminId]                   = useState<number | null>(null);
  const [adminName, setAdminName]               = useState('Administrator');
  const [adminRole, setAdminRole]               = useState('Academic Inspector');
  const [adminUserId, setAdminUserId]           = useState('');
  const [adminDepartment, setAdminDepartment]   = useState('Panitia Monitor');
  const [adminAvatar, setAdminAvatar]           = useState('');

  // Data states dari API
  const [studentsList, setStudentsList]     = useState<StudentRecord[]>([]);
  const [emailLogsQueue, setEmailLogsQueue] = useState<NotificationLog[]>([]);

  // Cross-view
  const [selectedPresetStudent, setSelectedPresetStudent] = useState<StudentRecord | null>(null);
  const [scantargetData, setScantargetData] = useState<{
    fullName: string; userId: string; email: string; gender: Gender; hasHijab: boolean;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (message: string) => setToastMessage(message);

  useEffect(() => {
    if (toastMessage) {
      const handle = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(handle);
    }
  }, [toastMessage]);

  // ── API Helpers ──────────────────────────────────────────────────────────

  const fetchStudents = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/students`);
      if (!res.ok) {
        console.error("HTTP error fetching students:", res.status, res.statusText);
        return;
      }
      const data: StudentRecord[] = await res.json();
      setStudentsList(data.map(s => ({
        ...s,
        timestamp: formatDateTime(s.createdAt),
      })));
    } catch (err) {
      console.error("Failed to fetch students from API:", err);
    }
  }, []);

  const fetchNotifLogs = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/notifications/logs`);
      if (!res.ok) {
        console.error("HTTP error fetching notifications:", res.status, res.statusText);
        return;
      }
      const data: NotificationLog[] = await res.json();
      setEmailLogsQueue(data.map(l => ({ ...l, timestamp: formatDateTime(l.sentAt) })));
    } catch (err) {
      console.error("Failed to fetch notification logs:", err);
    }
  }, []);

  const fetchAdminProfile = useCallback(async (id: number) => {
    try {
      const res  = await fetch(`${API}/admin/profile?adminId=${id}`);
      const data = await res.json();
      if (data.success) {
        if (data.fullName)   setAdminName(data.fullName);
        if (data.role)       setAdminRole(data.role);
        if (data.department) setAdminDepartment(data.department);
        if (data.avatarUrl)  setAdminAvatar(data.avatarUrl);
      }
    } catch (err) {
      console.error("Failed to fetch admin profile:", err);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchStudents();
      fetchNotifLogs();
    }
  }, [isLoggedIn, fetchStudents, fetchNotifLogs]);

  // ── Auth ──────────────────────────────────────────────────────────────────

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('login');
    sessionStorage.clear();
    triggerToast('Sesi berhasil diakhiri.');
  };

  const handleLoginSuccess = (userId: string) => {
    const id = Number(sessionStorage.getItem('adminId'));
    setAdminUserId(userId);
    setAdminId(id);
    setAdminName(sessionStorage.getItem('adminName') ?? 'Administrator');
    setAdminRole(sessionStorage.getItem('adminRole') ?? 'Academic Inspector');
    setAdminDepartment(sessionStorage.getItem('adminDepartment') ?? 'Panitia Monitor');
    setIsLoggedIn(true);
    setCurrentView('dashboard');
    if (id) fetchAdminProfile(id);
    triggerToast(`Selamat datang, ${sessionStorage.getItem('adminName') ?? userId}!`);
  };

  const handleResetSuccess    = () => { setCurrentView('login'); triggerToast('OTP terverifikasi. Silakan login.'); };
  const handleRegisterSuccess = () => { setCurrentView('login'); triggerToast('Pendaftaran berhasil. Silakan masuk.'); };

  // ── Students ──────────────────────────────────────────────────────────────

  const handleAddScanRecord = async (newRec: StudentRecord) => {
    try {
      const response = await fetch(`${API}/students/scan-mock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRec),
      });
      if (!response.ok) {
        console.error("HTTP error saving scan record:", response.status, response.statusText);
      }
    } catch (err) {
      console.error("Failed to save scan record:", err);
    }
    await fetchStudents();
    setCurrentView('dashboard');
    triggerToast(`Rekaman tersimpan: ${newRec.fullName}`);
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await fetch(`${API}/students/${id}`, { method: 'DELETE' });
    } catch { /* ignore */ }
    await fetchStudents();
    triggerToast('Data rekaman berhasil dihapus.');
  };

  // ── Notifications ─────────────────────────────────────────────────────────

  const handleSendMail = async (newLog: NotificationLog) => {
    try {
      await fetch(`${API}/notifications/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient:   newLog.recipient,
          studentName: newLog.studentName,
          subject:     newLog.subject,
          body:        newLog.body,
          status:      newLog.status,
        }),
      });
    } catch { /* ignore */ }
    await fetchNotifLogs();
    setCurrentView('notifications');
    triggerToast(`Pesan terkirim ke ${newLog.recipient}`);
  };

  const handleTriggerMailAlertForIncomplete = (student: StudentRecord) => {
    setSelectedPresetStudent(student);
    setCurrentView('notifications');
    triggerToast(`Template disiapkan untuk ${student.fullName}`);
  };

  // ── Admin Profile ─────────────────────────────────────────────────────────

  const handleUpdateAdminDetails = async (name: string, role?: string, department?: string, avatar?: string) => {
    if (adminId) {
      try {
        await fetch(`${API}/admin/profile?adminId=${adminId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName: name, role, department, avatarUrl: avatar }),
        });
      } catch { /* ignore */ }
    }
    setAdminName(name);
    if (role)       setAdminRole(role);
    if (department) setAdminDepartment(department);
    if (avatar)     setAdminAvatar(avatar);
  };

  return (
    <div className="w-screen h-screen bg-[#111115] text-[#1b1b1d] flex items-center justify-center selection:bg-[#bfc5e7]/50 select-none">
      <div id="sipma-app-root-frame" className="w-full h-full bg-white text-base leading-relaxed overflow-hidden relative flex">

        {!isLoggedIn ? (
          <div className="w-full h-full">
            {currentView === 'login'    && <LoginView    onNavigate={v => setCurrentView(v)} onLoginSuccess={handleLoginSuccess} />}
            {currentView === 'register' && <RegisterView onNavigate={v => setCurrentView(v)} onRegisterSuccess={handleRegisterSuccess} />}
            {currentView === 'verify'   && <VerifyOTPView onNavigate={v => setCurrentView(v)} onResetSuccess={handleResetSuccess} />}
          </div>
        ) : (
          <div className="flex w-full h-full overflow-hidden">
            <Sidebar currentView={currentView} onNavigate={v => setCurrentView(v)} onLogout={handleLogout} />

            <div className="flex-grow h-full flex flex-col bg-[#FDFAF5] overflow-hidden">
              <Header
                currentView={currentView}
                adminName={adminName}
                adminRole={adminRole}
                adminAvatar={adminAvatar}
                notificationCount={studentsList.filter(s => s.status === 'INCOMPLETE').length}
                unreadCount={emailLogsQueue.filter(l => l.status === 'FAILED').length}
                onNavigate={v => setCurrentView(v)}
              />

              <div className="flex-grow overflow-hidden relative">
                {currentView === 'dashboard' && (
                  <DashboardView
                    students={studentsList}
                    onNavigate={v => setCurrentView(v as AppView)}
                    onSelectStudent={handleTriggerMailAlertForIncomplete}
                  />
                )}
                {currentView === 'detection-input' && (
                  <DetectionInputView
                    onNavigate={v => setCurrentView(v)}
                    onInitiateDetection={config => { setScantargetData(config); setCurrentView('detection-live'); }}
                  />
                )}
                {currentView === 'detection-live' && scantargetData && (
                  <DetectionLiveView
                    studentData={scantargetData}
                    onSaveScan={handleAddScanRecord}
                    onCancel={() => setCurrentView('detection-input')}
                  />
                )}
                {currentView === 'history' && (
                  <HistoryView
                    students={studentsList}
                    onDeleteRecord={handleDeleteRecord}
                    onSendNotification={handleTriggerMailAlertForIncomplete}
                  />
                )}
                {currentView === 'notifications' && (
                  <NotificationsView
                    logs={emailLogsQueue}
                    presetTarget={selectedPresetStudent}
                    onSendMail={handleSendMail}
                    onClearPreset={() => setSelectedPresetStudent(null)}
                    students={studentsList}
                  />
                )}
                {currentView === 'settings' && (
                  <SettingsView
                    adminName={adminName}
                    adminRole={adminRole}
                    adminDepartment={adminDepartment}
                    adminAvatar={adminAvatar}
                    onUpdateAdminDetails={handleUpdateAdminDetails}
                    onTriggerToast={triggerToast}
                  />
                )}
                {currentView === 'profile' && (
                  <ProfileView
                    adminName={adminName}
                    adminRole={adminRole}
                    adminDepartment={adminDepartment}
                    adminAvatar={adminAvatar}
                    onNavigate={v => setCurrentView(v)}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {toastMessage && (
          <div className="absolute bottom-6 right-6 z-50 animate-bounce cursor-pointer" onClick={() => setToastMessage(null)}>
            <div className="bg-[#0c132c] border border-cyan-400/40 text-white shadow-2xl p-4 flex items-center gap-4 rounded-sm max-w-sm">
              <div className="p-2 bg-emerald-100/10 text-cyan-400 rounded-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-[11px] font-extrabold uppercase tracking-widest text-[#888fae]">Notifikasi Sistem</h5>
                <p className="text-[11px] text-white/95 mt-1 leading-normal font-semibold">{toastMessage}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
