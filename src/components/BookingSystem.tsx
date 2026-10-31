import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Printer,
  MessageSquare,
  ShieldAlert,
  Loader2,
  ArrowRight,
  Building2,
  Video,
  FileCheck,
} from 'lucide-react';
import { CLINIC_CONTACT, CLINICAL_SERVICES } from '../data/clinicalContent';
import { Appointment, DayAvailabilityResponse } from '../types';

interface BookingSystemProps {
  preselectedService?: string;
  onClearPreselectedService?: () => void;
}

export const BookingSystem: React.FC<BookingSystemProps> = ({
  preselectedService,
  onClearPreselectedService,
}) => {
  // Step state (1: Patient Details, 2: Date, 3: Slot, 4: Verification, 5: Confirmation Slip)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [patientName, setPatientName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [consultationType, setConsultationType] = useState<'In-Person Clinic Visit' | 'Video / Tele-Consultation'>('In-Person Clinic Visit');
  const [visitType, setVisitType] = useState<'First-Time Visit' | 'Follow-Up Visit'>('First-Time Visit');
  const [primaryConcern, setPrimaryConcern] = useState(preselectedService || 'Diabetes Consultation');
  const [notes, setNotes] = useState('');

  // Update primaryConcern if preselected changes
  useEffect(() => {
    if (preselectedService) {
      setPrimaryConcern(preselectedService);
    }
  }, [preselectedService]);

  // Calendar State (Asia/Kolkata context)
  const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  // Slots State
  const [dayAvailability, setDayAvailability] = useState<DayAvailabilityResponse | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch slot availability from server on date change
  useEffect(() => {
    if (!selectedDate) {
      setDayAvailability(null);
      setSelectedSlot('');
      return;
    }

    const fetchAvailability = async () => {
      setIsLoadingSlots(true);
      setSlotsError(null);
      setSelectedSlot('');

      try {
        const response = await fetch(`/api/availability?date=${selectedDate}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setDayAvailability(data);
        } else {
          setSlotsError(data.message || 'Unable to load consultation slots for this date.');
        }
      } catch (err) {
        setSlotsError('Network connection issue. Please check your connectivity and retry.');
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [selectedDate]);

  const formatIndianDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const handleValidateStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!patientName.trim() || patientName.trim().length < 2) {
      newErrors.patientName = 'Please enter patient full name (minimum 2 characters).';
    }

    const cleanPhone = mobile.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address or leave it empty.';
    }

    if (age && (Number(age) < 1 || Number(age) > 120)) {
      newErrors.age = 'Please enter a valid age between 1 and 120.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setCurrentStep(2);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const currentYear = calendarMonth.getFullYear();
  const currentMonthIdx = calendarMonth.getMonth();
  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonthIdx);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonthIdx);

  const prevMonth = () => {
    const prev = new Date(currentYear, currentMonthIdx - 1, 1);
    const now = new Date();
    if (prev.getFullYear() < now.getFullYear() || (prev.getFullYear() === now.getFullYear() && prev.getMonth() < now.getMonth())) {
      return;
    }
    setCalendarMonth(prev);
  };

  const nextMonth = () => {
    const next = new Date(currentYear, currentMonthIdx + 1, 1);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    if (next <= maxDate) {
      setCalendarMonth(next);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleFinalConfirm = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        patientName: patientName.trim(),
        mobile: mobile.trim(),
        email: email.trim() || undefined,
        age: age ? Number(age) : undefined,
        gender,
        consultationType,
        visitType,
        primaryConcern,
        notes: notes.trim() || undefined,
        date: selectedDate,
        timeSlot: selectedSlot,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success && data.appointment) {
        setConfirmedAppointment(data.appointment);
        setCurrentStep(5);
      } else {
        setSubmitError(data.message || 'Slot collision detected. This time has just been reserved. Please select another slot.');
        if (selectedDate) {
          const checkRes = await fetch(`/api/availability?date=${selectedDate}`);
          const checkData = await checkRes.json();
          if (checkData.success) {
            setDayAvailability(checkData);
          }
        }
      }
    } catch (err) {
      setSubmitError('Network failure occurred. Please verify connectivity and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedDate('');
    setSelectedSlot('');
    setConfirmedAppointment(null);
    setSubmitError(null);
    if (onClearPreselectedService) {
      onClearPreselectedService();
    }
  };

  return (
    <section id="booking" className="py-20 sm:py-28 bg-[#0C2B22] text-[#FAF8F5] relative overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[linear-gradient(to_right,#C5A059_1px,transparent_1px),linear-gradient(to_bottom,#C5A059_1px,transparent_1px)] bg-[size:3rem_3rem]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
            Concierge Scheduling &middot; Zero Wait Time
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#FAF8F5] tracking-tight leading-[1.12]">
            Reserve Your Consultation with{' '}
            <span className="italic font-normal text-[#C5A059]">Dr. S.K. Kasana.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#B8C7B8] font-light max-w-xl mx-auto leading-relaxed">
            Direct, real-time consultation booking with instant reference allocation. Double-booking is programmatically prevented.
          </p>
        </div>

        {/* Step Progress Indicator */}
        {currentStep < 5 && (
          <div className="max-w-3xl mx-auto mb-10">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className={`p-2.5 rounded-sm border transition-colors ${currentStep >= 1 ? 'border-[#C5A059] bg-[#143E32] text-[#FAF8F5] font-semibold' : 'border-[#1C483A] text-[#6A8574]'}`}>
                <span className="font-editorial italic mr-1 text-[#C5A059]">1.</span> Patient Details
              </div>
              <div className={`p-2.5 rounded-sm border transition-colors ${currentStep >= 2 ? 'border-[#C5A059] bg-[#143E32] text-[#FAF8F5] font-semibold' : 'border-[#1C483A] text-[#6A8574]'}`}>
                <span className="font-editorial italic mr-1 text-[#C5A059]">2.</span> Calendar Date
              </div>
              <div className={`p-2.5 rounded-sm border transition-colors ${currentStep >= 3 ? 'border-[#C5A059] bg-[#143E32] text-[#FAF8F5] font-semibold' : 'border-[#1C483A] text-[#6A8574]'}`}>
                <span className="font-editorial italic mr-1 text-[#C5A059]">3.</span> Time Allocation
              </div>
              <div className={`p-2.5 rounded-sm border transition-colors ${currentStep >= 4 ? 'border-[#C5A059] bg-[#143E32] text-[#FAF8F5] font-semibold' : 'border-[#1C483A] text-[#6A8574]'}`}>
                <span className="font-editorial italic mr-1 text-[#C5A059]">4.</span> Verification
              </div>
            </div>
          </div>
        )}

        {/* Main Architectural Booking Card */}
        <div className="max-w-3xl mx-auto bg-[#071C16] border border-[#1B4D3E] rounded-sm p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          
          {/* STEP 1: PATIENT IDENTIFICATION */}
          {currentStep === 1 && (
            <form onSubmit={handleValidateStep1} className="space-y-6">
              <div className="border-b border-[#1B4D3E] pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-2xl text-[#FAF8F5] font-semibold">
                    Patient Identification &amp; Clinical Focus
                  </h3>
                  <p className="text-xs text-[#8A9E8E] font-light mt-0.5">
                    Please provide patient details for chart creation and appointment verification.
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/40 px-2 py-1">
                  Confidential
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#D0DBD0] mb-1.5 uppercase tracking-wider text-[11px]">
                    Patient Full Name <span className="text-[#C5A059]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Ramesh K. Sharma"
                    className="w-full px-4 py-3 bg-[#0C2B22] border border-[#1C483A] rounded-sm text-[#FAF8F5] placeholder-[#556059] text-xs sm:text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                  {errors.patientName && (
                    <p className="text-rose-400 text-xs mt-1">{errors.patientName}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block font-semibold text-[#D0DBD0] mb-1.5 uppercase tracking-wider text-[11px]">
                    Mobile Number <span className="text-[#C5A059]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-xs text-[#8A9E8E] font-semibold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="9811234567"
                      className="w-full pl-12 pr-4 py-3 bg-[#0C2B22] border border-[#1C483A] rounded-sm text-[#FAF8F5] placeholder-[#556059] text-xs sm:text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-rose-400 text-xs mt-1">{errors.mobile}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block font-semibold text-[#D0DBD0] mb-1.5 uppercase tracking-wider text-[11px]">
                    Email Address <span className="text-[#8A9E8E] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full px-4 py-3 bg-[#0C2B22] border border-[#1C483A] rounded-sm text-[#FAF8F5] placeholder-[#556059] text-xs sm:text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                  {errors.email && (
                    <p className="text-rose-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Patient Age & Gender */}
                <div>
                  <label className="block font-semibold text-[#D0DBD0] mb-1.5 uppercase tracking-wider text-[11px]">
                    Patient Age <span className="text-[#8A9E8E] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 52"
                    className="w-full px-4 py-3 bg-[#0C2B22] border border-[#1C483A] rounded-sm text-[#FAF8F5] placeholder-[#556059] text-xs sm:text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#D0DBD0] mb-1.5 uppercase tracking-wider text-[11px]">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0C2B22] border border-[#1C483A] rounded-sm text-[#FAF8F5] text-xs sm:text-sm focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Consultation Type */}
                <div>
                  <label className="block font-semibold text-[#D0DBD0] mb-1.5 uppercase tracking-wider text-[11px]">
                    Consultation Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConsultationType('In-Person Clinic Visit')}
                      className={`p-3 rounded-sm border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        consultationType === 'In-Person Clinic Visit'
                          ? 'border-[#C5A059] bg-[#143E32] text-white shadow-sm'
                          : 'border-[#1C483A] bg-[#0C2B22] text-[#8A9E8E] hover:border-[#2C584A]'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>In-Person Clinic</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setConsultationType('Video / Tele-Consultation')}
                      className={`p-3 rounded-sm border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        consultationType === 'Video / Tele-Consultation'
                          ? 'border-[#C5A059] bg-[#143E32] text-white shadow-sm'
                          : 'border-[#1C483A] bg-[#0C2B22] text-[#8A9E8E] hover:border-[#2C584A]'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Video Consult</span>
                    </button>
                  </div>
                </div>

                {/* Visit Type */}
                <div>
                  <label className="block font-semibold text-[#D0DBD0] mb-1.5 uppercase tracking-wider text-[11px]">
                    Visit Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setVisitType('First-Time Visit')}
                      className={`p-3 rounded-sm border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        visitType === 'First-Time Visit'
                          ? 'border-[#C5A059] bg-[#143E32] text-white shadow-sm'
                          : 'border-[#1C483A] bg-[#0C2B22] text-[#8A9E8E] hover:border-[#2C584A]'
                      }`}
                    >
                      <span>First-Time Visit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVisitType('Follow-Up Visit')}
                      className={`p-3 rounded-sm border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        visitType === 'Follow-Up Visit'
                          ? 'border-[#C5A059] bg-[#143E32] text-white shadow-sm'
                          : 'border-[#1C483A] bg-[#0C2B22] text-[#8A9E8E] hover:border-[#2C584A]'
                      }`}
                    >
                      <span>Follow-Up Visit</span>
                    </button>
                  </div>
                </div>

                {/* Primary Concern / Service */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#D0DBD0] mb-1.5 uppercase tracking-wider text-[11px]">
                    Primary Clinical Concern / Discipline
                  </label>
                  <select
                    value={primaryConcern}
                    onChange={(e) => setPrimaryConcern(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0C2B22] border border-[#1C483A] rounded-sm text-[#FAF8F5] text-xs sm:text-sm focus:outline-none focus:border-[#C5A059]"
                  >
                    {CLINICAL_SERVICES.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                    <option value="General Metabolic Check-Up">General Metabolic Check-Up</option>
                    <option value="Emergency Glucose Advice / Second Opinion">Emergency Glucose Advice / Second Opinion</option>
                  </select>
                </div>

                {/* Brief Notes */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#D0DBD0] mb-1.5 uppercase tracking-wider text-[11px]">
                    Brief Clinical Background <span className="text-[#8A9E8E] font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Recent HbA1c 8.2%, morning fasting sugars spiking, seeking medication adjustment..."
                    className="w-full px-4 py-2.5 bg-[#0C2B22] border border-[#1C483A] rounded-sm text-[#FAF8F5] placeholder-[#556059] text-xs sm:text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-[#1B4D3E] flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-7 py-3 text-xs uppercase tracking-widest font-semibold text-[#0C2B22] bg-[#C5A059] hover:bg-[#D4AF37] rounded-sm transition-all shadow-md"
                >
                  <span>Select Consultation Date</span>
                  <ArrowRight className="w-4 h-4 text-[#0C2B22]" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: INTERACTIVE CALENDAR & DATE SELECTION */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-[#1B4D3E] pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-2xl text-[#FAF8F5] font-semibold">
                    Select Consultation Date
                  </h3>
                  <p className="text-xs text-[#8A9E8E] font-light mt-0.5">
                    Dates in grey are unavailable (past dates, Sundays, or clinic holidays). Displayed in Indian format (DD/MM/YYYY).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-[#C5A059] hover:underline flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Details</span>
                </button>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center justify-between bg-[#0C2B22] p-3 rounded-sm border border-[#1C483A]">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1.5 text-[#D0DBD0] hover:text-white hover:bg-[#143E32] rounded-sm transition-colors"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="font-editorial text-lg text-white font-semibold tracking-wide">
                  {monthNames[currentMonthIdx]} {currentYear}
                </div>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1.5 text-[#D0DBD0] hover:text-white hover:bg-[#143E32] rounded-sm transition-colors"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#8A9E8E] mb-2 uppercase tracking-wider">
                  <span className="text-rose-400">Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-11" />
                  ))}

                  {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dayFormatted = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
                    const monthFormatted = currentMonthIdx + 1 < 10 ? `0${currentMonthIdx + 1}` : `${currentMonthIdx + 1}`;
                    const dateString = `${currentYear}-${monthFormatted}-${dayFormatted}`;

                    const cellDate = new Date(`${dateString}T12:00:00+05:30`);
                    const isSunday = cellDate.getDay() === 0;
                    const isPast = dateString < todayIST;
                    const isHoliday = ['2026-01-26', '2026-08-15', '2026-10-02'].includes(dateString);
                    const isDisabled = isPast || isSunday || isHoliday;
                    const isSelected = selectedDate === dateString;

                    return (
                      <button
                        key={dateString}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setSelectedDate(dateString)}
                        className={`h-12 rounded-sm text-xs font-semibold transition-all flex flex-col items-center justify-center relative border ${
                          isDisabled
                            ? 'bg-[#0A221B]/40 text-[#40564A] cursor-not-allowed border-transparent'
                            : isSelected
                            ? 'bg-[#C5A059] text-[#0C2B22] font-bold shadow-md border-[#E5BF78] ring-2 ring-[#C5A059]/40'
                            : 'bg-[#0C2B22] text-[#D0DBD0] hover:bg-[#143E32] hover:text-white border-[#1C483A]'
                        }`}
                      >
                        <span className="text-xs">{dayNum}</span>
                        {isSunday && (
                          <span className="text-[8px] text-rose-400 font-normal">Closed</span>
                        )}
                        {!isDisabled && !isSelected && dateString === todayIST && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Date Summary & Action */}
              <div className="pt-4 border-t border-[#1B4D3E] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#B8C7B8]">
                  {selectedDate ? (
                    <span>
                      Selected: <strong className="text-[#C5A059] font-bold">{formatIndianDate(selectedDate)}</strong> ({new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long' })})
                    </span>
                  ) : (
                    <span className="text-[#8A9E8E]">Please click an available date on the calendar.</span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={!selectedDate}
                  onClick={() => setCurrentStep(3)}
                  className={`inline-flex items-center gap-2 px-7 py-3 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all ${
                    selectedDate
                      ? 'bg-[#C5A059] hover:bg-[#D4AF37] text-[#0C2B22] shadow-md'
                      : 'bg-[#1C483A] text-[#556059] cursor-not-allowed'
                  }`}
                >
                  <span>Choose Time Slot</span>
                  <ArrowRight className="w-4 h-4 text-[#0C2B22]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TIME SLOT SELECTION */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-[#1B4D3E] pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-2xl text-[#FAF8F5] font-semibold">
                    Select Available Consultation Slot
                  </h3>
                  <p className="text-xs text-[#8A9E8E] font-light mt-0.5">
                    Date: <strong className="text-[#C5A059]">{formatIndianDate(selectedDate)}</strong> ({new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long' })}) &middot; Asia/Kolkata
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-[#C5A059] hover:underline flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Change Date</span>
                </button>
              </div>

              {isLoadingSlots && (
                <div className="py-14 flex flex-col items-center justify-center gap-3 text-[#D0DBD0]">
                  <Loader2 className="w-7 h-7 text-[#C5A059] animate-spin" />
                  <span className="text-xs">Connecting to Dr. Kasana Clinic scheduler...</span>
                </div>
              )}

              {!isLoadingSlots && (slotsError || (dayAvailability && dayAvailability.isClosed)) && (
                <div className="p-5 rounded-sm bg-rose-950/40 border border-rose-900/60 text-xs text-rose-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm">Chambers Unavailable</div>
                    <p className="mt-1">
                      {slotsError || dayAvailability?.reason || 'Chambers are closed for consultations on this date.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="mt-3 px-3 py-1.5 bg-rose-900/60 hover:bg-rose-900 rounded-sm text-white font-semibold transition-colors"
                    >
                      Choose Another Date
                    </button>
                  </div>
                </div>
              )}

              {!isLoadingSlots && dayAvailability && !dayAvailability.isClosed && (
                <div className="space-y-6">
                  
                  {/* Morning Session */}
                  <div>
                    <div className="text-[11px] uppercase tracking-widest font-semibold text-[#C5A059] mb-3">
                      Morning Chambers (09:30 AM – 01:00 PM)
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {dayAvailability.slots
                        .filter((s) => s.timeSlot.includes('AM'))
                        .map((slot) => {
                          const isSelected = selectedSlot === slot.timeSlot;
                          return (
                            <button
                              key={slot.timeSlot}
                              type="button"
                              disabled={!slot.isAvailable}
                              onClick={() => setSelectedSlot(slot.timeSlot)}
                              className={`py-3 px-3 rounded-sm text-xs font-semibold transition-all border ${
                                !slot.isAvailable
                                  ? 'bg-[#0A221B]/40 text-[#40564A] border-transparent cursor-not-allowed line-through'
                                  : isSelected
                                  ? 'bg-[#C5A059] text-[#0C2B22] font-bold border-[#E5BF78] shadow-md'
                                  : 'bg-[#0C2B22] text-[#D0DBD0] hover:bg-[#143E32] border-[#1C483A]'
                              }`}
                            >
                              {slot.timeSlot}
                              {!slot.isAvailable && (
                                <span className="block text-[8px] text-[#556059] no-underline">
                                  Reserved
                                </span>
                              )}
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {/* Evening Session */}
                  <div>
                    <div className="text-[11px] uppercase tracking-widest font-semibold text-[#C5A059] mb-3">
                      Evening Chambers (04:30 PM – 07:30 PM)
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {dayAvailability.slots
                        .filter((s) => s.timeSlot.includes('PM'))
                        .map((slot) => {
                          const isSelected = selectedSlot === slot.timeSlot;
                          return (
                            <button
                              key={slot.timeSlot}
                              type="button"
                              disabled={!slot.isAvailable}
                              onClick={() => setSelectedSlot(slot.timeSlot)}
                              className={`py-3 px-3 rounded-sm text-xs font-semibold transition-all border ${
                                !slot.isAvailable
                                  ? 'bg-[#0A221B]/40 text-[#40564A] border-transparent cursor-not-allowed line-through'
                                  : isSelected
                                  ? 'bg-[#C5A059] text-[#0C2B22] font-bold border-[#E5BF78] shadow-md'
                                  : 'bg-[#0C2B22] text-[#D0DBD0] hover:bg-[#143E32] border-[#1C483A]'
                              }`}
                            >
                              {slot.timeSlot}
                              {!slot.isAvailable && (
                                <span className="block text-[8px] text-[#556059] no-underline">
                                  Reserved
                                </span>
                              )}
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {/* Slot selection footer */}
                  <div className="pt-4 border-t border-[#1B4D3E] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-[#B8C7B8]">
                      {selectedSlot ? (
                        <span>
                          Chosen Slot: <strong className="text-[#C5A059] font-bold">{selectedSlot}</strong> on {formatIndianDate(selectedDate)}
                        </span>
                      ) : (
                        <span className="text-[#8A9E8E]">Please click an available time slot above.</span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={!selectedSlot}
                      onClick={() => setCurrentStep(4)}
                      className={`inline-flex items-center gap-2 px-7 py-3 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all ${
                        selectedSlot
                          ? 'bg-[#C5A059] hover:bg-[#D4AF37] text-[#0C2B22] shadow-md'
                          : 'bg-[#1C483A] text-[#556059] cursor-not-allowed'
                      }`}
                    >
                      <span>Review &amp; Verify</span>
                      <ArrowRight className="w-4 h-4 text-[#0C2B22]" />
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* STEP 4: VERIFICATION & SUMMARY */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-[#1B4D3E] pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-2xl text-[#FAF8F5] font-semibold">
                    Final Clinical Verification
                  </h3>
                  <p className="text-xs text-[#8A9E8E] font-light mt-0.5">
                    Review your consultation reservation details before atomic database confirmation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs text-[#C5A059] hover:underline flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Change Slot</span>
                </button>
              </div>

              {submitError && (
                <div className="p-4 rounded-sm bg-rose-950/50 border border-rose-900 text-xs text-rose-200 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm">Booking Conflict</div>
                    <p className="mt-1">{submitError}</p>
                  </div>
                </div>
              )}

              {/* Summary Cards in Warm Editorial Style */}
              <div className="bg-[#0C2B22] border border-[#1C483A] rounded-sm p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#1C483A]">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#8A9E8E]">Patient Name</div>
                    <div className="font-editorial text-xl text-white font-semibold mt-0.5">{patientName}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#8A9E8E]">Registered Phone</div>
                    <div className="text-sm font-bold text-[#C5A059] mt-0.5">+91 {mobile}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#8A9E8E]">Appointment Date</div>
                    <div className="text-xs font-semibold text-white mt-0.5">
                      {formatIndianDate(selectedDate)} ({new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long' })})
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#8A9E8E]">Designated Time Slot</div>
                    <div className="text-xs font-semibold text-[#C5A059] mt-0.5">{selectedSlot} (IST)</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#8A9E8E]">Consultation Mode</div>
                    <div className="text-xs text-[#D0DBD0] mt-0.5">{consultationType}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#8A9E8E]">Visit Category</div>
                    <div className="text-xs text-[#D0DBD0] mt-0.5">{visitType}</div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-[10px] uppercase tracking-widest text-[#8A9E8E]">Clinical Discipline</div>
                    <div className="text-xs font-semibold text-white mt-0.5">{primaryConcern}</div>
                  </div>
                </div>

                <div className="text-[11px] text-[#8A9E8E] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>Clinic Chambers: J 350, Pocket J, Sarita Vihar, New Delhi 110076</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#1B4D3E] flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-[#8A9E8E] hover:text-white"
                >
                  Edit Patient Information
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalConfirm}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-widest font-bold text-[#0C2B22] bg-[#C5A059] hover:bg-[#D4AF37] rounded-sm shadow-xl transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#0C2B22]" />
                      <span>Locking Slot in Database...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4 text-[#0C2B22]" />
                      <span>Confirm &amp; Generate Consultation Slip</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* STEP 5: CONFIRMATION & PRINTABLE SLIP */}
          {currentStep === 5 && confirmedAppointment && (
            <div className="space-y-6 text-center animate-in fade-in duration-300">
              
              <div className="w-16 h-16 rounded-full bg-[#143E32] text-[#C5A059] border border-[#C5A059]/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                  Consultation Confirmed
                </div>
                <h3 className="font-editorial text-3xl text-white font-semibold">
                  Reference: {confirmedAppointment.reference}
                </h3>
                <p className="text-xs text-[#8A9E8E] font-light max-w-md mx-auto">
                  Your appointment is officially registered in our clinic database. Please print or retain your digital consultation slip.
                </p>
              </div>

              {/* Bespoke Printable Slip Card */}
              <div className="bg-[#FAF8F5] text-[#1A201C] rounded-sm p-6 sm:p-8 text-left shadow-2xl border border-[#D5DDD3] space-y-5">
                
                <div className="flex items-start justify-between border-b border-[#E8E4DC] pb-4">
                  <div>
                    <div className="font-editorial text-xl font-bold text-[#0C2B22]">
                      Dr. S.K. Kasana Advanced Diabetes Centre
                    </div>
                    <div className="text-[11px] text-[#556059] font-light mt-0.5">
                      New Life &middot; J 350, Pocket J, Sarita Vihar, New Delhi 110076
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#0C2B22] border border-[#0C2B22] px-2.5 py-1 rounded-sm">
                      CONFIRMED
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#556059] text-[10px] uppercase tracking-wider block">Patient Name</span>
                    <strong className="text-sm font-editorial text-[#0C2B22]">{confirmedAppointment.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-[#556059] text-[10px] uppercase tracking-wider block">Contact Number</span>
                    <strong className="text-sm text-[#0C2B22]">+91 {confirmedAppointment.mobile}</strong>
                  </div>
                  <div>
                    <span className="text-[#556059] text-[10px] uppercase tracking-wider block">Consultation Date</span>
                    <strong className="text-sm font-bold text-[#0C2B22]">{formatIndianDate(confirmedAppointment.date)}</strong>
                  </div>
                  <div>
                    <span className="text-[#556059] text-[10px] uppercase tracking-wider block">Scheduled Slot</span>
                    <strong className="text-sm font-bold text-[#0C2B22]">{confirmedAppointment.timeSlot} (IST)</strong>
                  </div>
                  <div>
                    <span className="text-[#556059] text-[10px] uppercase tracking-wider block">Consultation Mode</span>
                    <strong className="text-xs text-[#0C2B22]">{confirmedAppointment.consultationType}</strong>
                  </div>
                  <div>
                    <span className="text-[#556059] text-[10px] uppercase tracking-wider block">Discipline</span>
                    <strong className="text-xs text-[#0C2B22]">{confirmedAppointment.primaryConcern}</strong>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8E4DC] text-[11px] text-[#556059] space-y-1 font-light">
                  <div><strong>Address:</strong> J Pocket, J 350, Pocket J, Sarita Vihar, New Delhi, Delhi 110076</div>
                  <div><strong>Clinic Helpline:</strong> +91 9911887793 &middot; Please arrive 10 minutes prior to your time slot with past lab reports.</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-semibold text-[#0C2B22] bg-[#FAF8F5] hover:bg-white rounded-sm shadow-md transition-all"
                >
                  <Printer className="w-4 h-4 text-[#0C2B22]" />
                  <span>Print Consultation Slip</span>
                </button>

                <a
                  href={`https://wa.me/919911887793?text=${encodeURIComponent(
                    `Hello Dr. S.K. Kasana Diabetes Centre, I have booked a consultation.\nReference: ${confirmedAppointment.reference}\nPatient: ${confirmedAppointment.patientName}\nDate: ${formatIndianDate(confirmedAppointment.date)}\nSlot: ${confirmedAppointment.timeSlot}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-semibold text-white bg-[#1B4D3E] hover:bg-[#143E32] border border-[#2B6150] rounded-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                  <span>Send WhatsApp Confirmation</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-3 text-xs uppercase tracking-widest font-semibold text-[#8A9E8E] hover:text-white"
                >
                  New Booking
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
