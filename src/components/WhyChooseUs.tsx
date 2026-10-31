import React from 'react';
import { UserCheck, Sliders, HeartPulse, CalendarCheck, MapPin, MessagesSquare, ArrowRight } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const standards = [
    {
      num: '01',
      title: 'Patient-Centred Attentive Review',
      description: 'We do not run factory-style rush appointments. Consultations provide ample time to examine home glucometer logs, lifestyle stressors, and individual dietary challenges.',
    },
    {
      num: '02',
      title: 'Individualized Physiological Titration',
      description: 'Prescriptions and lifestyle modifications are tailored strictly to your renal parameters, insulin sensitivity, and glycemic variability rather than generalized formulas.',
    },
    {
      num: '03',
      title: 'Deep Metabolic Health Focus',
      description: 'Systemic evaluation encompassing visceral fat, liver steatosis, cardiovascular lipid subfractions, and microvascular safety markers alongside glucose.',
    },
    {
      num: '04',
      title: 'Zero-Queue Structured Booking',
      description: 'Our proprietary digital booking schedule reserves exact dedicated consultation slots, eliminating overcrowded clinic waiting halls.',
    },
    {
      num: '05',
      title: 'Pocket J, Sarita Vihar Sanctuary',
      description: 'Peaceful, accessible clinical rooms in Pocket J, Sarita Vihar, with convenient roadside access, ample parking, and close proximity to Mathura Road and Jasola.',
    },
    {
      num: '06',
      title: 'Quarterly Longitudinal Partnership',
      description: 'Endocrinology care is a journey. We track your 90-day HbA1c milestones and provide continuous support through emergency hypoglycemia advice and titration reviews.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#F5F2EB] border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#0C2B22]">
            Clinical Standards &middot; Why Consult Dr. Kasana
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#0C2B22] tracking-tight leading-[1.12]">
            Six Benchmarks of Our{' '}
            <span className="italic font-normal text-[#1B4D3E]">Clinical Care.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#556059] leading-relaxed font-light">
            Founded on transparency, scientific rigor, and deep respect for the patient’s time and long-term health trajectory.
          </p>
        </div>

        {/* 3x2 Editorial Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E0DACE] border border-[#E0DACE]">
          {standards.map((standard) => (
            <div
              key={standard.num}
              className="p-8 sm:p-10 bg-[#FAF8F5] hover:bg-white transition-colors space-y-4 group"
            >
              <div className="flex items-baseline justify-between border-b border-[#E8E4DC] pb-3">
                <span className="font-editorial text-2xl font-light text-[#C5A059] group-hover:text-[#0C2B22] transition-colors">
                  {standard.num}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#556059] font-medium">
                  Protocol
                </span>
              </div>

              <h3 className="font-editorial text-xl text-[#0C2B22] font-semibold tracking-tight group-hover:text-[#143E32] transition-colors">
                {standard.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#4A5750] leading-relaxed font-light">
                {standard.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
