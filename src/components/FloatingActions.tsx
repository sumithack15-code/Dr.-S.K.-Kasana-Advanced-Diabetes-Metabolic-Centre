import React from 'react';
import { MessageSquare, Calendar, Phone } from 'lucide-react';
import { CLINIC_CONTACT } from '../data/clinicalContent';

interface FloatingActionsProps {
  onOpenBooking: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ onOpenBooking }) => {
  const whatsappUrl = `https://wa.me/919911887793?text=${encodeURIComponent(
    'Hello Dr. S.K. Kasana Diabetes Centre, I would like to inquire about consultation and appointment availability.'
  )}`;

  return (
    <>
      {/* Floating WhatsApp Concierge Button */}
      <aside aria-label="Quick contact links" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 no-print">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Connect with Dr. S.K. Kasana Centre on WhatsApp"
          className="group flex items-center gap-2.5 bg-[#0C2B22] hover:bg-[#143E32] text-[#FAF8F5] px-4 py-3 rounded-full shadow-[0_4px_16px_rgba(12,43,34,0.3)] border border-[#C5A059]/40 hover:scale-105 transition-all duration-300"
        >
          <MessageSquare className="w-4 h-4 text-[#C5A059] shrink-0" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-semibold tracking-wider uppercase">
            WhatsApp Concierge
          </span>
        </a>
      </aside>

      {/* Mobile Sticky Action Bar */}
      <nav aria-label="Mobile quick actions" className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E8E4DC] px-4 py-2.5 flex items-center justify-between gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] no-print">
        <a
          href={`tel:${CLINIC_CONTACT.phoneRaw}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#EBF0EA] hover:bg-[#DFE7DD] text-[#0C2B22] rounded-sm text-xs font-bold transition-colors border border-[#D5DDD3]"
        >
          <Phone className="w-3.5 h-3.5 text-[#0C2B22]" />
          <span>Call Clinic</span>
        </a>

        <button
          onClick={onOpenBooking}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#0C2B22] hover:bg-[#143E32] text-white rounded-sm text-xs uppercase tracking-wider font-bold transition-colors shadow-sm"
        >
          <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Book Slot</span>
        </button>
      </nav>
    </>
  );
};
