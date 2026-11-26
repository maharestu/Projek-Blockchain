'use client';

import React from 'react';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import TransactionHistory from '@/components/common/TransactionHistory';

export default function CampusTransactionsPage() {
  const { campuses, transactions, activeCampusId } = useMockApp();
  const campus = campuses.find((c) => c.id === activeCampusId);

  const campusTxs = transactions.filter(
    (t) =>
      t.toWallet.toLowerCase() === campus?.walletAddress.toLowerCase() ||
      t.fromWallet.toLowerCase() === campus?.walletAddress.toLowerCase()
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Riwayat Transaksi Kampus"
        description="Seluruh catatan dana masuk dari escrow dan penyaluran dana dari wallet kampus ke mahasiswa."
      />
      <TransactionHistory transactions={campusTxs} />
    </div>
  );
}
