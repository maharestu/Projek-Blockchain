import React from 'react';
import { ApplicationTimelineItem } from '@/types';
import { CheckCircle2, Clock } from 'lucide-react';

interface TimelineProps {
  items: ApplicationTimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="space-y-4">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                  isLast
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                }`}
              >
                {isLast ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
              </div>
              {!isLast && <div className="w-px flex-1 bg-slate-200 my-1" />}
            </div>

            <div className="pb-4 min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold text-slate-900">{item.status}</p>
                <span className="text-[11px] text-slate-400">{item.date}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Oleh: {item.actor}</p>
              {item.note && (
                <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1.5 mt-1.5">
                  {item.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
