import React, { Suspense } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DonorLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Memuat dashboard...</div>}>
      <DashboardLayout role="donor">{children}</DashboardLayout>
    </Suspense>
  );
}
