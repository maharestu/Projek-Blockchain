'use client';

import React, { useState } from 'react';
import { useMockApp } from '@/context/MockAppContext';
import { ScholarshipApplication } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import WalletAddress from '@/components/common/WalletAddress';
import EmptyState from '@/components/common/EmptyState';
import { Coins, Send, AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function CampusDisbursementsPage() {
  const {
    campuses,
    applications,
    students,
    programs,
    transactions,
    activeCampusId,
    formatRupiah,
    disburseFunds,
  } = useMockApp();

  const campus = campuses.find((c) => c.id === activeCampusId);

  const [disburseTarget, setDisburseTarget] = useState<{
    app: ScholarshipApplication;
    maxRemaining: number;
  } | null>(null);
  const [amountInput, setAmountInput] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const approvedApps = applications.filter(
    (a) => a.campusId === activeCampusId && a.status === 'Disetujui Donatur'
  );

  const totalReceived = transactions
    .filter(
      (t) =>
        t.type === 'Alokasi ke Kampus' &&
        t.toWallet.toLowerCase() === campus?.walletAddress.toLowerCase()
    )
    .reduce((a, t) => a + t.amount, 0);

  const totalDisbursed = transactions
    .filter(
      (t) =>
        t.type === 'Penyaluran ke Mahasiswa' &&
        t.fromWallet.toLowerCase() === campus?.walletAddress.toLowerCase()
    )
    .reduce((a, t) => a + t.amount, 0);

  const totalObligation = Math.max(0, totalReceived - totalDisbursed);

  const handleOpenDisburse = (app: ScholarshipApplication, remaining: number) => {
    setDisburseTarget({ app, maxRemaining: remaining });
    setAmountInput(remaining);
  };

  const handleConfirmDisburse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disburseTarget) return;
    setIsSending(true);
    const ok = await disburseFunds(disburseTarget.app.id, amountInput);
    setIsSending(false);
    if (ok) {
      setDisburseTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Penyaluran Dana ke Mahasiswa"
        description="Salurkan SepoliaETH kepada penerima yang telah disetujui donatur melalui MetaMask. Kampus tidak dapat menyalurkan melebihi alokasi program."
        badge="Sepolia Testnet"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Dana Diterima Kampus"
          value={formatRupiah(totalReceived)}
          icon={Coins}
          tone="blue"
        />
        <StatCard
          label="Sudah Disalurkan"
          value={formatRupiah(totalDisbursed)}
          icon={Send}
          tone="emerald"
        />
        <StatCard
          label="Belum Disalurkan (Kewajiban)"
          value={formatRupiah(totalObligation)}
          icon={AlertCircle}
          tone={totalObligation > 0 ? 'rose' : 'slate'}
        />
      </div>

      {approvedApps.length === 0 ? (
        <EmptyState
          title="Belum Ada Penerima Disetujui Donatur"
          description="Penyaluran hanya dapat dilakukan untuk calon penerima yang telah mendapat persetujuan akhir dari donatur."
          icon={Send}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                <th className="py-3.5 px-4">Penerima & Wallet</th>
                <th className="py-3.5 px-4">Program</th>
                <th className="py-3.5 px-4">Alokasi</th>
                <th className="py-3.5 px-4">Disalurkan</th>
                <th className="py-3.5 px-4">Sisa Kewajiban</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {approvedApps.map((app) => {
                const student = students.find((s) => s.id === app.studentId);
                const prog = programs.find((p) => p.id === app.programId);
                const allocation = app.recommendedAmount || prog?.amountPerRecipient || 0;
                const disbursed = transactions
                  .filter(
                    (t) =>
                      t.type === 'Penyaluran ke Mahasiswa' &&
                      t.programId === app.programId &&
                      t.toWallet.toLowerCase() === student?.walletAddress.toLowerCase()
                  )
                  .reduce((a, t) => a + t.amount, 0);
                const remaining = Math.max(0, allocation - disbursed);

                return (
                  <tr key={app.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 space-y-1">
                      <p className="font-bold text-slate-900">{student?.name}</p>
                      <WalletAddress address={student?.walletAddress || ''} />
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {prog?.title}
                    </td>
                    <td className="py-3.5 px-4 font-bold">{formatRupiah(allocation)}</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-bold">
                      {formatRupiah(disbursed)}
                    </td>
                    <td className="py-3.5 px-4 text-rose-600 font-bold">
                      {formatRupiah(remaining)}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={remaining === 0 ? 'Selesai' : 'Aktif'} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {remaining > 0 ? (
                        <button
                          onClick={() => handleOpenDisburse(app, remaining)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Salurkan Dana</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Tersalurkan Penuh</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Konfirmasi Penyaluran */}
      {disburseTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setDisburseTarget(null)} />
          <form
            onSubmit={handleConfirmDisburse}
            className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Konfirmasi Penyaluran SepoliaETH
              </h3>
              <button type="button" onClick={() => setDisburseTarget(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {(() => {
              const st = students.find((s) => s.id === disburseTarget.app.studentId);
              return (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Penerima</span>
                    <strong>{st?.name}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Wallet Tujuan</span>
                    <WalletAddress address={st?.walletAddress || ''} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Maksimal Kewajiban</span>
                    <strong className="text-blue-700">
                      {formatRupiah(disburseTarget.maxRemaining)}
                    </strong>
                  </div>
                </div>
              );
            })()}

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Nominal Penyaluran (SepoliaETH)
              </label>
              <input
                type="number"
                min={0.0001}
                step={0.001}
                max={disburseTarget.maxRemaining}
                value={amountInput}
                onChange={(e) => setAmountInput(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 font-bold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isSending}
                onClick={() => setDisburseTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer disabled:opacity-50"
              >
                {isSending ? 'Mengirim via MetaMask...' : 'Kirim SepoliaETH'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
