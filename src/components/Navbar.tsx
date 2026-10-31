import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Menu, X, Clock, MapPin, Search, Shield, ArrowUpRight } from 'lucide-react';
import { CLINIC_CONTACT } from '../data/clinicalContent';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenLookup,
  onOpenAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#home' },
    { label: 'Dr. Kasana', href: '#doctor' },
    { label: 'Philosophy', href: '#philosophy' },
    { label: 'Disciplines', href: '#services' },
    { label: 'Resources', href: '#education' },
    { label: 'Location', href: '#contact' },
  ];

  return (
    <>
      {/* Top Quiet Utility Bar */}
      <div className="bg-[#0C2B22] text-[#E2E8DF] text-[11px] py-2 px-4 sm:px-8 border-b border-[#143E32] tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-5 flex-wrap">
            <span className="flex items-center gap-1.5 text-[#D0DBD0]">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span>J 350, Pocket J, Sarita Vihar, New Delhi</span>
            </span>
            <span className="hidden lg:inline text-[#1B4D3E]" aria-hidden="true">/</span>
            <span className="hidden md:flex items-center gap-1.5 text-[#B8C7B8]">
              <Clock className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span>Consultations: Mon – Sat (9:30 AM – 1:00 PM &middot; 4:30 PM – 7:30 PM)</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href={`tel:${CLINIC_CONTACT.phoneRaw}`}
              className="flex items-center gap-1 text-[#EBF0EA] hover:text-[#C5A059] transition-colors font-medium"
            >
              <Phone className="w-3 h-3 text-[#C5A059]" />
              <span>Direct: {CLINIC_CONTACT.phoneDisplay}</span>
            </a>
            <span className="text-[#1B4D3E] hidden sm:inline" aria-hidden="true">/</span>
            <button
              onClick={onOpenLookup}
              className="text-[#D0DBD0] hover:text-white flex items-center gap-1 transition-colors"
              title="Track existing appointment"
            >
              <Search className="w-3 h-3 text-[#C5A059]" />
              <span className="hidden sm:inline">Check Appointment Status</span>
              <span className="sm:hidden">Status</span>
            </button>
            <span className="text-[#1B4D3E] hidden sm:inline" aria-hidden="true">/</span>
            <button
              onClick={onOpenAdmin}
              className="text-[#98A898] hover:text-[#E2E8DF] text-[10px] uppercase tracking-wider flex items-center gap-1 transition-colors"
              title="Staff Portal"
            >
              <Shield className="w-3 h-3 text-[#C5A059]" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Architectural Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(12,43,34,0.06)] border-b border-[#E8E4DC] py-3.5'
            : 'bg-[#FAF8F5] border-b border-[#ECE7DE] py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          
          {/* Bespoke Editorial Brandmark */}
          <a
            href="#home"
            className="flex items-center gap-3.5 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0C2B22]"
          >
            <div className="w-10 h-10 rounded-sm bg-[#0C2B22] text-[#F5F2EB] flex flex-col items-center justify-center border border-[#143E32] transition-transform duration-300 group-hover:scale-105">
              <span className="font-editorial italic text-lg leading-none tracking-tight text-[#C5A059]">K</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-lg sm:text-xl font-semibold text-[#0C2B22] tracking-tight leading-tight">
                  Dr. S.K. Kasana
                </span>
                <span className="hidden sm:inline text-[10px] font-medium tracking-widest text-[#556059] uppercase">
                  &middot; New Life
                </span>
              </div>
              <span className="text-[11px] text-[#556059] tracking-wider uppercase font-medium mt-0.5">
                Advanced Diabetes &amp; Metabolic Centre
              </span>
            </div>
          </a>

          {/* Desktop Editorial Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-widest font-semibold text-[#3E4943] hover:text-[#0C2B22] relative py-1 transition-colors group focus:outline-none"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#C5A059] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${CLINIC_CONTACT.phoneRaw}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0C2B22] hover:bg-[#EBF0EA] border border-[#D5DDD3] rounded-sm transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#0C2B22]" />
              <span>Call Clinic</span>
            </a>

            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-semibold text-[#FAF8F5] bg-[#0C2B22] hover:bg-[#143E32] active:bg-[#071C16] rounded-sm transition-all shadow-[0_2px_8px_rgba(12,43,34,0.15)] group"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Book Consultation</span>
              <ArrowUpRight className="w-3 h-3 text-[#C5A059] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={onOpenBooking}
              className="px-3 py-1.5 text-xs font-semibold text-[#FAF8F5] bg-[#0C2B22] rounded-sm"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 text-[#0C2B22] hover:bg-[#EBF0EA] rounded-sm border border-[#D5DDD3]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8E4DC] bg-[#FAF8F5] px-5 pt-4 pb-6 mt-3 space-y-4 shadow-xl">
            <nav className="flex flex-col space-y-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs uppercase tracking-wider font-semibold text-[#1A201C] hover:bg-[#EBF0EA] rounded-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-[#E8E4DC] space-y-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs uppercase tracking-wider font-semibold text-[#FAF8F5] bg-[#0C2B22] hover:bg-[#143E32] rounded-sm shadow-sm"
              >
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <span>Reserve Consultation Slot</span>
              </button>

              <a
                href={`tel:${CLINIC_CONTACT.phoneRaw}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#0C2B22] bg-[#EBF0EA] hover:bg-[#DFE7DD] rounded-sm border border-[#D5DDD3]"
              >
                <Phone className="w-3.5 h-3.5 text-[#0C2B22]" />
                <span>Call Helpline: +91 9911887793</span>
              </a>

              <div className="flex items-center justify-between text-xs text-[#556059] pt-2 px-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLookup();
                  }}
                  className="text-[#0C2B22] font-semibold underline underline-offset-4"
                >
                  Check Appointment Status
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="text-[#556059] hover:text-[#0C2B22]"
                >
                  Staff Portal
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
