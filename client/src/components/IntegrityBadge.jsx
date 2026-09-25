import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

/**
 * IntegrityBadge renders a small colored pill (green/amber/red)
 * indicating 'valid', 'partial', or 'failed' integrity state.
 *
 * @param {Object} props
 * @param {string|number} props.integrity - 'valid' | 'partial' | 'failed' | percentage/string
 * @param {string} [props.className]
 */
export default function IntegrityBadge({ integrity, className = '' }) {
  // Normalize string/status value
  const normalized = String(integrity || '').toLowerCase();

  let state = 'valid';
  let label = 'Valid';
  let colorStyles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  let Icon = CheckCircle2;

  if (normalized.includes('fail') || normalized === 'corrupt' || normalized === '0') {
    state = 'failed';
    label = 'Failed';
    colorStyles = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    Icon = XCircle;
  } else if (normalized.includes('part') || normalized.includes('warn') || (typeof integrity === 'number' && integrity < 90 && integrity >= 50)) {
    state = 'partial';
    label = 'Partial';
    colorStyles = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    Icon = AlertTriangle;
  } else if (normalized.includes('valid') || normalized.includes('recov') || (typeof integrity === 'number' && integrity >= 90)) {
    state = 'valid';
    label = 'Valid';
    colorStyles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    Icon = CheckCircle2;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${colorStyles} ${className}`}
    >
      <Icon className="w-3 h-3" />
      <span>{label}</span>
    </span>
  );
}
