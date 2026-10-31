import React from 'react';
import { Calendar, Phone, ArrowUpRight, ShieldCheck, Check, Info } from 'lucide-react';
import { CLINIC_CONTACT } from '../data/clinicalContent';
import { IMAGES } from '../assets';

interface DoctorProfileProps {
  onOpenBooking: () => void;
  doctorSpecialization?: string;
  doctorQualification?: string;
  doctorRegistration?: string;
}

export const DoctorProfile: React.FC<DoctorProfileProps> = ({
  onOpenBooking,
  doctorSpecialization = 'Specialist in Diabetes & Metabolic Disorders',
  doctorQualification = 'Senior Clinical Diabetologist & Metabolic Physician (Qualifications editable)',
  doctorRegistration = 'Registered Medical Practitioner (Reg. details editable upon verification)',
}) => {
  return (
    <section id="doctor" className="py-20 sm:py-28 bg-[#F5F2EB] border-b border-[#E8E4DC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Monograph Container */}
        <div className="bg-[#FAF8F5] border border-[#E0DACE] shadow-[0_16px_48px_rgba(12,43,34,0.06)] rounded-sm overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left: Architectural Doctor Image Frame (5 cols) */}
            <div className="lg:col-span-5 bg-[#0C2B22] p-8 sm:p-12 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-[#143E32]">
              <div className="space-y-2 mb-6">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block">
                  Clinical Stewardship
                </span>
                <span className="font-editorial text-2xl text-[#FAF8F5] font-light">
                  Dr. S.K. Kasana
                </span>
              </div>

              <div className="relative mx-auto w-full max-w-sm rounded-sm overflow-hidden border border-[#2B5446] shadow-xl bg-[#071C16]">
                <img
                  src={IMAGES.doctorPortrait}
                  alt="Dr. S.K. Kasana - Diabetologist & Metabolic Physician at New Life Centre"
                  className="w-full h-[400px] sm:h-[440px] object-cover object-top filter contrast-[1.02]"
                  loading="lazy"
                />
                <div className="bg-[#071C16] p-3 text-center border-t border-[#1C483A]">
                  <div className="text-[11px] uppercase tracking-wider text-[#D0DBD0] font-medium">
                    Dr. S.K. Kasana &middot; Senior Diabetologist
                  </div>
                  <div className="text-[10px] text-[#A6BAA9] font-light">
                    Consultation Chambers &middot; Pocket J, Sarita Vihar
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#1B4D3E] text-[11px] text-[#A6BAA9] leading-relaxed font-light">
                &ldquo;Every patient who enters our centre receives the dignity of time, careful listening, and meticulous laboratory assessment.&rdquo;
              </div>
            </div>

            {/* Right: Detailed Physician Monograph (7 cols) */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between space-y-8">
              
              <div className="space-y-6">
                
                <div className="border-b border-[#E8E4DC] pb-6 space-y-2">
                  <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#556059]">
                    Senior Consultant Diabetologist
                  </div>
                  <h3 className="font-editorial text-3xl sm:text-4xl text-[#0C2B22] font-semibold tracking-tight">
                    Dr. S.K. Kasana
                  </h3>
                  <div className="text-sm font-medium text-[#1B4D3E] pt-1">
                    {doctorSpecialization}
                  </div>
                  <div className="text-xs text-[#556059] font-light">
                    {doctorQualification}
                  </div>
                </div>

                {/* Clinical Areas of Practice */}
                <div className="space-y-3">
                  <div className="text-xs uppercase tracking-widest font-bold text-[#0C2B22]">
                    Primary Clinical Expertise
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#3E4943]">
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                      <span>Intensive Glycemic &amp; HbA1c Stabilization</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                      <span>Type 1 &amp; Type 2 Long-Term Protocol Management</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                      <span>Metabolic Syndrome, Fatty Liver &amp; Dyslipidemia</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                      <span>Diabetic Renal &amp; Peripheral Neuropathy Screening</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                      <span>Endocrine &amp; Thyroid Hormone Harmonization</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                      <span>Continuous Glucose Monitoring (CGM) Review</span>
                    </div>
                  </div>
                </div>

                {/* Transparency & Verified Registration Disclosure */}
                <div className="p-4 bg-[#EBF0EA] border border-[#D5DDD3] rounded-sm text-xs text-[#3E4943] space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#0C2B22]">
                    <Info className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>Practitioner Credentials &amp; Verification Notice</span>
                  </div>
                  <p className="text-[#556059] font-light leading-relaxed">
                    {doctorRegistration}. All treatment plans and pharmacological titration decisions are formulated exclusively on verified diagnostic history and recognized clinical endocrinology protocols.
                  </p>
                </div>

              </div>

              {/* Consultation CTA Bar */}
              <div className="pt-6 border-t border-[#E8E4DC] flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={onOpenBooking}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs uppercase tracking-widest font-semibold text-[#FAF8F5] bg-[#0C2B22] hover:bg-[#143E32] rounded-sm transition-all shadow-[0_2px_10px_rgba(12,43,34,0.15)] group"
                >
                  <Calendar className="w-4 h-4 text-[#C5A059]" />
                  <span>Schedule Consultation with Dr. Kasana</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A059] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>

                <a
                  href={`tel:${CLINIC_CONTACT.phoneRaw}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs uppercase tracking-widest font-semibold text-[#0C2B22] border border-[#CBD5C8] hover:bg-[#EBF0EA] rounded-sm transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#0C2B22]" />
                  <span>Call +91 9911887793</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
