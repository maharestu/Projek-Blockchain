'use client';

import React from 'react';
import { Scholarship } from '@/types';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  GraduationCap, 
  Coins, 
  Building2, 
  Users, 
  ShieldCheck, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  onClose: () => void;
}

export default function ScholarshipDetailModal({ scholarship, onClose }: ScholarshipDetailModalProps) {
  if (!scholarship) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden z-10 my-8">
        
        {/* Header Modal */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-blue-950 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition focus:outline-none"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <span>{scholarship.providerType}</span>
            <span>•</span>
            <span>{scholarship.badge}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight pr-8">
            {scholarship.title}
          </h3>
          <p className="text-sm text-slate-300 mt-1 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>Penyelenggara: {scholarship.provider}</span>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Key Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-500 block">Besaran Bantuan</span>
              <strong className="text-blue-700 font-bold text-sm">
                {scholarship.amount}
              </strong>
              <span className="text-[10px] text-slate-500 block">{scholarship.amountPeriod}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Sasaran Jenjang</span>
              <strong className="text-slate-800 font-bold text-sm">
                {scholarship.targetDegree}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Batas Pendaftaran</span>
              <strong className="text-rose-600 font-bold text-sm">
                {scholarship.deadline}
              </strong>
            </div>
          </div>

          {/* Deskripsi Program */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Deskripsi Program
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {scholarship.description}
            </p>
          </div>

          {/* Cakupan Manfaat */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Komponen Manfaat Beasiswa
            </h4>
            <ul className="space-y-2">
              {scholarship.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Persyaratan Pendaftaran */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Persyaratan & Kriteria Pelamar
            </h4>
            <ul className="space-y-2">
              {scholarship.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Catatan Verifikasi Blockchain */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <p>
              Program beasiswa ini diawasi secara transparan. Mahasiswa yang memenuhi syarat akan diverifikasi status akademiknya langsung oleh universitas terkait sebelum penerbitan sertifikat beasiswa digital.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Kuota: <span className="font-semibold text-slate-700">{scholarship.quota}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
            >
              Tutup
            </button>
            <Link
              href="/login"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <span>Daftar via MetaMask</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
