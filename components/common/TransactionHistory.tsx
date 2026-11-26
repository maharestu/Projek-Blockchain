'use client';

import React from 'react';
import { MockTransaction } from '@/types';
import { useMockApp } from '@/context/MockAppContext';
import { SEPOLIA_EXPLORER_URL } from '@/lib/sepolia';
import WalletAddress from './WalletAddress';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';
import { ArrowRightLeft, ExternalLink } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: MockTransaction[];
  emptyMessage?: string;
}

export default function TransactionHistory({
  transactions,
  emptyMessage = 'Belum ada catatan transaksi Sepolia untuk kriteria ini.',
}: TransactionHistoryProps) {
  const { formatRupiah, programs } = useMockApp();

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="Belum Ada Riwayat Transaksi"
        description={emptyMessage}
        icon={ArrowRightLeft}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <th className="py-3 px-4">Tanggal</th>
            <th className="py-3 px-4">Jenis & Program</th>
            <th className="py-3 px-4">Dari → Tujuan</th>
            <th className="py-3 px-4">Nominal</th>
            <th className="py-3 px-4">Hash Transaksi (Sepolia)</th>
            <th className="py-3 px-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {transactions.map((tx) => {
            const prog = programs.find((p) => p.id === tx.programId);
            return (
              <tr key={tx.id} className="hover:bg-slate-50/70">
                <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                  {tx.date}
                </td>
                <td className="py-3 px-4">
                  <p className="font-bold text-slate-900">{tx.type}</p>
                  <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                    {prog?.title || tx.programId}
                  </p>
                </td>
                <td className="py-3 px-4 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium text-slate-700">{tx.fromName}</span>
                    <span className="text-slate-400">→</span>
                    <span className="font-medium text-slate-900">{tx.toName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <WalletAddress address={tx.toWallet} chars={5} />
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap font-bold text-blue-700">
                  {formatRupiah(tx.amount)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <WalletAddress address={tx.txHash} chars={6} />
                    <a
                      href={`${SEPOLIA_EXPLORER_URL}/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                      title="Lihat di Sepolia Etherscan"
                    >
                      <span>Etherscan</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={tx.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
