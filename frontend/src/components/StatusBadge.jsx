import React from 'react';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  reported: 'bg-amber-100 text-amber-800 border-amber-200',
  approved: 'bg-blue-100 text-blue-800 border-blue-200',
  allocated: 'bg-teal-100 text-teal-800 border-teal-200',
  assigned: 'bg-teal-100 text-teal-800 border-teal-200',
  in_progress: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  fulfilled: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  resolved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  available: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-rose-100 text-rose-800 border-rose-200',
  critical: 'bg-red-100 text-red-800 border-red-200 font-bold animate-pulse',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-amber-100 text-amber-800 border-amber-200',
  low: 'bg-slate-100 text-slate-700 border-slate-200',
};

export function StatusBadge({ status, label }) {
  const normalized = (status || '').toLowerCase().replace(/\s+/g, '_');
  const style = statusStyles[normalized] || 'bg-gray-100 text-gray-800 border-gray-200';
  const displayText = label || (status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown');

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {displayText}
    </span>
  );
}
