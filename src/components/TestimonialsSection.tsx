import React from 'react';
import { Star, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { VERIFIED_REVIEWS_HIGHLIGHTS, CLINIC_CONTACT } from '../data/clinicalContent';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#FAF8F5] border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 border-b border-[#E8E4DC] pb-10">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#0C2B22]">
              Documented Patient Reflections &middot; Google Reviews
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#0C2B22] tracking-tight leading-[1.12]">
              Clinical Outcomes &amp;{' '}
              <span className="italic font-normal text-[#1B4D3E]">Patient Partnerships.</span>
            </h2>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <a
              href={CLINIC_CONTACT.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest font-semibold text-[#0C2B22] border border-[#CBD5C8] hover:bg-[#EBF0EA] rounded-sm transition-colors group"
            >
              <span>Verified Google Profile</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A059] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* Rating Architectural Plaque */}
        <div className="mb-14 p-8 sm:p-10 bg-[#0C2B22] text-[#FAF8F5] rounded-sm border border-[#143E32] shadow-[0_12px_32px_rgba(12,43,34,0.08)] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-baseline gap-6">
            <div className="font-editorial text-5xl sm:text-6xl text-[#FAF8F5] font-light">
              4.9
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[#C5A059]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                ))}
              </div>
              <div className="text-xs uppercase tracking-wider text-[#A6BAA9] font-medium">
                Overall Clinical Rating &middot; 200+ Documented Patient Reviews
              </div>
            </div>
          </div>

          <div className="text-xs text-[#D0DBD0] font-light md:text-right max-w-sm leading-relaxed border-t md:border-t-0 md:border-l border-[#1C483A] pt-4 md:pt-0 md:pl-8">
            Verified patient feedback submitted to Google Business for Dr. S.K. Kasana Advanced Diabetes &amp; Metabolic Centre @ New Life, Sarita Vihar.
          </div>
        </div>

        {/* Asymmetrical Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {VERIFIED_REVIEWS_HIGHLIGHTS.highlights.map((review, idx) => (
            <div
              key={idx}
              className="p-8 sm:p-10 bg-white border border-[#E0DACE] rounded-sm shadow-sm hover:border-[#0C2B22]/30 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
                  <div className="flex items-center gap-1 text-[#C5A059]">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#0C2B22]">
                    {review.aspect}
                  </span>
                </div>

                <blockquote className="font-editorial text-base sm:text-lg text-[#2C3531] font-light italic leading-relaxed">
                  &ldquo;{review.comment}&rdquo;
                </blockquote>
              </div>

              <div className="pt-4 border-t border-[#E8E4DC] flex items-center justify-between text-xs">
                <div>
                  <div className="font-editorial font-bold text-[#0C2B22] text-sm">
                    {review.author}
                  </div>
                  <div className="text-[#556059] text-[11px] font-light">
                    {review.location}
                  </div>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[#556059] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0C2B22]" />
                  <span>Verified Review</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
