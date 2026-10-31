import React, { useState } from 'react';
import { ArrowUpRight, Clock, X, Check, BookOpen } from 'lucide-react';
import { EDUCATIONAL_ARTICLES } from '../data/clinicalContent';
import { EducationalArticle } from '../types';

export const EducationSection: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<EducationalArticle | null>(null);

  return (
    <section id="education" className="py-20 sm:py-28 bg-[#F5F2EB] border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 border-b border-[#E8E4DC] pb-10">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#0C2B22]">
              Clinical Compendium &middot; Patient Education
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#0C2B22] tracking-tight leading-[1.12]">
              The Metabolic Health{' '}
              <span className="italic font-normal text-[#1B4D3E]">Journal.</span>
            </h2>
          </div>

          <div className="lg:col-span-4 text-xs text-[#556059] font-light leading-relaxed">
            Evidence-based clinical perspectives to demystify glycemic fluctuations, HbA1c benchmarks, and metabolic syndrome risk factors.
          </div>
        </div>

        {/* Journal Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EDUCATIONAL_ARTICLES.map((article, idx) => (
            <article
              key={article.id}
              className="bg-[#FAF8F5] border border-[#E0DACE] rounded-sm p-7 sm:p-8 flex flex-col justify-between hover:border-[#0C2B22]/30 hover:shadow-md transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3 text-[11px] text-[#556059]">
                  <span className="uppercase tracking-widest font-semibold text-[#0C2B22]">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 font-light">
                    <Clock className="w-3 h-3 text-[#C5A059]" />
                    <span>{article.readTime}</span>
                  </span>
                </div>

                <h3 className="font-editorial text-xl sm:text-2xl text-[#0C2B22] font-semibold tracking-tight leading-snug group-hover:text-[#1B4D3E] transition-colors">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#4A5750] leading-relaxed font-light">
                  {article.summary}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E8E4DC] flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-[#8A9A86] font-medium">
                  Evidence-Based
                </span>

                <button
                  onClick={() => setActiveArticle(article)}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#0C2B22] hover:text-[#C5A059] transition-colors"
                >
                  <span>Read Article</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A059]" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Article Reader Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071C16]/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#FAF8F5] border border-[#D5DDD3] rounded-sm max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
              
              {/* Header */}
              <div className="p-6 sm:p-8 border-b border-[#E8E4DC] flex items-start justify-between gap-4 bg-[#F5F2EB]">
                <div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#C5A059] font-bold mb-1">
                    <span>{activeArticle.category}</span>
                    <span>&middot;</span>
                    <span>{activeArticle.readTime}</span>
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl text-[#0C2B22] font-semibold leading-tight">
                    {activeArticle.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-1 text-[#556059] hover:text-[#0C2B22]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#3E4943] leading-relaxed font-light">
                {activeArticle.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}

                {/* Key Takeaways */}
                <div className="mt-6 p-5 bg-[#EBF0EA] border border-[#D5DDD3] rounded-sm space-y-2.5">
                  <div className="font-editorial text-base text-[#0C2B22] font-semibold">
                    Key Clinical Takeaways:
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#3E4943]">
                    {activeArticle.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-[#F5F2EB] text-[10px] text-[#556059] border border-[#E8E4DC]">
                  <strong>Medical Disclaimer:</strong> This review is provided for patient awareness and does not replace personalized clinical diagnosis. Always consult Dr. S.K. Kasana for individualized medical advice.
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[#E8E4DC] bg-[#F5F2EB] flex items-center justify-between">
                <span className="text-[11px] text-[#556059] font-light">
                  Adhering to RSSDI &amp; ADA standard clinical guidelines
                </span>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-5 py-2 text-xs uppercase tracking-wider font-semibold text-[#0C2B22] border border-[#CBD5C8] hover:bg-white rounded-sm"
                >
                  Close Reader
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
