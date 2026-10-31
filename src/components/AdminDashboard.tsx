import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Calendar,
  Clock,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Trash2,
  Phone,
  MessageSquare,
  AlertCircle,
  FileSpreadsheet,
  Settings,
  Users,
  Building,
} from 'lucide-react';
import { Appointment, ClinicSettings } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
}) => {
  // Authentication State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('nl_admin_token'));
  const [username, setUsername] = useState('admin@newlife.clinic');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tabs: "appointments", "schedule-settings"
  const [activeTab, setActiveTab] = useState<'appointments' | 'schedule-settings'>('appointments');

  // Appointments List State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({ total: 0, today: 0, upcoming: 0, completed: 0 });
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Appointment for Status change or Reschedule
  const [reschedulingAppointment, setReschedulingAppointment] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('');
  const [statusActionMsg, setStatusActionMsg] = useState<string | null>(null);

  // Settings State
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);
  const [newHoliday, setNewHoliday] = useState('');
  const [newBlockedDate, setNewBlockedDate] = useState('');

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.token) {
        setToken(data.token);
        localStorage.setItem('nl_admin_token', data.token);
        setPassword('');
      } else {
        setLoginError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      setLoginError('Failed to connect to authentication service.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('nl_admin_token');
    setAppointments([]);
  };

  // Fetch Appointments
  const fetchAppointments = async () => {
    if (!token) return;
    setIsLoadingAppointments(true);
    setStatusActionMsg(null);

    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (dateFilter) params.set('date', dateFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/admin/appointments?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setAppointments(data.appointments);
        if (data.stats) setStats(data.stats);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  // Fetch Schedule Settings
  const fetchSettings = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/schedule-settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };

  useEffect(() => {
    if (token && isOpen) {
      fetchAppointments();
      fetchSettings();
    }
  }, [token, isOpen, statusFilter, dateFilter]);

  // Update Status
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusActionMsg(`Status updated to ${newStatus}`);
        fetchAppointments();
      }
    } catch (err) {
      setStatusActionMsg('Failed to update status.');
    }
  };

  // Reschedule Appointment
  const handleSaveReschedule = async () => {
    if (!token || !reschedulingAppointment || !rescheduleDate || !rescheduleSlot) return;

    try {
      const res = await fetch(`/api/admin/appointments/${reschedulingAppointment.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: rescheduleDate,
          timeSlot: rescheduleSlot,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusActionMsg(`Appointment successfully rescheduled to ${rescheduleDate} at ${rescheduleSlot}`);
        setReschedulingAppointment(null);
        fetchAppointments();
      } else {
        alert(data.message || 'Slot collision. Please choose an available time slot.');
      }
    } catch (err) {
      alert('Failed to reschedule appointment.');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !settings) return;
    setIsSavingSettings(true);
    setSettingsMsg(null);

    try {
      const res = await fetch('/api/admin/schedule-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettingsMsg('Clinic settings successfully saved.');
      }
    } catch (err) {
      setSettingsMsg('Error saving settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // CSV Export Download
  const handleExportCSV = () => {
    if (!token) return;
    window.open(`/api/admin/export-csv`, '_blank');
  };

  const formatIndianDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#071C16]/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0C2B22] border border-[#1B4D3E] rounded-sm w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#FAF8F5]">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#071C16] border-b border-[#1B4D3E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#143E32] text-[#C5A059] border border-[#C5A059]/40 flex items-center justify-center font-editorial italic text-base">
              K
            </div>
            <div>
              <div className="font-editorial text-base font-bold text-white tracking-wide">Physician &amp; Staff Administration</div>
              <div className="text-[10px] uppercase tracking-wider text-[#C5A059]">Dr. S.K. Kasana Advanced Diabetes Centre @ New Life</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs text-rose-300 hover:text-white hover:bg-rose-950/50 rounded-sm border border-rose-900/50 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* LOGIN SCREEN */}
          {!token && (
            <div className="max-w-md mx-auto py-10 space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Authorized Access Only</h3>
                <p className="text-xs text-slate-400">
                  Enter clinic administrator credentials to manage appointments, clinic hours, and patient schedules.
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Username / Clinic Email
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="text-[10px] text-slate-500 mt-1">Default demo: admin@newlife.clinic</div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="text-[10px] text-teal-400/90 mt-1">Demo password: Kasana@Care2026!</div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-xs sm:text-sm transition-all shadow-md"
                >
                  {isLoggingIn ? 'Verifying...' : 'Sign In to Dashboard'}
                </button>
              </form>
            </div>
          )}

          {/* AUTHENTICATED ADMIN DASHBOARD */}
          {token && (
            <div className="space-y-6">
              
              {/* Navigation Tabs & Stats Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      activeTab === 'appointments'
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Appointments Management</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('schedule-settings')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      activeTab === 'schedule-settings'
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Clinic Hours &amp; Slots</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={fetchAppointments}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                    title="Refresh data"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Statistics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">Total Bookings</div>
                  <div className="text-xl font-bold text-white mt-0.5">{stats.total}</div>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-teal-400">Today's Visits</div>
                  <div className="text-xl font-bold text-teal-300 mt-0.5">{stats.today}</div>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-sky-400">Upcoming Active</div>
                  <div className="text-xl font-bold text-sky-300 mt-0.5">{stats.upcoming}</div>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-emerald-400">Completed</div>
                  <div className="text-xl font-bold text-emerald-300 mt-0.5">{stats.completed}</div>
                </div>
              </div>

              {statusActionMsg && (
                <div className="p-2.5 bg-teal-950/60 border border-teal-800 text-xs text-teal-300 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{statusActionMsg}</span>
                </div>
              )}

              {/* TAB 1: APPOINTMENTS MANAGEMENT */}
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  {/* Search and Filters Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search patient name, phone, ref..."
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="RESCHEDULED">RESCHEDULED</option>
                      </select>
                    </div>

                    <div>
                      <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* Appointments Table */}
                  <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-3">Ref ID</th>
                          <th className="py-3 px-3">Date &amp; Slot</th>
                          <th className="py-3 px-3">Patient</th>
                          <th className="py-3 px-3">Contact</th>
                          <th className="py-3 px-3">Type / Service</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {appointments.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-500">
                              No appointments matching current filters.
                            </td>
                          </tr>
                        ) : (
                          appointments.map((apt) => (
                            <tr key={apt.id} className="hover:bg-slate-900/60 transition-colors">
                              <td className="py-3 px-3 font-mono font-semibold text-teal-300">
                                {apt.reference}
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <div className="font-semibold text-white">{formatIndianDate(apt.date)}</div>
                                <div className="text-[11px] text-teal-400">{apt.timeSlot}</div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-semibold text-white">{apt.patientName}</div>
                                <div className="text-[11px] text-slate-400">
                                  {apt.age ? `${apt.age}y · ` : ''}{apt.gender || ''}
                                </div>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <div>+91 {apt.mobile}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <a
                                    href={`tel:+91${apt.mobile}`}
                                    className="text-teal-400 hover:text-teal-300"
                                    title="Call patient"
                                  >
                                    <Phone className="w-3 h-3" />
                                  </a>
                                  <a
                                    href={`https://wa.me/91${apt.mobile}?text=${encodeURIComponent(
                                      `Hello ${apt.patientName}, regarding your appointment at Dr. S.K. Kasana Diabetes Centre (Ref: ${apt.reference}) on ${formatIndianDate(apt.date)} at ${apt.timeSlot}...`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 hover:text-emerald-300"
                                    title="WhatsApp patient"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                  </a>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="text-white truncate max-w-[150px]">{apt.primaryConcern}</div>
                                <div className="text-[11px] text-slate-400">{apt.consultationType}</div>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  apt.status === 'CONFIRMED'
                                    ? 'bg-teal-950 text-teal-300 border border-teal-800'
                                    : apt.status === 'COMPLETED'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : apt.status === 'CANCELLED'
                                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                                }`}>
                                  {apt.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  {apt.status !== 'COMPLETED' && (
                                    <button
                                      onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                                      className="px-2 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 rounded text-[10px] font-semibold"
                                      title="Mark Completed"
                                    >
                                      Complete
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      setReschedulingAppointment(apt);
                                      setRescheduleDate(apt.date);
                                      setRescheduleSlot(apt.timeSlot);
                                    }}
                                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-semibold"
                                  >
                                    Reschedule
                                  </button>
                                  {apt.status !== 'CANCELLED' && (
                                    <button
                                      onClick={() => handleUpdateStatus(apt.id, 'CANCELLED')}
                                      className="px-2 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded text-[10px] font-semibold"
                                      title="Cancel appointment"
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Reschedule Modal */}
                  {reschedulingAppointment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
                      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-md w-full space-y-4 text-xs">
                        <div className="font-bold text-sm text-white">
                          Reschedule Appointment: {reschedulingAppointment.reference}
                        </div>
                        <p className="text-slate-400">
                          Patient: {reschedulingAppointment.patientName} (+91 {reschedulingAppointment.mobile})
                        </p>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-slate-300 font-semibold mb-1">New Date</label>
                            <input
                              type="date"
                              value={rescheduleDate}
                              onChange={(e) => setRescheduleDate(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-300 font-semibold mb-1">New Time Slot</label>
                            <select
                              value={rescheduleSlot}
                              onChange={(e) => setRescheduleSlot(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                            >
                              <option value="10:00 AM">10:00 AM</option>
                              <option value="10:30 AM">10:30 AM</option>
                              <option value="11:00 AM">11:00 AM</option>
                              <option value="11:30 AM">11:30 AM</option>
                              <option value="12:00 PM">12:00 PM</option>
                              <option value="12:30 PM">12:30 PM</option>
                              <option value="05:00 PM">05:00 PM</option>
                              <option value="05:30 PM">05:30 PM</option>
                              <option value="06:00 PM">06:00 PM</option>
                              <option value="06:30 PM">06:30 PM</option>
                              <option value="07:00 PM">07:00 PM</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                          <button
                            type="button"
                            onClick={() => setReschedulingAppointment(null)}
                            className="px-3 py-1.5 text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveReschedule}
                            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
                          >
                            Save New Slot
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 2: CLINIC SCHEDULE & SLOTS SETTINGS */}
              {activeTab === 'schedule-settings' && settings && (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  {settingsMsg && (
                    <div className="p-3 bg-teal-950/70 border border-teal-800 text-teal-300 rounded-lg text-xs">
                      {settingsMsg}
                    </div>
                  )}

                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 text-xs">
                    <div className="font-bold text-sm text-white border-b border-slate-800 pb-2">
                      Consultation Session Timings &amp; Duration
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1">Consultation Duration</label>
                        <select
                          value={settings.consultationDuration}
                          onChange={(e) => setSettings({ ...settings, consultationDuration: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        >
                          <option value={15}>15 Minutes</option>
                          <option value={20}>20 Minutes</option>
                          <option value={30}>30 Minutes (Recommended)</option>
                          <option value={45}>45 Minutes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Morning Session Start</label>
                        <input
                          type="time"
                          value={settings.morningStart}
                          onChange={(e) => setSettings({ ...settings, morningStart: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Morning Session End</label>
                        <input
                          type="time"
                          value={settings.morningEnd}
                          onChange={(e) => setSettings({ ...settings, morningEnd: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Evening Session Start</label>
                        <input
                          type="time"
                          value={settings.eveningStart}
                          onChange={(e) => setSettings({ ...settings, eveningStart: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Evening Session End</label>
                        <input
                          type="time"
                          value={settings.eveningEnd}
                          onChange={(e) => setSettings({ ...settings, eveningEnd: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Holidays & Blocked Dates */}
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 text-xs">
                    <div className="font-bold text-sm text-white border-b border-slate-800 pb-2">
                      Clinic Holidays &amp; Blocked Dates
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={newHoliday}
                        onChange={(e) => setNewHoliday(e.target.value)}
                        className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newHoliday && !settings.holidays.includes(newHoliday)) {
                            setSettings({
                              ...settings,
                              holidays: [...settings.holidays, newHoliday],
                            });
                            setNewHoliday('');
                          }
                        }}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
                      >
                        Add Holiday
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {settings.holidays.map((h) => (
                        <span key={h} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-slate-300">
                          <span>{formatIndianDate(h)}</span>
                          <button
                            type="button"
                            onClick={() => setSettings({ ...settings, holidays: settings.holidays.filter((x) => x !== h) })}
                            className="text-rose-400 hover:text-rose-300"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Editable Doctor Placeholders */}
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 text-xs">
                    <div className="font-bold text-sm text-white border-b border-slate-800 pb-2">
                      Verified Doctor Profile Placeholders (Editable by Clinic Owner)
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Doctor Specialization Placeholder</label>
                        <input
                          type="text"
                          value={settings.doctorSpecializationPlaceholder || ''}
                          onChange={(e) => setSettings({ ...settings, doctorSpecializationPlaceholder: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Doctor Qualification Placeholder</label>
                        <input
                          type="text"
                          value={settings.doctorQualificationPlaceholder || ''}
                          onChange={(e) => setSettings({ ...settings, doctorQualificationPlaceholder: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Registration Details Placeholder</label>
                        <input
                          type="text"
                          value={settings.doctorRegistrationPlaceholder || ''}
                          onChange={(e) => setSettings({ ...settings, doctorRegistrationPlaceholder: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md"
                    >
                      {isSavingSettings ? 'Saving...' : 'Save Clinic Settings'}
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
