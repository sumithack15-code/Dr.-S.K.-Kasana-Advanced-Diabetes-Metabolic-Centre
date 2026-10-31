import React, { useState } from 'react';
import { Search, X, Loader2, Phone, AlertCircle, MessageSquare } from 'lucide-react';
import { Appointment } from '../types';
import { CLINIC_CONTACT } from '../data/clinicalContent';

interface PatientLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatientLookupModal: React.FC<PatientLookupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setAppointment(null);

    try {
      const res = await fetch(`/api/bookings/lookup?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (res.ok && data.success && data.appointment) {
        setAppointment(data.appointment);
      } else {
        setError(data.message || 'No appointment found matching this reference or mobile number.');
      }
    } catch (err) {
      setError('Unable to connect to clinic lookup service. Please check your connectivity.');
    } finally {
      setLoading(false);
    }
  };

  const formatIndianDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071C16]/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#FAF8F5] border border-[#D5DDD3] rounded-sm max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E8E4DC] pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
              Patient Portal Concierge
            </span>
            <h3 className="font-editorial text-2xl text-[#0C2B22] font-semibold mt-0.5">
              Track Your Appointment
            </h3>
            <p className="text-xs text-[#556059] font-light mt-0.5">
              Enter your Booking Reference (NL-...) or 10-digit mobile number.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#556059] hover:text-[#0C2B22]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. NL-20261030-8421 or 9811234567"
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-[#D5DDD3] rounded-sm text-[#0C2B22] focus:outline-none focus:border-[#0C2B22]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 text-xs uppercase tracking-widest font-semibold text-[#FAF8F5] bg-[#0C2B22] hover:bg-[#143E32] rounded-sm flex items-center gap-1.5 shrink-0 transition-all"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C5A059]" /> : <Search className="w-3.5 h-3.5 text-[#C5A059]" />}
            <span>Track</span>
          </button>
        </form>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-sm text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Found Appointment Result Card */}
        {appointment && (
          <div className="p-5 rounded-sm bg-[#F5F2EB] border border-[#E0DACE] space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-2.5">
              <div>
                <span className="text-[#556059] block text-[10px] uppercase tracking-wider">Reference ID</span>
                <span className="font-editorial text-base font-bold text-[#0C2B22]">{appointment.reference}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-sm text-[10px] uppercase tracking-wider font-bold border border-[#0C2B22] text-[#0C2B22]">
                {appointment.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[#3E4943]">
              <div>
                <span className="text-[#556059] block text-[10px] uppercase tracking-wider">Patient</span>
                <span className="font-semibold text-[#0C2B22]">{appointment.patientName}</span>
              </div>
              <div>
                <span className="text-[#556059] block text-[10px] uppercase tracking-wider">Mobile</span>
                <span className="font-semibold text-[#0C2B22]">+91 {appointment.mobile}</span>
              </div>
              <div>
                <span className="text-[#556059] block text-[10px] uppercase tracking-wider">Date</span>
                <span className="font-semibold text-[#0C2B22]">{formatIndianDate(appointment.date)}</span>
              </div>
              <div>
                <span className="text-[#556059] block text-[10px] uppercase tracking-wider">Time Slot</span>
                <span className="font-semibold text-[#0C2B22]">{appointment.timeSlot}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#556059] block text-[10px] uppercase tracking-wider">Discipline</span>
                <span className="font-semibold text-[#0C2B22]">{appointment.primaryConcern} ({appointment.consultationType})</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E8E4DC] flex items-center justify-between">
              <a
                href={`tel:${CLINIC_CONTACT.phoneRaw}`}
                className="text-[#0C2B22] font-semibold hover:underline flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Call Clinic Helpline</span>
              </a>

              <a
                href={`https://wa.me/919911887793?text=${encodeURIComponent(
                  `Inquiry regarding appointment ${appointment.reference} for patient ${appointment.patientName}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#143E32] font-semibold hover:underline flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
