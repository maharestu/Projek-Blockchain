'use client';

import React from 'react';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import TransactionHistory from '@/components/common/TransactionHistory';

export default function CampusFundsPage() {
  const { campuses, programs, donors, transactions, activeCampusId, formatRupiah } =
    useMockApp();

  const campus = campuses.find((c) => c.id === activeCampusId);
  const incomingTxs = transactions.filter(
    (t) =>
      t.type === 'Alokasi ke Kampus' &&
      t.toWallet.toLowerCase() === campus?.walletAddress.toLowerCase()
  );

  // Hitung ringkasan per program
  const programIdsWithFunds = Array.from(new Set(incomingTxs.map((t) => t.programId)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dana Masuk Kampus (Per Program)"
        description="Catatan alokasi dana beasiswa dari escrow donatur ke wallet kampus Anda, dipisahkan per program."
        badge="Audit Per Program"
      />

      {programIdsWithFunds.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programIdsWithFunds.map((pid) => {
            const prog = programs.find((p) => p.id === pid);
            const donor = donors.find((d) => d.id === prog?.donorId);
            const received = incomingTxs
              .filter((t) => t.programId === pid)
              .reduce((a, t) => a + t.amount, 0);
            const disbursed = transactions
              .filter(
                (t) =>
                  t.type === 'Penyaluran ke Mahasiswa' &&
                  t.programId === pid &&
                  t.fromWallet.toLowerCase() === campus?.walletAddress.toLowerCase()
              )
              .reduce((a, t) => a + t.amount, 0);

            return (
              <div
                key={pid}
                className="rounded-2xl bg-white border border-slate-200 p-5 space-y-3 text-xs"
              >
                <div>
                  <span className="text-[11px] font-bold text-blue-700">{donor?.name}</span>
                  <h3 className="font-bold text-slate-900 text-base">{prog?.title}</h3>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block">Diterima</span>
                    <strong className="text-blue-700">{formatRupiah(received)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Disalurkan</span>
                    <strong className="text-emerald-700">{formatRupiah(disbursed)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Kewajiban Tersisa</span>
                    <strong className="text-rose-600">
                      {formatRupiah(Math.max(0, received - disbursed))}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-bold text-slate-900 text-base">
          Riwayat Dana Masuk dari Escrow (Simulasi)
        </h2>
        <TransactionHistory
          transactions={incomingTxs}
          emptyMessage="Belum ada dana yang dialokasikan ke wallet kampus Anda."
        />
      </div>
    </div>
  );
}
