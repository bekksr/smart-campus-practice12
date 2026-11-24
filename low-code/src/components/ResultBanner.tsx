import { CheckCircle2, XCircle, Tag } from 'lucide-react';
import type { ContractResult } from '@/lib/contract';

interface ResultBannerProps {
  result: ContractResult;
}

export function ResultBanner({ result }: ResultBannerProps) {
  const available = result.availability;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`mt-6 flex flex-col gap-3 rounded-2xl border p-5 transition-all duration-300 sm:flex-row sm:items-start ${
        available
          ? 'border-emerald-200 bg-emerald-50/80'
          : 'border-rose-200 bg-rose-50/80'
      }`}
    >
      <div
        className={`flex h-11 w-11 flex-none items-center justify-center rounded-full ${
          available ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
        }`}
      >
        {available ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
      </div>
      <div className="flex-1">
        <p
          className={`text-lg font-semibold tracking-tight ${
            available ? 'text-emerald-900' : 'text-rose-900'
          }`}
        >
          {available ? 'Available' : 'Unavailable'}
        </p>
        <p
          className={`mt-1 text-sm leading-relaxed ${
            available ? 'text-emerald-800' : 'text-rose-800'
          }`}
        >
          {result.message}
        </p>
        <div className="mt-2">
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
              available
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700'
            }`}
          >
            <Tag size={11} /> {result.reasonCode}
          </span>
        </div>
      </div>
    </div>
  );
}
