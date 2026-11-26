'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMockApp } from '@/context/MockAppContext';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  GraduationCap,
  ShieldCheck,
  Wallet,
} from 'lucide-react';

export default function PublicProgramDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { programs, donors, campuses, formatRupiah } = useMockApp();

  const program = programs.find((p) => p.id === id);

  if (!program) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 max-w-3xl mx-auto">
        <EmptyState
          title="Program Tidak Ditemukan"
          description="Program beasiswa yang Anda cari tidak tersedia atau telah dihapus."
          action={
            <Link
              href="/program"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Daftar Program</span>
            </Link>
          }
        />
      </div>
    );
  }

  const donor = donors.find((d) => d.id === program.donorId);
  const targetCampuses = program.targetCampusIds.includes('ALL')
    ? 'Seluruh Perguruan Tinggi Mitra Terverifikasi'
    : program.targetCampusIds
        .map((cid) => campuses.find((c) => c.id === cid)?.name || cid)
        .join(', ');

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          href="/program"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Program</span>
        </Link>

        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-blue-950 text-white space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
                {program.category}
              </span>
              <StatusBadge status={program.status} size="md" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {program.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-400" />
                {donor?.name || 'Penyelenggara Resmi'}
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                Jenjang: {program.targetDegree}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Nominal Bantuan
                </span>
                <strong className="text-xl font-extrabold text-blue-700">
                  {formatRupiah(program.amountPerRecipient)}
                </strong>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  {program.scholarshipPeriod}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Kuota & Total Anggaran
                </span>
                <strong className="text-xl font-extrabold text-slate-900">
                  {program.quota} Penerima
                </strong>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  Total: {formatRupiah(program.totalBudget)}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Periode Pendaftaran
                </span>
                <strong className="text-sm font-bold text-slate-900 block mt-1">
                  {program.openDate} s/d {program.closeDate}
                </strong>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  Pengumuman: {program.announcementDate}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Tentang Program
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {program.description}
              </p>
              <p className="text-xs text-slate-500 pt-1">
                <strong>Kampus Sasaran:</strong> {targetCampuses}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Persyaratan Pelamar
                </h3>
                <ul className="space-y-2">
                  {program.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Dokumen Wajib
                </h3>
                <ul className="space-y-2">
                  {program.requiredDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900">
                  <strong className="block font-bold">Pendaftaran melalui Portal Mahasiswa</strong>
                  <span>
                    Mahasiswa terdaftar pada kampus mitra dapat masuk menggunakan MetaMask untuk mengajukan beasiswa ini.
                  </span>
                </div>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 transition"
              >
                <Wallet className="w-4 h-4" />
                <span>Masuk untuk Mendaftar</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
