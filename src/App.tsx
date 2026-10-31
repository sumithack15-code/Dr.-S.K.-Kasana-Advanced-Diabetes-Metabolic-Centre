import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutCentre } from './components/AboutCentre';
import { DoctorProfile } from './components/DoctorProfile';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { BookingSystem } from './components/BookingSystem';
import { PatientLookupModal } from './components/PatientLookupModal';
import { AdminDashboard } from './components/AdminDashboard';
import { TestimonialsSection } from './components/TestimonialsSection';
import { EducationSection } from './components/EducationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { ClinicSettings } from './types';

export default function App() {
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string>('');
  const [clinicSettings, setClinicSettings] = useState<Partial<ClinicSettings>>({});

  useEffect(() => {
    // Load clinic public info
    fetch('/api/clinic-info')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setClinicSettings(data.data);
        }
      })
      .catch((err) => console.log('Loaded default clinic configuration.'));
  }, []);

  const scrollToBooking = (serviceTitle?: string) => {
    if (serviceTitle) {
      setPreselectedService(serviceTitle);
    }
    const bookingElement = document.getElementById('booking');
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A201C] font-sans selection:bg-[#EBF0EA] selection:text-[#0C2B22] pb-16 sm:pb-0">
      
      {/* 1. Header & Navigation */}
      <Navbar
        onOpenBooking={() => scrollToBooking()}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero onOpenBooking={() => scrollToBooking()} />

        {/* 3. About the Centre */}
        <AboutCentre />

        {/* 4. Doctor Profile */}
        <DoctorProfile
          onOpenBooking={() => scrollToBooking()}
          doctorSpecialization={clinicSettings.doctorSpecializationPlaceholder}
          doctorQualification={clinicSettings.doctorQualificationPlaceholder}
          doctorRegistration={clinicSettings.doctorRegistrationPlaceholder}
        />

        {/* 5. Medical Services */}
        <ServicesSection
          onSelectServiceForBooking={(serviceTitle) => scrollToBooking(serviceTitle)}
        />

        {/* 6. Why Choose Us */}
        <WhyChooseUs />

        {/* 7. Appointment Booking System (Core Interactive 4-step System) */}
        <BookingSystem
          preselectedService={preselectedService}
          onClearPreselectedService={() => setPreselectedService('')}
        />

        {/* 8. Patient Testimonials & Google Reviews */}
        <TestimonialsSection />

        {/* 9. Patient Resources & Health Education Articles */}
        <EducationSection />

        {/* 10. Contact & Location Map */}
        <ContactSection />
      </main>

      {/* 11. Footer with Legal and Deployment Guides */}
      <Footer
        onOpenBooking={() => scrollToBooking()}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 12. Floating Action Elements */}
      <FloatingActions onOpenBooking={() => scrollToBooking()} />

      {/* 13. Modals */}
      <PatientLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

    </div>
  );
}
