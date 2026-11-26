'use client';

import React, { useState } from 'react';
import { FAQ_DATA } from '@/data/faq';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pusat Bantuan & FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-slate-600 text-base leading-relaxed max-w-2xl mx-auto">
            Pelajari lebih lanjut mengenai cara kerja dompet MetaMask, perlindungan data, dan prinsip transparansi beasiswa.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200/90 overflow-hidden transition-all bg-white"
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                      {item.question}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-blue-100 text-blue-700' : 'text-slate-500'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Catatan Penting Keamanan */}
        <div className="mt-12 p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-amber-950 font-bold mb-1">
              Peringatan Keamanan Dompet Digital:
            </strong>
            Platform EduChain tidak akan pernah meminta <em>Secret Recovery Phrase</em> (frasa pemulihan 12/24 kata) atau <em>Private Key</em> Anda. Jangan pernah membagikan kunci rahasia Anda kepada siapa pun atas alasan apa pun.
          </div>
        </div>

      </div>
    </section>
  );
}
