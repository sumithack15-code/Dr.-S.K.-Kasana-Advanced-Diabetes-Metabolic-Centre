import React from 'react';
import { Target, Heart, Shield, Sparkles, MapPin, Compass } from 'lucide-react';
import { IMAGES } from '../assets';
import { CLINIC_CONTACT } from '../data/clinicalContent';

export const AboutCentre: React.FC = () => {
  return (
    <section id="philosophy" className="py-20 sm:py-28 bg-[#FAF8F5] border-b border-[#E8E4DC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 border-b border-[#E8E4DC] pb-10">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#0C2B22]">
              Clinical Philosophy &middot; New Life Centre
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#0C2B22] tracking-tight leading-[1.12]">
              The Architecture of{' '}
              <span className="italic font-normal text-[#1B4D3E]">Metabolic Equilibrium.</span>
            </h2>
          </div>

          <div className="lg:col-span-4 text-xs text-[#556059] leading-relaxed font-light">
            Behind every elevated HbA1c or fluctuating fasting sugar lies an intricate systemic network of cellular resistance, lipid dynamics, and vascular strain. We practice medicine that restores systemic balance rather than applying superficial pharmaceutical patches.
          </div>
        </div>

        {/* Asymmetrical Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: The Manifesto (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 sm:p-10 bg-[#0C2B22] text-[#FAF8F5] rounded-sm relative overflow-hidden border border-[#143E32] shadow-[0_12px_32px_rgba(12,43,34,0.12)]">
              <span className="font-editorial italic text-5xl text-[#C5A059]/40 absolute top-4 right-6 pointer-events-none select-none">
                &ldquo;
              </span>

              <div className="text-[11px] uppercase tracking-widest text-[#C5A059] font-semibold mb-4">
                Physician's Manifesto
              </div>

              <blockquote className="font-editorial text-xl sm:text-2xl text-[#FAF8F5] font-light italic leading-snug space-y-4">
                <p>
                  &ldquo;Diabetes is not a passive sentence of escalating medications. It is a biological dialogue that responds profoundly to timely, respectful, and scientifically precise clinical intervention.&rdquo;
                </p>
              </blockquote>

              <div className="mt-8 pt-6 border-t border-[#1C483A] flex items-center justify-between">
                <div>
                  <div className="font-editorial text-base text-white">Dr. S.K. Kasana</div>
                  <div className="text-[11px] text-[#A6BAA9] font-light">Senior Diabetologist &middot; Founder</div>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/30 px-2 py-1">
                  Sarita Vihar
                </div>
              </div>
            </div>

            {/* Clinic Facility Preview Card */}
            <div className="border border-[#D5DDD3] bg-white p-5 rounded-sm shadow-sm space-y-3">
              <div className="overflow-hidden rounded-sm h-48 bg-[#EBF0EA]">
                <img
                  src={IMAGES.modernClinicInterior}
                  alt="Modern Consultation Environment at Dr. S.K. Kasana Diabetes Centre"
                  className="w-full h-full object-cover filter contrast-[1.02] hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="font-bold text-[#0C2B22]">Specialist Consultation Suite</div>
                <div className="text-[11px] text-[#556059] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0C2B22]" />
                  <span>Pocket J, Sarita Vihar</span>
                </div>
              </div>
              <p className="text-xs text-[#556059] font-light leading-relaxed">
                A calm, respectful, modern clinical space designed for uninterrupted diagnostic review and private patient consultations.
              </p>
            </div>
          </div>

          {/* Right Column: 4 Foundation Pillars (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-6 divide-y divide-[#E8E4DC]">
              
              {/* Pillar 01 */}
              <div className="pt-6 first:pt-0 group">
                <div className="flex items-start gap-5">
                  <span className="font-editorial text-2xl font-light text-[#C5A059] group-hover:text-[#0C2B22] transition-colors shrink-0">
                    I.
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="font-editorial text-xl sm:text-2xl text-[#0C2B22] font-semibold">
                      Biological Individuality &amp; Precision Dosing
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A5750] leading-relaxed font-light">
                      No two metabolic profiles follow identical curves. We tailor therapeutic regimens — whether oral agents, GLP-1 analogues, or basal-bolus insulin — based on individual glycemic excursions, renal safety thresholds, and body composition.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pillar 02 */}
              <div className="pt-6 group">
                <div className="flex items-start gap-5">
                  <span className="font-editorial text-2xl font-light text-[#C5A059] group-hover:text-[#0C2B22] transition-colors shrink-0">
                    II.
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="font-editorial text-xl sm:text-2xl text-[#0C2B22] font-semibold">
                      End-Organ Preservation &amp; Cardiovascular Shielding
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A5750] leading-relaxed font-light">
                      Glycemic control is a means to a greater end: preventing microvascular retinal disease, diabetic neuropathy, and kidney dysfunction, while simultaneously lowering long-term cardiovascular event risks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pillar 03 */}
              <div className="pt-6 group">
                <div className="flex items-start gap-5">
                  <span className="font-editorial text-2xl font-light text-[#C5A059] group-hover:text-[#0C2B22] transition-colors shrink-0">
                    III.
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="font-editorial text-xl sm:text-2xl text-[#0C2B22] font-semibold">
                      Metabolic Root-Cause Decoupling
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A5750] leading-relaxed font-light">
                      We address the triad of visceral adiposity, hepatic steatosis (fatty liver), and insulin resistance simultaneously — ensuring that blood glucose normalization is accompanied by genuine cellular rehabilitation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pillar 04 */}
              <div className="pt-6 group">
                <div className="flex items-start gap-5">
                  <span className="font-editorial text-2xl font-light text-[#C5A059] group-hover:text-[#0C2B22] transition-colors shrink-0">
                    IV.
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="font-editorial text-xl sm:text-2xl text-[#0C2B22] font-semibold">
                      Culturally Harmonized Nutritional Guidance
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A5750] leading-relaxed font-light">
                      Preserving family culinary dignity. We do not prescribe alien diets or extreme deprivation; instead, we formulate realistic plate-balancing strategies that respect Indian staples while eliminating sharp post-meal glycemic surges.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Compliance Guarantee */}
            <div className="p-4 bg-[#EBF0EA] border border-[#D5DDD3] rounded-sm text-xs text-[#3E4943] flex items-center justify-between">
              <span className="font-medium">
                Compliant with Indian RSSDI &amp; Global ADA Consensus Guidelines
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#0C2B22]">
                Evidence-Based
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
