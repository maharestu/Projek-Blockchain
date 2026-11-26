'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  GraduationCap, 
  Wallet, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isDashboard =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/donor') ||
    pathname.startsWith('/campus') ||
    pathname.startsWith('/student');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isDashboard) return null;

  const isSubPage = pathname !== '/';

  const navLinks = [
    { name: 'Beranda', href: isSubPage ? '/' : '#beranda' },
    { name: 'Tentang', href: isSubPage ? '/#tentang' : '#tentang' },
    { name: 'Program Beasiswa', href: '/program' },
    { name: 'Cara Kerja', href: isSubPage ? '/#cara-kerja' : '#cara-kerja' },
    { name: 'Peran Ekosistem', href: isSubPage ? '/#peran' : '#peran' },
    { name: 'FAQ', href: isSubPage ? '/#faq' : '#faq' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3' 
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Platform Name */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="EduChain Beasiswa - Halaman Utama"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  EduChain
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  ID
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide leading-none">
                Platform Beasiswa Terintegrasi
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Button: Masuk MetaMask / Status */}
          <div className="hidden sm:flex items-center gap-3">
            {isLoginPage ? (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
              >
                Kembali ke Beranda
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:shadow-blue-500/20 active:scale-[0.98] transition-all"
              >
                <Wallet className="w-4 h-4" />
                <span>Masuk dengan MetaMask</span>
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            {isLoginPage ? (
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700"
              >
                Kembali ke Beranda
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm"
              >
                <Wallet className="w-4 h-4" />
                <span>Masuk dengan MetaMask</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
