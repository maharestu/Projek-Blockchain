'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import TransactionHistory from '@/components/common/TransactionHistory';
import EmptyState from '@/components/common/EmptyState';
import { ArrowLeft, Coins, RefreshCw, ShieldCheck } from 'lucide-react';

export default function DonorProgramDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const {
    programs,
    applications,
    students,
    campuses,
    transactions,
    activities,
    formatRupiah,
    settleRemainingFunds,
  } = useMockApp();

  const [tab, setTab] = useState<'ringkasan' | 'pendaftar' | 'calon' | 'dana' | 'aktivitas'>('ringkasan');

  const program = programs.find((p) => p.id === id);
  if (!program) {
    return (
      <EmptyState
        title="Program Tidak Ditemukan"
        description="Program beasiswa tidak tersedia."
        action={
          <Link href="/donor/programs" className="text-xs font-bold text-blue-600 underline">
            Kembali ke Program Saya
          </Link>
        }
      />
    );
  }

  const progApps = applications.filter((a) => a.programId === program.id);
  const candidateApps = progApps.filter((a) =>
    [
      'Direkomendasikan ke Donatur',
      'Menunggu Persetujuan Donatur',
      'Disetujui Donatur',
      'Ditolak Donatur',
    ].includes(a.status)
  );
  const progTxs = transactions.filter((t) => t.programId === program.id);
  const progActs = activities.filter((a) => a.target.includes(program.title));
  const remainingEscrow = Math.max(0, program.escrowDeposited - program.allocatedToCampus);

  return (
    <div className="space-y-6">
      <Link
        href="/donor/programs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Program Saya</span>
      </Link>

      <PageHeader
        title={program.title}
        description={`${program.category} • Periode ${program.scholarshipPeriod}`}
        badge={program.status}
      />

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 w-fit">
        {[
          { id: 'ringkasan', label: 'Ringkasan' },
          { id: 'pendaftar', label: `Pendaftar (${progApps.length})` },
          { id: 'calon', label: `Calon Penerima (${candidateApps.length})` },
          { id: 'dana', label: 'Dana & Transaksi' },
          { id: 'aktivitas', label: 'Riwayat Aktivitas' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              tab === t.id
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'ringkasan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Detail & Timeline Status</h3>
            <p className="text-slate-600 leading-relaxed">{program.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block">Pembukaan</span>
                <strong>{program.openDate}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block">Penutupan</span>
                <strong>{program.closeDate}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block">Seleksi</span>
                <strong>{program.selectionDate}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block">Pengumuman</span>
                <strong>{program.announcementDate}</strong>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Coins className="w-4 h-4 text-blue-600" />
              <span>Ringkasan Pendanaan</span>
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Anggaran</span>
                <strong>{formatRupiah(program.totalBudget)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Deposit Escrow</span>
                <strong className="text-blue-700">{formatRupiah(program.escrowDeposited)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dialokasikan ke Kampus</span>
                <strong>{formatRupiah(program.allocatedToCampus)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Disalurkan ke Mahasiswa</span>
                <strong className="text-emerald-700">{formatRupiah(program.disbursedToStudents)}</strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="text-slate-500">Sisa Escrow Belum Terikat</span>
                <strong>{formatRupiah(remainingEscrow)}</strong>
              </div>
            </div>

            {program.status === 'Selesai' && remainingEscrow > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  Program selesai dengan sisa dana belum terpakai sebesar <strong>{formatRupiah(remainingEscrow)}</strong>.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      settleRemainingFunds(program.id, 'refund', 'Refund sisa dana pasca program selesai')
                    }
                    className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-semibold cursor-pointer"
                  >
                    Ajukan Refund
                  </button>
                  <button
                    onClick={() =>
                      settleRemainingFunds(program.id, 'transfer', 'Pengalihan ke program berikutnya')
                    }
                    className="flex-1 py-2 rounded-xl border border-slate-300 font-semibold cursor-pointer"
                  >
                    Alihkan Dana
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'pendaftar' && (
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
          {progApps.length === 0 ? (
            <EmptyState
              title="Belum Ada Pendaftar"
              description="Belum ada mahasiswa yang mengajukan beasiswa pada program ini."
            />
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase text-slate-500">
                <tr>
                  <th className="py-3 px-4">Mahasiswa</th>
                  <th className="py-3 px-4">Kampus</th>
                  <th className="py-3 px-4">Tanggal Ajukan</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {progApps.map((a) => {
                  const st = students.find((s) => s.id === a.studentId);
                  const cp = campuses.find((c) => c.id === a.campusId);
                  return (
                    <tr key={a.id}>
                      <td className="py-3 px-4 font-bold">{st?.name}</td>
                      <td className="py-3 px-4">{cp?.name}</td>
                      <td className="py-3 px-4 text-slate-500">{a.submittedAt}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={a.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'calon' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              Untuk menjaga privasi sesuai UU PDP, dokumen pribadi sensitif hanya diverifikasi oleh kampus dan tidak ditampilkan terbuka di sini.
            </span>
          </div>
          {candidateApps.length === 0 ? (
            <EmptyState
              title="Belum Ada Calon Penerima"
              description="Kampus belum mengirimkan rekomendasi calon penerima untuk program ini."
            />
          ) : (
            candidateApps.map((a) => {
              const st = students.find((s) => s.id === a.studentId);
              const cp = campuses.find((c) => c.id === a.campusId);
              return (
                <div
                  key={a.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{st?.name}</p>
                    <p className="text-slate-500">
                      {cp?.name} • IPK {st?.gpa} • Catatan Kampus: {a.campusNote}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === 'dana' && <TransactionHistory transactions={progTxs} />}

      {tab === 'aktivitas' && (
        <div className="rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100">
          {progActs.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              Belum ada catatan aktivitas terbaru untuk program ini.
            </div>
          ) : (
            progActs.map((act) => (
              <div key={act.id} className="p-4 text-xs flex justify-between">
                <span>
                  <strong>{act.actorName}</strong>: {act.action}
                </span>
                <span className="text-slate-400">{act.timestamp}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
