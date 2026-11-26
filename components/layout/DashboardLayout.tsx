'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { useMockApp } from '@/context/MockAppContext';
import { getSepoliaWalletBalance } from '@/lib/sepolia';
import WalletAddress from '@/components/common/WalletAddress';
import {
  LayoutDashboard,
  Building2,
  HeartHandshake,
  Users,
  FileCheck2,
  AlertOctagon,
  Activity,
  Settings,
  GraduationCap,
  PlusCircle,
  UserCheck,
  Coins,
  Search,
  FolderOpen,
  History,
  User,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ROLE_MENUS: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Ringkasan', href: '/admin', icon: LayoutDashboard },
    { label: 'Kampus', href: '/admin/campuses', icon: Building2 },
    { label: 'Donatur / Yayasan', href: '/admin/donors', icon: HeartHandshake },
    { label: 'Mahasiswa', href: '/admin/students', icon: Users },
    { label: 'Verifikasi Program', href: '/admin/program-verification', icon: FileCheck2 },
    { label: 'Permintaan Pembatalan', href: '/admin/cancellation-requests', icon: AlertOctagon },
    { label: 'Aktivitas', href: '/admin/activities', icon: Activity },
    { label: 'Pengaturan', href: '/admin/settings', icon: Settings },
  ],
  donor: [
    { label: 'Ringkasan', href: '/donor', icon: LayoutDashboard },
    { label: 'Program Saya', href: '/donor/programs', icon: GraduationCap },
    { label: 'Buat Program', href: '/donor/programs/create', icon: PlusCircle },
    { label: 'Persetujuan Penerima', href: '/donor/recipient-approvals', icon: UserCheck },
    { label: 'Dana & Transaksi', href: '/donor/funds', icon: Coins },
    { label: 'Permintaan Pembatalan', href: '/donor/cancellation-requests', icon: AlertOctagon },
    { label: 'Profil Yayasan', href: '/donor/profile', icon: User },
  ],
  campus: [
    { label: 'Ringkasan', href: '/campus', icon: LayoutDashboard },
    { label: 'Mahasiswa', href: '/campus/students', icon: Users },
    { label: 'Program Beasiswa', href: '/campus/programs', icon: GraduationCap },
    { label: 'Pendaftar & Verifikasi', href: '/campus/applications', icon: FileCheck2 },
    { label: 'Rekomendasi Penerima', href: '/campus/recommendations', icon: UserCheck },
    { label: 'Dana Masuk', href: '/campus/funds', icon: Coins },
    { label: 'Penyaluran Dana', href: '/campus/disbursements', icon: Send },
    { label: 'Riwayat Transaksi', href: '/campus/transactions', icon: History },
    { label: 'Profil Kampus', href: '/campus/profile', icon: Building2 },
  ],
  student: [
    { label: 'Ringkasan', href: '/student', icon: LayoutDashboard },
    { label: 'Cari Beasiswa', href: '/student/programs', icon: Search },
    { label: 'Beasiswa Saya', href: '/student/applications', icon: GraduationCap },
    { label: 'Dokumen', href: '/student/documents', icon: FolderOpen },
    { label: 'Riwayat Dana', href: '/student/funds', icon: Coins },
    { label: 'Profil', href: '/student/profile', icon: User },
  ],
};

const ROLE_LABELS: Record<UserRole, { title: string; color: string }> = {
  admin: { title: 'Kementerian / Admin', color: 'bg-blue-600' },
  donor: { title: 'Donatur / Yayasan', color: 'bg-emerald-600' },
  campus: { title: 'Kampus / Validator', color: 'bg-amber-600' },
  student: { title: 'Mahasiswa', color: 'bg-indigo-600' },
};

export default function DashboardLayout({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ethBalance, setEthBalance] = useState<string | null>(null);

  const {
    activeWallet,
    campuses,
    donors,
    students,
    activeCampusId,
    activeDonorId,
    activeStudentId,
    logout,
  } = useMockApp();

  useEffect(() => {
    if (!activeWallet) {
      setEthBalance(null);
      return;
    }
    getSepoliaWalletBalance(activeWallet)
      .then((bal) => setEthBalance(bal))
      .catch(() => setEthBalance(null));
  }, [activeWallet]);

  const navItems = ROLE_MENUS[role];
  const roleMeta = ROLE_LABELS[role];

  const getActiveEntityName = () => {
    if (role === 'admin') return 'Kementerian Pendidikan Tinggi (Admin)';
    if (role === 'campus')
      return campuses.find((c) => c.id === activeCampusId)?.name || 'Kampus Mitra';
    if (role === 'donor')
      return donors.find((d) => d.id === activeDonorId)?.name || 'Yayasan Donatur';
    return students.find((s) => s.id === activeStudentId)?.name || 'Mahasiswa';
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-white block leading-none">
                EduChain ID
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Portal {roleMeta.title}
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Badge Box */}
        <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${roleMeta.color}`} />
            <span className="text-xs font-bold text-white truncate">
              {getActiveEntityName()}
            </span>
          </div>
          {activeWallet && (
            <div className="mt-1.5">
              <WalletAddress
                address={activeWallet}
                chars={6}
                className="bg-slate-800 text-slate-300 border-slate-700"
              />
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === `/${role}`
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800 space-y-1.5">
          <Link
            href="/program"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <Search className="w-4 h-4" />
            <span>Katalog Publik</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar ke Login</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Buka sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Portal {roleMeta.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Sepolia Testnet
                {ethBalance !== null && (
                  <span className="text-slate-700 font-mono ml-1">
                    ({ethBalance} ETH)
                  </span>
                )}
              </span>
              {activeWallet ? (
                <WalletAddress address={activeWallet} chars={6} />
              ) : (
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                >
                  Hubungkan Wallet
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
