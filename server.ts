import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Persistent storage setup
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'clinic-data.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface Appointment {
  id: string;
  reference: string;
  patientName: string;
  mobile: string;
  email?: string;
  age?: number;
  gender?: string;
  consultationType: 'In-Person Clinic Visit' | 'Video / Tele-Consultation';
  visitType: 'First-Time Visit' | 'Follow-Up Visit';
  primaryConcern: string;
  notes?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM"
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  createdAt: string;
  internalNotes?: string;
  cancellationReason?: string;
}

export interface ClinicSettings {
  clinicName: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  rating: number;
  reviewCount: number;
  consultationDuration: number; // in minutes (default 30)
  workingDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat (Default 1-6 Mon-Sat)
  morningStart: string; // "09:30"
  morningEnd: string; // "13:00"
  eveningStart: string; // "16:30"
  eveningEnd: string; // "19:30"
  holidays: string[]; // YYYY-MM-DD
  blockedDates: string[]; // YYYY-MM-DD
  blockedSlots: { date: string; timeSlot: string }[];
  doctorName: string;
  doctorSpecializationPlaceholder: string;
  doctorQualificationPlaceholder: string;
  doctorRegistrationPlaceholder: string;
  adminPasswordHash: string; // "Kasana@Care2026!"
}

interface StoredData {
  settings: ClinicSettings;
  appointments: Appointment[];
  inquiries: Array<{
    id: string;
    name: string;
    phone: string;
    email?: string;
    message: string;
    createdAt: string;
    status: 'NEW' | 'RESPONDED';
  }>;
}

const DEFAULT_SETTINGS: ClinicSettings = {
  clinicName: 'Dr. S.K. Kasana Advanced Diabetes & Metabolic Centre @ New Life',
  address: 'J Pocket, J 350, Pocket J, Sarita Vihar, New Delhi, Delhi 110076, India',
  phone: '+91 9911887793',
  whatsappNumber: '+919911887793',
  rating: 4.9,
  reviewCount: 200,
  consultationDuration: 30,
  workingDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
  morningStart: '09:30',
  morningEnd: '13:00',
  eveningStart: '16:30',
  eveningEnd: '19:30',
  holidays: ['2026-01-26', '2026-08-15', '2026-10-02', '2026-11-08'],
  blockedDates: [],
  blockedSlots: [],
  doctorName: 'Dr. S.K. Kasana',
  doctorSpecializationPlaceholder: 'Senior Diabetes & Metabolic Health Specialist',
  doctorQualificationPlaceholder: 'Consultant Diabetologist & Metabolic Physician (Qualifications editable)',
  doctorRegistrationPlaceholder: 'Registered Medical Practitioner (Reg. details editable upon verification)',
  adminPasswordHash: 'Kasana@Care2026!',
};

function getStoredData(): StoredData {
  if (!fs.existsSync(DATA_FILE)) {
    // Generate initial structured demo appointments for display in admin
    const initialAppointments: Appointment[] = [
      {
        id: 'apt-seed-1',
        reference: 'NL-20261030-8421',
        patientName: 'Ramesh K. Gupta',
        mobile: '9811234567',
        email: 'ramesh.gupta@example.com',
        age: 54,
        gender: 'Male',
        consultationType: 'In-Person Clinic Visit',
        visitType: 'Follow-Up Visit',
        primaryConcern: 'HbA1c 3-Month Progress & Medication Review',
        notes: 'Fasting blood sugar was high last week.',
        date: '2026-10-30',
        timeSlot: '10:00 AM',
        status: 'CONFIRMED',
        createdAt: '2026-10-28T10:15:00.000Z',
        internalNotes: 'Patient history of Type 2 Diabetes for 6 years.',
      },
      {
        id: 'apt-seed-2',
        reference: 'NL-20261030-9154',
        patientName: 'Sunita Mehra',
        mobile: '9910987654',
        email: 'sunita.m@example.com',
        age: 42,
        gender: 'Female',
        consultationType: 'In-Person Clinic Visit',
        visitType: 'First-Time Visit',
        primaryConcern: 'Metabolic Health Assessment & Weight Management',
        notes: 'Referred by family physician for pre-diabetes evaluation.',
        date: '2026-10-30',
        timeSlot: '11:00 AM',
        status: 'CONFIRMED',
        createdAt: '2026-10-28T14:30:00.000Z',
        internalNotes: 'First consultation. Schedule fasting and post-prandial labs.',
      },
      {
        id: 'apt-seed-3',
        reference: 'NL-20261030-3321',
        patientName: 'Virender Singh',
        mobile: '9873456123',
        age: 61,
        gender: 'Male',
        consultationType: 'In-Person Clinic Visit',
        visitType: 'Follow-Up Visit',
        primaryConcern: 'Diabetic Neuropathy & Foot Check',
        date: '2026-10-30',
        timeSlot: '05:00 PM',
        status: 'CONFIRMED',
        createdAt: '2026-10-29T09:00:00.000Z',
      },
    ];

    const initialData: StoredData = {
      settings: DEFAULT_SETTINGS,
      appointments: initialAppointments,
      inquiries: [
        {
          id: 'inq-1',
          name: 'Pooja Verma',
          phone: '9810112233',
          email: 'pooja.verma@example.com',
          message: 'Inquiring about diet counselling for gestational diabetes.',
          createdAt: '2026-10-29T11:00:00.000Z',
          status: 'NEW',
        },
      ],
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading clinic data file, using defaults', err);
    return {
      settings: DEFAULT_SETTINGS,
      appointments: [],
      inquiries: [],
    };
  }
}

function saveStoredData(data: StoredData): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Helper to generate slots for a day
function generateTimeSlots(settings: ClinicSettings): string[] {
  const slots: string[] = [];

  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const formatSlot = (minutes: number) => {
    const h24 = Math.floor(minutes / 60);
    const m = minutes % 60;
    const period = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    const mStr = m < 10 ? `0${m}` : `${m}`;
    return `${h12}:${mStr} ${period}`;
  };

  const duration = settings.consultationDuration || 30;

  // Morning session
  const mStart = parseTime(settings.morningStart);
  const mEnd = parseTime(settings.morningEnd);
  for (let t = mStart; t + duration <= mEnd; t += duration) {
    slots.push(formatSlot(t));
  }

  // Evening session
  const eStart = parseTime(settings.eveningStart);
  const eEnd = parseTime(settings.eveningEnd);
  for (let t = eStart; t + duration <= eEnd; t += duration) {
    slots.push(formatSlot(t));
  }

  return slots;
}

// -------------------------------------------------------------
// PUBLIC API ENDPOINTS
// -------------------------------------------------------------

// 1. Clinic Info
app.get('/api/clinic-info', (_req: Request, res: Response) => {
  const data = getStoredData();
  const { adminPasswordHash, ...safeSettings } = data.settings;
  res.json({
    success: true,
    data: safeSettings,
  });
});

// 2. Availability by Date
app.get('/api/availability', (req: Request, res: Response) => {
  const dateStr = req.query.date as string;
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return res.status(400).json({ success: false, message: 'Invalid or missing date parameter (YYYY-MM-DD)' });
  }

  const data = getStoredData();
  const settings = data.settings;

  // Date parsing in IST context
  const selectedDate = new Date(`${dateStr}T12:00:00+05:30`);
  const dayOfWeek = selectedDate.getDay(); // 0 is Sunday

  // Check if closed day of week
  if (!settings.workingDays.includes(dayOfWeek)) {
    return res.json({
      success: true,
      date: dateStr,
      isClosed: true,
      reason: dayOfWeek === 0 ? 'Clinic is closed on Sundays' : 'Clinic is not scheduled for consultations on this day',
      slots: [],
    });
  }

  // Check if holiday or blocked date
  if (settings.holidays.includes(dateStr)) {
    return res.json({
      success: true,
      date: dateStr,
      isClosed: true,
      reason: 'Clinic holiday / National holiday',
      slots: [],
    });
  }

  if (settings.blockedDates.includes(dateStr)) {
    return res.json({
      success: true,
      date: dateStr,
      isClosed: true,
      reason: 'Doctor unavailable on this date',
      slots: [],
    });
  }

  const allSlots = generateTimeSlots(settings);

  // Active bookings on this date (not cancelled)
  const bookedSlotsOnDate = new Set(
    data.appointments
      .filter((apt) => apt.date === dateStr && apt.status !== 'CANCELLED')
      .map((apt) => apt.timeSlot)
  );

  // Blocked slots for this date by admin
  const manuallyBlocked = new Set(
    settings.blockedSlots
      .filter((b) => b.date === dateStr)
      .map((b) => b.timeSlot)
  );

  const slotStatusList = allSlots.map((slot) => {
    const isBooked = bookedSlotsOnDate.has(slot);
    const isBlocked = manuallyBlocked.has(slot);
    return {
      timeSlot: slot,
      isAvailable: !isBooked && !isBlocked,
      status: isBooked ? 'BOOKED' : isBlocked ? 'BLOCKED' : 'AVAILABLE',
    };
  });

  return res.json({
    success: true,
    date: dateStr,
    isClosed: false,
    totalSlots: slotStatusList.length,
    availableSlotsCount: slotStatusList.filter((s) => s.isAvailable).length,
    slots: slotStatusList,
  });
});

// 3. Create Appointment with Server-Side Validation and Double Booking Lock
app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    patientName,
    mobile,
    email,
    age,
    gender,
    consultationType,
    visitType,
    primaryConcern,
    notes,
    date,
    timeSlot,
  } = req.body;

  // Validation
  if (!patientName || typeof patientName !== 'string' || patientName.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Please provide a valid patient full name.' });
  }

  const cleanedPhone = (mobile || '').replace(/[^0-9]/g, '');
  if (cleanedPhone.length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid 10-digit mobile number for appointment SMS/WhatsApp verification.',
    });
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ success: false, message: 'Please select a valid consultation date.' });
  }

  if (!timeSlot || typeof timeSlot !== 'string') {
    return res.status(400).json({ success: false, message: 'Please select an available time slot.' });
  }

  // Check if date is in the past
  const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  if (date < todayIST) {
    return res.status(400).json({ success: false, message: 'Cannot book appointments for past dates.' });
  }

  const data = getStoredData();
  const settings = data.settings;

  // Check clinic closed
  const selectedDate = new Date(`${date}T12:00:00+05:30`);
  if (!settings.workingDays.includes(selectedDate.getDay()) || settings.holidays.includes(date) || settings.blockedDates.includes(date)) {
    return res.status(400).json({ success: false, message: 'The clinic is closed on the selected date.' });
  }

  // DOUBLE-BOOKING CONCURRENCY GUARD: Check if slot is already occupied
  const existingActive = data.appointments.find(
    (a) => a.date === date && a.timeSlot === timeSlot && a.status !== 'CANCELLED'
  );

  if (existingActive) {
    return res.status(409).json({
      success: false,
      message: `The ${timeSlot} slot on ${date} has just been reserved by another patient. Please choose another available slot.`,
    });
  }

  // Generate unique booking reference number
  const dateCompact = date.replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const reference = `NL-${dateCompact}-${randomSuffix}`;
  const id = `apt-${Date.now()}-${randomSuffix}`;

  const newAppointment: Appointment = {
    id,
    reference,
    patientName: patientName.trim(),
    mobile: cleanedPhone,
    email: email && typeof email === 'string' ? email.trim() : undefined,
    age: age ? Number(age) : undefined,
    gender: gender || 'Not specified',
    consultationType: consultationType === 'Video / Tele-Consultation' ? 'Video / Tele-Consultation' : 'In-Person Clinic Visit',
    visitType: visitType === 'First-Time Visit' ? 'First-Time Visit' : 'Follow-Up Visit',
    primaryConcern: (primaryConcern || 'General Diabetes & Metabolic Health').trim(),
    notes: notes && typeof notes === 'string' ? notes.trim() : undefined,
    date,
    timeSlot,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  };

  data.appointments.push(newAppointment);
  saveStoredData(data);

  return res.status(201).json({
    success: true,
    message: 'Appointment confirmed successfully!',
    appointment: newAppointment,
    clinicContact: {
      phone: settings.phone,
      whatsapp: settings.whatsappNumber,
      address: settings.address,
    },
  });
});

// 4. Patient Lookup by Reference or Phone
app.get('/api/bookings/lookup', (req: Request, res: Response) => {
  const query = ((req.query.q as string) || '').trim();
  if (!query) {
    return res.status(400).json({ success: false, message: 'Reference number or mobile number required.' });
  }

  const data = getStoredData();
  const match = data.appointments.find(
    (a) => a.reference.toLowerCase() === query.toLowerCase() || a.mobile === query.replace(/[^0-9]/g, '')
  );

  if (!match) {
    return res.status(404).json({ success: false, message: 'No appointment found with the provided details.' });
  }

  return res.json({
    success: true,
    appointment: match,
  });
});

// 5. Public Contact Form Submission
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, phone, email, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ success: false, message: 'Name, phone number, and message are required.' });
  }

  const data = getStoredData();
  const newInquiry = {
    id: `inq-${Date.now()}`,
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : undefined,
    message: message.trim(),
    createdAt: new Date().toISOString(),
    status: 'NEW' as const,
  };

  data.inquiries.push(newInquiry);
  saveStoredData(data);

  return res.json({
    success: true,
    message: 'Thank you for reaching out. The clinic team will respond to you shortly.',
  });
});

// -------------------------------------------------------------
// SECURE ADMIN DASHBOARD APIS
// -------------------------------------------------------------

const ADMIN_TOKEN = 'kasana_admin_session_token_2026_secured';

// Middleware for Admin Auth
function requireAdmin(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Admin credentials required.' });
  }
  next();
}

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const data = getStoredData();

  if (
    (username === 'admin@newlife.clinic' || username === 'admin' || username === 'drskkasana') &&
    password === data.settings.adminPasswordHash
  ) {
    return res.json({
      success: true,
      token: ADMIN_TOKEN,
      user: {
        username: 'Dr. S.K. Kasana Clinic Admin',
        role: 'Administrator',
      },
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
});

// Admin: Get all appointments with filtering and search
app.get('/api/admin/appointments', requireAdmin, (req: Request, res: Response) => {
  const data = getStoredData();
  const { status, date, search } = req.query;

  let filtered = [...data.appointments];

  if (status && status !== 'ALL') {
    filtered = filtered.filter((a) => a.status === status);
  }

  if (date) {
    filtered = filtered.filter((a) => a.date === date);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.patientName.toLowerCase().includes(q) ||
        a.mobile.includes(q) ||
        a.reference.toLowerCase().includes(q) ||
        a.primaryConcern.toLowerCase().includes(q)
    );
  }

  // Sort descending by date & time
  filtered.sort((a, b) => (b.date + b.timeSlot).localeCompare(a.date + a.timeSlot));

  // Quick statistics
  const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const todayCount = data.appointments.filter((a) => a.date === todayIST && a.status !== 'CANCELLED').length;
  const upcomingCount = data.appointments.filter((a) => a.date >= todayIST && a.status === 'CONFIRMED').length;
  const completedCount = data.appointments.filter((a) => a.status === 'COMPLETED').length;

  return res.json({
    success: true,
    appointments: filtered,
    stats: {
      total: data.appointments.length,
      today: todayCount,
      upcoming: upcomingCount,
      completed: completedCount,
    },
  });
});

// Admin: Update Appointment Status / Reschedule / Notes
app.patch('/api/admin/appointments/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, date, timeSlot, internalNotes, cancellationReason } = req.body;

  const data = getStoredData();
  const appointmentIndex = data.appointments.findIndex((a) => a.id === id);

  if (appointmentIndex === -1) {
    return res.status(404).json({ success: false, message: 'Appointment not found.' });
  }

  const current = data.appointments[appointmentIndex];

  // If rescheduling, check for conflicts
  if (date && timeSlot && (date !== current.date || timeSlot !== current.timeSlot)) {
    const conflict = data.appointments.find(
      (a) => a.id !== id && a.date === date && a.timeSlot === timeSlot && a.status !== 'CANCELLED'
    );
    if (conflict) {
      return res.status(409).json({ success: false, message: 'The chosen date and time slot is already booked.' });
    }
    current.date = date;
    current.timeSlot = timeSlot;
    current.status = 'RESCHEDULED';
  }

  if (status) {
    current.status = status;
  }
  if (internalNotes !== undefined) {
    current.internalNotes = internalNotes;
  }
  if (cancellationReason !== undefined) {
    current.cancellationReason = cancellationReason;
  }

  data.appointments[appointmentIndex] = current;
  saveStoredData(data);

  return res.json({
    success: true,
    message: 'Appointment updated successfully.',
    appointment: current,
  });
});

// Admin: Get clinic schedule settings
app.get('/api/admin/schedule-settings', requireAdmin, (_req: Request, res: Response) => {
  const data = getStoredData();
  res.json({
    success: true,
    settings: data.settings,
  });
});

// Admin: Update clinic schedule settings
app.put('/api/admin/schedule-settings', requireAdmin, (req: Request, res: Response) => {
  const data = getStoredData();
  const updates = req.body;

  // Protect admin password unless specifically updated
  if (updates.adminPasswordHash && updates.adminPasswordHash.trim().length >= 6) {
    data.settings.adminPasswordHash = updates.adminPasswordHash;
  }

  if (updates.consultationDuration) data.settings.consultationDuration = Number(updates.consultationDuration);
  if (updates.workingDays) data.settings.workingDays = updates.workingDays;
  if (updates.morningStart) data.settings.morningStart = updates.morningStart;
  if (updates.morningEnd) data.settings.morningEnd = updates.morningEnd;
  if (updates.eveningStart) data.settings.eveningStart = updates.eveningStart;
  if (updates.eveningEnd) data.settings.eveningEnd = updates.eveningEnd;
  if (updates.holidays) data.settings.holidays = updates.holidays;
  if (updates.blockedDates) data.settings.blockedDates = updates.blockedDates;
  if (updates.blockedSlots) data.settings.blockedSlots = updates.blockedSlots;

  // Editable Doctor placeholders
  if (updates.doctorSpecializationPlaceholder) data.settings.doctorSpecializationPlaceholder = updates.doctorSpecializationPlaceholder;
  if (updates.doctorQualificationPlaceholder) data.settings.doctorQualificationPlaceholder = updates.doctorQualificationPlaceholder;
  if (updates.doctorRegistrationPlaceholder) data.settings.doctorRegistrationPlaceholder = updates.doctorRegistrationPlaceholder;

  saveStoredData(data);

  return res.json({
    success: true,
    message: 'Clinic schedule settings updated successfully.',
    settings: data.settings,
  });
});

// Admin: Export appointments as CSV
app.get('/api/admin/export-csv', requireAdmin, (_req: Request, res: Response) => {
  const data = getStoredData();
  const appointments = data.appointments;

  const headers = [
    'Reference ID',
    'Date (YYYY-MM-DD)',
    'Time Slot',
    'Status',
    'Patient Name',
    'Mobile Number',
    'Email',
    'Age',
    'Gender',
    'Consultation Type',
    'Visit Type',
    'Primary Health Concern',
    'Created At',
  ];

  const escapeCSV = (str?: string | number) => {
    if (str === undefined || str === null) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = appointments.map((a) => [
    escapeCSV(a.reference),
    escapeCSV(a.date),
    escapeCSV(a.timeSlot),
    escapeCSV(a.status),
    escapeCSV(a.patientName),
    escapeCSV(a.mobile),
    escapeCSV(a.email || ''),
    escapeCSV(a.age || ''),
    escapeCSV(a.gender || ''),
    escapeCSV(a.consultationType),
    escapeCSV(a.visitType),
    escapeCSV(a.primaryConcern),
    escapeCSV(a.createdAt),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="Dr_SK_Kasana_Appointments_${new Date().toISOString().split('T')[0]}.csv"`
  );
  return res.send(csvContent);
});

// -------------------------------------------------------------
// SEO FILES: sitemap.xml & robots.txt
// -------------------------------------------------------------

app.get('/sitemap.xml', (_req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || 'https://ais-dev-lnwnq4m6wty257cyx4qfl6-743052663822.asia-southeast1.run.app';
  const currentDate = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/#services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/#doctor</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/#booking</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/#education</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/#contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  return res.send(sitemap);
});

app.get('/robots.txt', (_req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || 'https://ais-dev-lnwnq4m6wty257cyx4qfl6-743052663822.asia-southeast1.run.app';
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${baseUrl}/sitemap.xml`;

  res.setHeader('Content-Type', 'text/plain');
  return res.send(robots);
});

// -------------------------------------------------------------
// VITE INTEGRATION & STATIC SERVING
// -------------------------------------------------------------

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
