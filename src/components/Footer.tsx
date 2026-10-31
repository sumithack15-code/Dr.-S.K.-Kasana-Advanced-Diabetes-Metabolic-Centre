import React, { useState } from 'react';
import {
  Calendar,
  Phone,
  MapPin,
  Clock,
  ShieldAlert,
  FileText,
  Lock,
  ChevronRight,
  ArrowUpRight,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { CLINIC_CONTACT, CLINICAL_SERVICES } from '../data/clinicalContent';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenLookup,
  onOpenAdmin,
}) => {
  const [activeLegalModal, setActiveLegalModal] = useState<
    'privacy' | 'terms' | 'disclaimer' | 'launch_guide' | null
  >(null);

  return (
    <>
      <footer className="bg-[#071C16] text-[#E2E8DF] pt-20 pb-12 border-t border-[#143E32]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#143E32]">
            
            {/* Col 1: Clinic Identity & Heritage (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-sm bg-[#0C2B22] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] font-editorial italic text-xl">
                  K
                </div>
                <div>
                  <div className="font-editorial text-2xl font-bold text-white tracking-tight">
                    Dr. S.K. Kasana
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
                    Advanced Diabetes &amp; Metabolic Centre @ New Life
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#B8C7B8] leading-relaxed font-light max-w-md">
                Specialized medical centre dedicated to comprehensive diabetes, blood sugar, HbA1c, thyroid, and metabolic health management in Sarita Vihar, South Delhi.
              </p>

              <div className="pt-2 text-xs text-[#A6BAA9] space-y-2 font-light">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>J Pocket, J 350, Pocket J, Sarita Vihar, New Delhi, Delhi 110076</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <a href={`tel:${CLINIC_CONTACT.phoneRaw}`} className="hover:text-white font-medium">
                    Direct Line: {CLINIC_CONTACT.phoneDisplay}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>Mon – Sat: 9:30 AM – 1:00 PM &middot; 4:30 PM – 7:30 PM</span>
                </div>
              </div>
            </div>

            {/* Col 2: Navigation Links (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                Navigation
              </div>
              <ul className="space-y-2 text-xs text-[#B8C7B8]">
                <li>
                  <a href="#home" className="hover:text-white transition-colors">Practice Overview</a>
                </li>
                <li>
                  <a href="#doctor" className="hover:text-white transition-colors">Dr. S.K. Kasana</a>
                </li>
                <li>
                  <a href="#philosophy" className="hover:text-white transition-colors">Care Philosophy</a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition-colors">Disciplines (10)</a>
                </li>
                <li>
                  <a href="#education" className="hover:text-white transition-colors">Metabolic Journal</a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">Location &amp; Chambers</a>
                </li>
                <li>
                  <button onClick={onOpenLookup} className="text-[#C5A059] hover:underline">
                    Track Existing Booking
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Key Medical Disciplines (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                Disciplines
              </div>
              <ul className="space-y-2 text-xs text-[#B8C7B8]">
                {CLINICAL_SERVICES.slice(0, 5).map((service) => (
                  <li key={service.id}>
                    <a href="#services" className="hover:text-white transition-colors">
                      {service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Appointment Concierge & Governance (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                Appointment Concierge
              </div>
              <p className="text-xs text-[#B8C7B8] font-light">
                Direct date and slot reservation with instant reference allocation.
              </p>

              <button
                onClick={onOpenBooking}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#0C2B22] hover:bg-[#143E32] text-white border border-[#C5A059]/40 rounded-sm text-xs uppercase tracking-widest font-semibold transition-all group shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Book Consultation</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A059] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <div className="pt-2 border-t border-[#143E32] flex flex-col gap-2 text-xs">
                <button
                  onClick={() => setActiveLegalModal('launch_guide')}
                  className="text-[#8A9E8E] hover:text-[#C5A059] text-left flex items-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Deployment &amp; Handover Guide</span>
                </button>

                <button
                  onClick={onOpenAdmin}
                  className="text-[#8A9E8E] hover:text-[#C5A059] text-left flex items-center gap-1.5 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Physician &amp; Staff Admin Portal</span>
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Legal & Copyright Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A9E8E]">
            <div className="font-light">
              &copy; {new Date().getFullYear()} Dr. S.K. Kasana Advanced Diabetes &amp; Metabolic Centre @ New Life. All rights reserved.
            </div>

            <div className="flex items-center gap-5 flex-wrap text-[11px] font-medium">
              <button
                onClick={() => setActiveLegalModal('privacy')}
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <span className="text-[#143E32]">&middot;</span>
              <button
                onClick={() => setActiveLegalModal('terms')}
                className="hover:text-white transition-colors"
              >
                Terms &amp; Conditions
              </button>
              <span className="text-[#143E32]">&middot;</span>
              <button
                onClick={() => setActiveLegalModal('disclaimer')}
                className="hover:text-white transition-colors"
              >
                Medical Disclaimer
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* LEGAL MODALS */}

      {/* 1. Privacy Policy Modal */}
      {activeLegalModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071C16]/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF8F5] text-[#1A201C] rounded-sm max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#D5DDD3] space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="font-editorial text-2xl font-bold text-[#0C2B22] border-b border-[#E8E4DC] pb-3">
              Privacy Policy &amp; Health Data Protection
            </h3>
            <div className="text-xs text-[#4A5750] space-y-3 leading-relaxed font-light">
              <p>
                Dr. S.K. Kasana Advanced Diabetes &amp; Metabolic Centre @ New Life strictly upholds medical confidentiality and aligns with Indian digital health privacy requirements (DPDP Act, 2023).
              </p>
              <h4 className="font-bold text-[#0C2B22] uppercase tracking-wider text-[11px]">1. Data Minimalization</h4>
              <p>
                We capture only the data necessary to coordinate patient consultations: full name, mobile telephone number, optional email, age, consultation format, and patient-reported health concerns.
              </p>
              <h4 className="font-bold text-[#0C2B22] uppercase tracking-wider text-[11px]">2. Communication Integrity</h4>
              <p>
                Patient phone numbers are strictly used for appointment reminders, reference verification, and follow-up communication. We never sell, lease, or monetize patient data.
              </p>
            </div>
            <div className="pt-3 border-t border-[#E8E4DC] flex justify-end">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-5 py-2 bg-[#0C2B22] text-white rounded-sm text-xs uppercase tracking-wider font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Terms and Conditions Modal */}
      {activeLegalModal === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071C16]/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF8F5] text-[#1A201C] rounded-sm max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#D5DDD3] space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="font-editorial text-2xl font-bold text-[#0C2B22] border-b border-[#E8E4DC] pb-3">
              Terms &amp; Conditions of Consultation
            </h3>
            <div className="text-xs text-[#4A5750] space-y-3 leading-relaxed font-light">
              <h4 className="font-bold text-[#0C2B22] uppercase tracking-wider text-[11px]">1. Consultation Scheduling</h4>
              <p>
                Online scheduling locks a specific consultation window with Dr. S.K. Kasana. Please arrive 10 minutes prior with previous laboratory records and prescription logs.
              </p>
              <h4 className="font-bold text-[#0C2B22] uppercase tracking-wider text-[11px]">2. Cancellation Protocols</h4>
              <p>
                If unable to attend, please notify our reception team at least 2 hours in advance via helpline (+91 9911887793) or the website tracking portal.
              </p>
            </div>
            <div className="pt-3 border-t border-[#E8E4DC] flex justify-end">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-5 py-2 bg-[#0C2B22] text-white rounded-sm text-xs uppercase tracking-wider font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Medical Disclaimer Modal */}
      {activeLegalModal === 'disclaimer' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071C16]/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF8F5] text-[#1A201C] rounded-sm max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#D5DDD3] space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="font-editorial text-2xl font-bold text-[#0C2B22] border-b border-[#E8E4DC] pb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#C5A059]" />
              <span>Medical &amp; Clinical Disclaimer</span>
            </h3>
            <div className="text-xs text-[#4A5750] space-y-3 leading-relaxed font-light">
              <p>
                The informational articles, guidelines, and diagnostic educational summaries published on this website are structured for general health literacy and do not substitute for individual medical advice or prescriptions.
              </p>
              <p>
                Always consult Dr. S.K. Kasana or an authorized healthcare provider regarding dosage titrations, insulin adjustments, or symptom changes.
              </p>
              <p className="font-semibold text-rose-800">
                In acute emergency situations (such as severe hypoglycemia with altered consciousness, ketoacidosis, or cardiac symptoms), immediately seek emergency department care.
              </p>
            </div>
            <div className="pt-3 border-t border-[#E8E4DC] flex justify-end">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-5 py-2 bg-[#0C2B22] text-white rounded-sm text-xs uppercase tracking-wider font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Complete Deployment & Clinic Owner Handover Guide */}
      {activeLegalModal === 'launch_guide' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071C16]/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0C2B22] text-[#FAF8F5] rounded-sm max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#143E32] space-y-5 max-h-[88vh] overflow-y-auto text-xs">
            
            <div className="flex items-start justify-between border-b border-[#1C483A] pb-3">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#C5A059]" />
                  <span>Clinic Launch &amp; Custom Domain Guide</span>
                </h3>
                <p className="text-[#8A9E8E] text-xs font-light mt-0.5">
                  Complete technical instructions for domain mapping, database migration, and handover checklist.
                </p>
              </div>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="text-[#8A9E8E] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 font-light">
              
              <div className="p-4 bg-[#071C16] rounded-sm border border-[#1C483A] space-y-2">
                <div className="font-bold text-sm text-[#C5A059] uppercase tracking-wider">
                  A. Pre-Launch Verification Checklist
                </div>
                <ul className="space-y-1.5 text-[#D0DBD0]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>Confirm doctor degrees &amp; state medical council registration in Admin &gt; Settings.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>Verify morning (09:30 AM – 01:00 PM) and evening (04:30 PM – 07:30 PM) timings.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>Change the admin password in the Admin dashboard (demo: Kasana@Care2026!).</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-[#071C16] rounded-sm border border-[#1C483A] space-y-2">
                <div className="font-bold text-sm text-[#C5A059] uppercase tracking-wider">
                  B. Architecture &amp; Database
                </div>
                <p className="text-[#A6BAA9]">
                  Powered by an Express full-stack API with persistent local data storage in <code>/data/clinic-data.json</code> and full schema compatibility with Firebase Firestore and Supabase.
                </p>
              </div>

              <div className="p-4 bg-[#071C16] rounded-sm border border-[#1C483A] space-y-2">
                <div className="font-bold text-sm text-[#C5A059] uppercase tracking-wider">
                  C. Custom Domain Connection
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-[#D0DBD0]">
                  <li>Deploy repository to Vercel, Cloud Run, or VPS.</li>
                  <li>In your hosting dashboard, add your domain (e.g. <code>www.drskkasanadiabetes.com</code>).</li>
                  <li>Configure DNS A / CNAME records at your registrar (GoDaddy, Namecheap, Cloudflare).</li>
                  <li>Automated SSL certificates provision in minutes.</li>
                </ol>
              </div>

            </div>

            <div className="pt-3 border-t border-[#1C483A] flex justify-end">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-5 py-2 bg-[#143E32] hover:bg-[#1B4D3E] text-white rounded-sm text-xs font-semibold uppercase tracking-wider"
              >
                Close Guide
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
};
