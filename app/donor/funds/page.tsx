'use client';

import React, { useState, useEffect } from 'react';
import { useMockApp } from '@/context/MockAppContext';
import { GAS_BUFFER_PER_TX } from '@/lib/sepolia';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/common/StatCard';
import TransactionHistory from '@/components/common/TransactionHistory';
import { Coins, Lock, Send, Wallet, RefreshCw, PlusCircle } from 'lucide-react';

export default function DonorFundsPage() {
  const { programs, transactions, activeDonorId, formatRupiah, depositToEscrow } =
    useMockApp();

  const myPrograms = programs.filter((p) => p.donorId === activeDonorId);
  const myProgIds = myPrograms.map((p) => p.id);
  const myTxs = transactions.filter((t) => myProgIds.includes(t.programId));

  const [selectedProgId, setSelectedProgId] = useState(myPrograms[0]?.id || '');
  const [depositAmount, setDepositAmount] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const selectedProg = myPrograms.find((p) => p.id === selectedProgId);
  const totalGasBuffer = selectedProg
    ? Number((selectedProg.quota * GAS_BUFFER_PER_TX).toFixed(6))
    : 0;
  const targetWithBuffer = selectedProg
    ? Number((selectedProg.totalBudget + totalGasBuffer).toFixed(6))
    : 0;
  const recommendedDeposit = selectedProg
    ? Number(Math.max(0, targetWithBuffer - selectedProg.escrowDeposited).toFixed(6))
    : 0;

  useEffect(() => {
    if (!selectedProgId && myPrograms[0]?.id) {
      setSelectedProgId(myPrograms[0].id);
    }
  }, [myPrograms, selectedProgId]);

  useEffect(() => {
    if (selectedProg) {
      setDepositAmount(recommendedDeposit > 0 ? recommendedDeposit : GAS_BUFFER_PER_TX);
    }
  }, [selectedProgId, recommendedDeposit, selectedProg]);

  const totalDeposit = myPrograms.reduce((a, p) => a + p.escrowDeposited, 0);
  const totalAllocated = myPrograms.reduce((a, p) => a + p.allocatedToCampus, 0);
  const totalDisbursed = myPrograms.reduce((a, p) => a + p.disbursedToStudents, 0);
  const escrowAvailable = Math.max(0, totalDeposit - totalAllocated);
  const refundEligible = myPrograms
    .filter((p) => p.status === 'Selesai' || p.status === 'Dibatalkan')
    .reduce((a, p) => a + Math.max(0, p.escrowDeposited - p.allocatedToCampus), 0);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgId || depositAmount <= 0) return;
    setConfirmOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dana Escrow & Riwayat Transaksi"
        description="Kelola deposit dana program ke escrow Sepolia dan pantau alokasi hingga penyaluran kepada mahasiswa."
        badge="Sepolia Testnet"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Deposit"
          value={formatRupiah(totalDeposit)}
          icon={Coins}
          tone="blue"
        />
        <StatCard
          label="Saldo Escrow Bebas"
          value={formatRupiah(escrowAvailable)}
          icon={Lock}
          tone="indigo"
        />
        <StatCard
          label="Dialokasikan ke Kampus"
          value={formatRupiah(totalAllocated)}
          icon={Wallet}
          tone="amber"
        />
        <StatCard
          label="Disalurkan ke Mahasiswa"
          value={formatRupiah(totalDisbursed)}
          icon={Send}
          tone="emerald"
        />
        <StatCard
          label="Memenuhi Syarat Refund"
          value={formatRupiah(refundEligible)}
          icon={RefreshCw}
          tone="slate"
        />
      </div>

      {/* Form Deposit Simulasi */}
      <form
        onSubmit={handleDepositSubmit}
        className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span>Deposit Dana ke Escrow Program (SepoliaETH)</span>
          </h2>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
            Sepolia On-Chain
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Program Tujuan</label>
            <select
              value={selectedProgId}
              onChange={(e) => setSelectedProgId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 bg-white"
            >
              {myPrograms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.status})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nominal Deposit (SepoliaETH)</label>
            <input
              type="number"
              min={0.0001}
              step={0.001}
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSending}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer disabled:opacity-50"
            >
              {isSending ? 'Memproses MetaMask...' : 'Deposit SepoliaETH'}
            </button>
          </div>
        </div>

        {selectedProg && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-slate-500 block">Kebutuhan Pokok Program</span>
              <strong className="text-slate-900">
                {formatRupiah(selectedProg.totalBudget)}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">
                Cadangan Gas Fee ({selectedProg.quota} × {GAS_BUFFER_PER_TX} ETH)
              </span>
              <strong className="text-amber-700">+{formatRupiah(totalGasBuffer)}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">
                Total Disarankan (+ Buffer Gas Fee)
              </span>
              <strong className="text-blue-700">{formatRupiah(targetWithBuffer)}</strong>
            </div>
          </div>
        )}

        {confirmOpen && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span>
              Konfirmasi pengiriman <strong>{formatRupiah(depositAmount)}</strong> melalui MetaMask ke smart contract escrow Sepolia?
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isSending}
                onClick={() => setConfirmOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSending}
                onClick={async () => {
                  setIsSending(true);
                  await depositToEscrow(selectedProgId, depositAmount);
                  setIsSending(false);
                  setConfirmOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold cursor-pointer disabled:opacity-50"
              >
                {isSending ? 'Mengirim...' : 'Kirim via MetaMask'}
              </button>
            </div>
          </div>
        )}
      </form>

      <div className="space-y-3">
        <h2 className="font-bold text-slate-900 text-base">Riwayat Transaksi Program Anda</h2>
        <TransactionHistory transactions={myTxs} />
      </div>
    </div>
  );
}
