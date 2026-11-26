import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MockAppProvider } from '@/context/MockAppContext';
import ToastContainer from '@/components/common/ToastContainer';

export const metadata: Metadata = {
  title: 'EduChain Beasiswa - Platform Beasiswa Terpercaya Berbasis Blockchain',
  description:
    'Membuka Akses Pendidikan, Membangun Masa Depan dengan Transparansi. Platform beasiswa terpadu yang menghubungkan Mahasiswa, Kampus, Yayasan Donatur, dan Kementerian.',
  keywords: ['beasiswa', 'blockchain', 'pendidikan', 'kuliah', 'educhain', 'kampus', 'yayasan'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        <MockAppProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <main className="flex-1">
            <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Memuat halaman...</div>}>
              {children}
            </Suspense>
          </main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          <ToastContainer />
        </MockAppProvider>
      </body>
    </html>
  );
}
