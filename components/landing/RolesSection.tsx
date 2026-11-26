import React from 'react';
import { ROLES_DATA } from '@/data/roles';
import { 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import Link from 'next/link';

export default function RolesSection() {
  return (
    <section id="peran" className="py-20 md:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider">
            Ekosistem Kolaboratif
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Peran & Hak Akses dalam Platform
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Setiap pemangku kepentingan memiliki peran penting dan batas tanggung jawab yang jelas untuk menjamin keadilan serta kelancaran beasiswa.
          </p>
        </div>

        {/* 4 Cards Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROLES_DATA.map((role) => (
            <div
              key={role.id}
              className="flex flex-col justify-between rounded-2xl bg-slate-50 border border-slate-200/90 hover:bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-200 p-6"
            >
              <div className="space-y-4">
                
                {/* Header Role */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {role.badge}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">
                    {role.title}
                  </h3>
                  <p className="text-xs text-blue-700 font-semibold mt-0.5">
                    {role.subtitle}
                  </p>
                </div>

                {/* Deskripsi */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {role.description}
                </p>

                {/* Tanggung Jawab */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Kontribusi Utama:
                  </span>
                  <ul className="space-y-1.5">
                    {role.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Portal Access Link */}
              <div className="pt-6 mt-4 border-t border-slate-200/70">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-between text-xs font-semibold text-blue-700 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition"
                >
                  <span>Akses Masuk {role.id.toUpperCase()}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
