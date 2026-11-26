'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface WalletAddressProps {
  address: string;
  chars?: number;
  className?: string;
}

export default function WalletAddress({
  address,
  chars = 6,
  className = '',
}: WalletAddressProps) {
  const [copied, setCopied] = useState(false);

  if (!address) return <span className="text-slate-400 text-xs">-</span>;

  const shortened =
    address.length > chars * 2 + 2
      ? `${address.slice(0, chars)}...${address.slice(-4)}`
      : address;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/80 ${className}`}
      title={address}
    >
      <span>{shortened}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="text-slate-400 hover:text-blue-600 transition cursor-pointer"
        aria-label="Salin alamat wallet"
      >
        {copied ? (
          <Check className="w-3 h-3 text-emerald-600" />
        ) : (
          <Copy className="w-3 h-3" />
        )}
      </button>
    </span>
  );
}
