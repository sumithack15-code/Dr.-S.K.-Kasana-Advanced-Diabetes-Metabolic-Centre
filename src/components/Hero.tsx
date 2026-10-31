import React from 'react';
import { Calendar, Phone, ArrowUpRight, Star, ShieldCheck, Check } from 'lucide-react';
import { CLINIC_CONTACT } from '../data/clinicalContent';
import { IMAGES } from '../assets';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section id="home" className="relative overflow-hidden bg-[#FAF8F5] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#E8E4DC]">
      {/* Subtle Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[linear-gradient(to_right,#0C2B22_1px,transparent_1px),linear-gradient(to_bottom,#0C2B22_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Top Architectural Kicker Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E8E4DC] pb-4 mb-10 sm:mb-12 text-xs">
          <div className="flex items-center gap-2 tracking-widest text-[#556059] uppercase font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#0C2B22]" />
            <span>Sarita Vihar, South Delhi &middot; Specialist Clinical Practice</span>
          </div>

          {/* Tastefully Integrated 4.9 Rating (Editorial Format) */}
          <div className="flex items-center gap-2.5 text-[#2C3531]">
            <div className="flex items-center gap-1 text-[#C5A059]">
              <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
              <span className="font-bold text-[#0C2B22]">4.9 / 5.0</span>
            </div>
            <span className="text-[#D0C9BD]" aria-hidden="true">&middot;</span>
            <span className="text-[#556059] font-medium">200+ Documented Patient Reviews</span>
            <span className="text-[#D0C9BD] hidden md:inline" aria-hidden="true">&middot;</span>
            <span className="hidden md:inline text-[11px] text-[#0C2B22] font-semibold tracking-wide uppercase">
              Google Business Profile
            </span>
          </div>
        </div>

        {/* Main Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Manifesto & Call to Action (7 cols) */}
          <div className="lg:col-span-7 space-y-7">
            
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#0C2B22]">
                Endocrinology &middot; Metabolic Medicine &middot; Glycemic Stability
              </p>

              <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#0C2B22] font-normal tracking-tight leading-[1.08]">
                A measured, scientific path to{' '}
                <span className="italic font-normal text-[#1B4D3E] underline decoration-[#C5A059]/60 decoration-1 underline-offset-8">
                  enduring metabolic vitality.
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#404D46] leading-relaxed max-w-2xl font-light">
              Under the clinical leadership of <strong>Dr. S.K. Kasana</strong> at New Life Centre, we provide meticulous glycemic regulation, deep metabolic profiling, and personalized therapeutic regimens designed to prevent long-term cardiovascular and renal complications.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-3 px-7 py-4 text-xs uppercase tracking-widest font-semibold text-[#FAF8F5] bg-[#0C2B22] hover:bg-[#143E32] active:bg-[#071C16] rounded-sm transition-all shadow-[0_4px_16px_rgba(12,43,34,0.18)] group"
              >
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <span>Book an Appointment</span>
                <ArrowUpRight className="w-4 h-4 text-[#C5A059] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <a
                href={`tel:${CLINIC_CONTACT.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 text-xs uppercase tracking-widest font-semibold text-[#0C2B22] bg-transparent hover:bg-[#EBF0EA] border border-[#CBD5C8] rounded-sm transition-colors"
              >
                <Phone className="w-4 h-4 text-[#0C2B22]" />
                <span>Call Concierge: +91 9911887793</span>
              </a>
            </div>

            {/* Clinical Principles Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E8E4DC] text-xs">
              <div className="space-y-1">
                <span className="font-editorial italic text-base text-[#C5A059] font-medium block">01</span>
                <span className="font-bold text-[#0C2B22] block">Unhurried Consultations</span>
                <span className="text-[#556059] text-[11px] leading-tight block">
                  30-minute dedicated sessions with thorough glycemic log analysis.
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-editorial italic text-base text-[#C5A059] font-medium block">02</span>
                <span className="font-bold text-[#0C2B22] block">Metabolic-First Focus</span>
                <span className="text-[#556059] text-[11px] leading-tight block">
                  Treating visceral adiposity, fatty liver, lipid subfractions &amp; HbA1c.
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-editorial italic text-base text-[#C5A059] font-medium block">03</span>
                <span className="font-bold text-[#0C2B22] block">Sustainable Therapeutics</span>
                <span className="text-[#556059] text-[11px] leading-tight block">
                  Culturally harmonized Indian nutritional and lifestyle strategies.
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Creative Asymmetrical Doctor Portrait Showcase (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              
              {/* Offset Background Accent Panel */}
              <div className="absolute -top-3 -right-3 -bottom-3 -left-3 rounded-sm border border-[#D5DDD3] bg-[#EBF0EA]/60 -z-10" />

              {/* Main Image Frame with Metallic Inset Border */}
              <div className="relative rounded-sm overflow-hidden bg-[#0C2B22] border-2 border-[#C5A059]/40 shadow-[0_12px_36px_rgba(12,43,34,0.14)]">
                <img
                  src={IMAGES.doctorPortrait}
                  alt="Dr. S.K. Kasana - Clinical Diabetologist & Metabolic Physician at New Life Centre"
                  className="w-full h-[400px] sm:h-[460px] object-cover object-top filter contrast-[1.03]"
                  loading="eager"
                />

                {/* Overlaid Editorial Plaque */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071C16] via-[#0C2B22]/90 to-transparent pt-12 pb-5 px-6 text-white">
                  <div className="flex items-baseline justify-between border-b border-[#2C483E] pb-2 mb-2">
                    <span className="font-editorial text-xl text-[#FAF8F5] tracking-tight">
                      Dr. S.K. Kasana
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold">
                      Senior Physician
                    </span>
                  </div>
                  <p className="text-xs text-[#D0DBD0] font-light leading-relaxed">
                    Advanced Diabetes &amp; Metabolic Centre @ New Life &middot; Pocket J, Sarita Vihar
                  </p>
                </div>
              </div>

              {/* Floating Architectural Badge */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-[#FAF8F5] p-3.5 border border-[#D5DDD3] shadow-[0_8px_20px_rgba(12,43,34,0.08)] max-w-[210px] hidden sm:block">
                <div className="flex items-center gap-2 mb-1 text-[11px] font-bold text-[#0C2B22]">
                  <ShieldCheck className="w-4 h-4 text-[#0C2B22] shrink-0" />
                  <span>Evidence-Based Practice</span>
                </div>
                <p className="text-[10px] text-[#556059] leading-tight">
                  Adhering to strict RSSDI &amp; ADA clinical endocrinology benchmarks.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
