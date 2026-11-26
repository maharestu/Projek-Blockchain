'use client';

import React from 'react';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import WalletAddress from '@/components/common/WalletAddress';

export default function StudentProfilePage() {
  const { students, campuses, activeStudentId } = useMockApp();
  const student = students.find((s) => s.id === activeStudentId);
  const campus = campuses.find((c) => c.id === student?.campusId);

  if (!student) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Profil Mahasiswa"
        description="Data akademik dan alamat wallet yang didaftarkan oleh perguruan tinggi Anda."
      />

      <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{student.name}</h2>
            <p className="text-slate-500">
              {campus?.name} • NIM {student.nim}
            </p>
          </div>
          <StatusBadge status={student.status} size="md" />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-500">Program Studi & Jenjang</span>
            <strong>
              {student.degree} {student.major}
            </strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Semester / IPK</span>
            <strong>
              Semester {student.semester} • IPK {student.gpa}
            </strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Email Kampus</span>
            <strong>{student.email}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Wallet Terdaftar</span>
            <WalletAddress address={student.walletAddress} />
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tanggal Didaftarkan Kampus</span>
            <strong>{student.registeredAt}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
