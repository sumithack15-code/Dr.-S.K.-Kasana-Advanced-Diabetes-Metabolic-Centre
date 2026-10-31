import React, { useState } from 'react';
import { ArrowUpRight, ChevronRight, X, Calendar, Check, Compass } from 'lucide-react';
import { CLINICAL_SERVICES } from '../data/clinicalContent';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onSelectServiceForBooking: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForBooking,
}) => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'GLYCEMIC' | 'METABOLIC' | 'PREVENTIVE'>('ALL');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const filterServices = (services: ServiceItem[]) => {
    if (activeCategory === 'GLYCEMIC') {
      return services.filter((s) =>
        ['diabetes-consultation', 'type-1-diabetes', 'type-2-diabetes', 'blood-sugar-management', 'hba1c-monitoring'].includes(s.id)
      );
    }
    if (activeCategory === 'METABOLIC') {
      return services.filter((s) =>
        ['metabolic-health-assessment', 'weight-management', 'thyroid-metabolic-disorders'].includes(s.id)
      );
    }
    if (activeCategory === 'PREVENTIVE') {
      return services.filter((s) =>
        ['nutrition-counselling', 'preventive-care'].includes(s.id)
      );
    }
    return services;
  };

  const displayedServices = filterServices(CLINICAL_SERVICES);

  return (
    <section id="services" className="py-20 sm:py-28 bg-[#FAF8F5] border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14 border-b border-[#E8E4DC] pb-8">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#0C2B22]">
              Clinical Disciplines &middot; Sarita Vihar
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#0C2B22] tracking-tight leading-[1.12]">
              Specialist Endocrine &amp;{' '}
              <span className="italic font-normal text-[#1B4D3E]">Metabolic Programs.</span>
            </h2>
          </div>

          <div className="lg:col-span-4">
            {/* Category Switcher Tabs */}
            <div className="flex flex-wrap gap-1 p-1 bg-[#EBF0EA] border border-[#D5DDD3] rounded-sm">
              <button
                onClick={() => setActiveCategory('ALL')}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold rounded-sm transition-all ${
                  activeCategory === 'ALL'
                    ? 'bg-[#0C2B22] text-[#FAF8F5] shadow-sm'
                    : 'text-[#4A5750] hover:text-[#0C2B22]'
                }`}
              >
                All (10)
              </button>
              <button
                onClick={() => setActiveCategory('GLYCEMIC')}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold rounded-sm transition-all ${
                  activeCategory === 'GLYCEMIC'
                    ? 'bg-[#0C2B22] text-[#FAF8F5] shadow-sm'
                    : 'text-[#4A5750] hover:text-[#0C2B22]'
                }`}
              >
                Glycemic
              </button>
              <button
                onClick={() => setActiveCategory('METABOLIC')}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold rounded-sm transition-all ${
                  activeCategory === 'METABOLIC'
                    ? 'bg-[#0C2B22] text-[#FAF8F5] shadow-sm'
                    : 'text-[#4A5750] hover:text-[#0C2B22]'
                }`}
              >
                Metabolic
              </button>
              <button
                onClick={() => setActiveCategory('PREVENTIVE')}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold rounded-sm transition-all ${
                  activeCategory === 'PREVENTIVE'
                    ? 'bg-[#0C2B22] text-[#FAF8F5] shadow-sm'
                    : 'text-[#4A5750] hover:text-[#0C2B22]'
                }`}
              >
                Preventive
              </button>
            </div>
          </div>
        </div>

        {/* Editorial Disciplines Directory */}
        <div className="divide-y divide-[#E8E4DC] border-y border-[#E8E4DC]">
          {displayedServices.map((service, index) => {
            const indexString = (index + 1) < 10 ? `0${index + 1}` : `${index + 1}`;
            return (
              <div
                key={service.id}
                className="py-8 sm:py-10 group hover:bg-[#F5F2EB]/60 transition-colors px-2 sm:px-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Number & Title (5 cols) */}
                  <div className="lg:col-span-5 flex items-baseline gap-4 sm:gap-6">
                    <span className="font-editorial text-2xl sm:text-3xl font-light text-[#C5A059] group-hover:text-[#0C2B22] transition-colors shrink-0">
                      {indexString}
                    </span>
                    <div className="space-y-1">
                      <h3 className="font-editorial text-2xl sm:text-3xl text-[#0C2B22] font-semibold tracking-tight group-hover:text-[#143E32] transition-colors">
                        {service.title}
                      </h3>
                      <div className="text-[11px] text-[#556059] font-light">
                        {service.idealFor}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Clinical Rationale & Focus Areas (5 cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    <p className="text-xs sm:text-sm text-[#404D46] leading-relaxed font-light">
                      {service.shortDesc}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-[#556059]">
                      {service.focusAreas.map((area, i) => (
                        <span key={i} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-[#C5A059]" />
                          <span>{area}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Actions (2 cols) */}
                  <div className="lg:col-span-2 flex items-center lg:justify-end gap-3 pt-2 lg:pt-0">
                    <button
                      onClick={() => setSelectedService(service)}
                      className="text-xs font-semibold text-[#0C2B22] hover:text-[#C5A059] transition-colors flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onSelectServiceForBooking(service.title)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider font-semibold text-[#FAF8F5] bg-[#0C2B22] hover:bg-[#143E32] rounded-sm transition-all"
                    >
                      <Calendar className="w-3 h-3 text-[#C5A059]" />
                      <span>Book</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Service Monograph Modal */}
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071C16]/75 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#FAF8F5] border border-[#D5DDD3] rounded-sm max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-start justify-between gap-4 border-b border-[#E8E4DC] pb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
                    Clinical Discipline Overview
                  </div>
                  <h3 className="font-editorial text-2xl text-[#0C2B22] font-semibold mt-1">
                    {selectedService.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-1 text-[#556059] hover:text-[#0C2B22]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-[#404D46] leading-relaxed font-light">
                {selectedService.fullDesc}
              </p>

              <div className="p-4 bg-[#EBF0EA] border border-[#D5DDD3] rounded-sm space-y-2">
                <div className="text-xs font-bold text-[#0C2B22] uppercase tracking-wider">
                  Targeted Diagnostic &amp; Care Modalities:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#3E4943]">
                  {selectedService.focusAreas.map((area, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-[#556059]">
                <strong className="text-[#0C2B22]">Ideal Candidate: </strong>
                {selectedService.idealFor}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E4DC]">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#556059] hover:text-[#0C2B22]"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const title = selectedService.title;
                    setSelectedService(null);
                    onSelectServiceForBooking(title);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest font-semibold text-[#FAF8F5] bg-[#0C2B22] hover:bg-[#143E32] rounded-sm"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Reserve Slot for this Service</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
