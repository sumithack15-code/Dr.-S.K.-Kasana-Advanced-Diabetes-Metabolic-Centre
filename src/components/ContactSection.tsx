import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Send,
  MessageSquare,
  Navigation,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowUpRight,
} from 'lucide-react';
import { CLINIC_CONTACT } from '../data/clinicalContent';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, message }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitSuccess(true);
        setName('');
        setPhone('');
        setEmail('');
        setMessage('');
      } else {
        setSubmitError(data.message || 'Unable to submit your message. Please try again.');
      }
    } catch (err) {
      setSubmitError('Connection error. Please call the clinic directly at +91 9911887793.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#FAF8F5] border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 border-b border-[#E8E4DC] pb-10">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#0C2B22]">
              Consultation Chambers &middot; Sarita Vihar
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#0C2B22] tracking-tight leading-[1.12]">
              Visit Dr. S.K. Kasana{' '}
              <span className="italic font-normal text-[#1B4D3E]">in New Delhi.</span>
            </h2>
          </div>

          <div className="lg:col-span-4 text-xs text-[#556059] font-light leading-relaxed">
            Conveniently positioned in Pocket J, Sarita Vihar, South Delhi, offering tranquil consultation rooms with dedicated reception coordination.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Clinic Contact Details & Map (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Address & Helpline Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-6 bg-white border border-[#E0DACE] rounded-sm space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-[#556059] font-bold block">
                  Location &middot; Address
                </span>
                <p className="font-editorial text-base text-[#0C2B22] leading-snug">
                  {CLINIC_CONTACT.address}
                </p>
                <div className="pt-2">
                  <a
                    href={CLINIC_CONTACT.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#0C2B22] hover:text-[#C5A059] transition-colors"
                  >
                    <span>View on Google Maps</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A059]" />
                  </a>
                </div>
              </div>

              <div className="p-6 bg-white border border-[#E0DACE] rounded-sm space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-[#556059] font-bold block">
                  Direct Helpline
                </span>
                <a
                  href={`tel:${CLINIC_CONTACT.phoneRaw}`}
                  className="font-editorial text-xl font-bold text-[#0C2B22] hover:text-[#1B4D3E] block"
                >
                  {CLINIC_CONTACT.phoneDisplay}
                </a>
                <div className="pt-1">
                  <a
                    href={`https://wa.me/919911887793?text=${encodeURIComponent(
                      'Hello Dr. S.K. Kasana Diabetes Centre, I would like to inquire about appointments.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#0C2B22] hover:text-[#C5A059] transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Operating Hours Plaque */}
            <div className="p-6 sm:p-8 bg-[#0C2B22] text-[#FAF8F5] rounded-sm border border-[#143E32] space-y-4">
              <div className="flex items-baseline justify-between border-b border-[#1C483A] pb-3">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold">
                  Consultation Schedule
                </span>
                <span className="text-[10px] text-[#A6BAA9] font-light">
                  Prior Reservation Advised
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-[#1C483A]/60">
                  <span className="text-[#D0DBD0]">Monday – Saturday (Morning Session)</span>
                  <span className="font-semibold text-white">09:30 AM – 01:00 PM</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#1C483A]/60">
                  <span className="text-[#D0DBD0]">Monday – Saturday (Evening Session)</span>
                  <span className="font-semibold text-white">04:30 PM – 07:30 PM</span>
                </div>
                <div className="flex items-center justify-between py-1 text-rose-300">
                  <span>Sunday</span>
                  <span className="font-semibold">Closed</span>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-sm overflow-hidden border border-[#E0DACE] shadow-sm h-64 bg-[#EBF0EA]">
              <iframe
                title="Dr. S.K. Kasana Diabetes Centre Sarita Vihar Map"
                src="https://maps.google.com/maps?q=J%20Pocket,%20J%20350,%20Pocket%20J,%20Sarita%20Vihar,%20New%20Delhi,%20Delhi%20110076&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>

          {/* Right Column: Contact Inquiry Form (6 cols) */}
          <div className="lg:col-span-6 bg-[#F5F2EB] p-8 sm:p-10 rounded-sm border border-[#E0DACE] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#556059] font-bold block">
                  Private Inquiry Form
                </span>
                <h3 className="font-editorial text-2xl text-[#0C2B22] font-semibold">
                  Send a Direct Message to Clinic Reception
                </h3>
                <p className="text-xs text-[#556059] font-light">
                  For inquiries regarding laboratory testing protocols, dietary consultation, or general clinical questions.
                </p>
              </div>

              {submitSuccess && (
                <div className="p-4 bg-[#EBF0EA] border border-[#D5DDD3] text-xs text-[#0C2B22] flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#0C2B22] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Message Transmitted Successfully</div>
                    <p className="text-[11px] text-[#556059] mt-0.5">
                      Our clinic coordinator will review and contact you shortly at +91 {phone}.
                    </p>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#0C2B22] mb-1.5 uppercase tracking-wider text-[11px]">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anuradha Sharma"
                    className="w-full px-4 py-3 bg-white border border-[#D5DDD3] rounded-sm text-[#0C2B22] focus:outline-none focus:border-[#0C2B22]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#0C2B22] mb-1.5 uppercase tracking-wider text-[11px]">
                      Contact Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9811234567"
                      className="w-full px-4 py-3 bg-white border border-[#D5DDD3] rounded-sm text-[#0C2B22] focus:outline-none focus:border-[#0C2B22]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#0C2B22] mb-1.5 uppercase tracking-wider text-[11px]">
                      Email Address <span className="text-[#8A9A86] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 bg-white border border-[#D5DDD3] rounded-sm text-[#0C2B22] focus:outline-none focus:border-[#0C2B22]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#0C2B22] mb-1.5 uppercase tracking-wider text-[11px]">
                    Your Clinical Query <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry or question..."
                    className="w-full px-4 py-3 bg-white border border-[#D5DDD3] rounded-sm text-[#0C2B22] focus:outline-none focus:border-[#0C2B22]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 text-xs uppercase tracking-widest font-semibold text-[#FAF8F5] bg-[#0C2B22] hover:bg-[#143E32] rounded-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                      <span>Transmitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#C5A059]" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E0DACE] text-[11px] text-[#556059] font-light">
              <strong>Emergency Note:</strong> For acute medical emergencies or severe symptomatic hypoglycemia, please report immediately to the nearest tertiary emergency department.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
