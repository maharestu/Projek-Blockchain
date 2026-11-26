'use client';

import React from 'react';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import TransactionHistory from '@/components/common/TransactionHistory';

export default function StudentFundsPage() {
  const { students, transactions, activeStudentId } = useMockApp();
  const student = students.find((s) => s.id === activeStudentId);

  const myTxs = transactions.filter(
    (t) =>
      t.type === 'Penyaluran ke Mahasiswa' &&
      t.toWallet.toLowerCase() === student?.walletAddress.toLowerCase()
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Riwayat Dana Beasiswa Saya"
        description="Catatan penyaluran dana beasiswa yang dikirim dari wallet kampus ke wallet pribadi Anda."
        badge="Privasi Terjaga"
      />

      <TransactionHistory
        transactions={myTxs}
        emptyMessage="Belum ada penyaluran dana yang diterima oleh wallet Anda."
      />
    </div>
  );
}
