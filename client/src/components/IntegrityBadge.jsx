import React, { useState } from 'react';
import { Check, AlertCircle, ShieldAlert, Lock, Unlock } from 'lucide-react';

/**
 * IntegrityBadge renders an evidence integrity marker.
 * Unverified / lower-confidence items display a case-red redaction censor bar
 * that lifts away with a single smooth CSS transform (300ms, no bounce).
 */
export default function IntegrityBadge({ integrity, confidence = 100, className = '' }) {
  const normalized = String(integrity || '').toLowerCase();
  const isInitiallyVerified = normalized.includes('valid') || normalized.includes('recov') || (typeof integrity === 'number' && integrity >= 95);
  const isPartial = normalized.includes('part') || normalized.includes('warn') || (typeof integrity === 'number' && integrity < 95 && integrity >= 60);

  const [isRevealed, setIsRevealed] = useState(isInitiallyVerified);

  const handleToggleRedaction = (e) => {
    e.stopPropagation();
    setIsRevealed(!isRevealed);
  };

  if (!isInitiallyVerified && !isPartial) {
    // Failed or severely corrupted state
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-[#B33A2E]/15 text-[#B33A2E] border border-[#B33A2E]/30 ${className}`}>
        <ShieldAlert className="w-3 h-3" />
        <span>Corrupt / Failed</span>
      </span>
    );
  }

  return (
    <div
      onClick={handleToggleRedaction}
      className={`redaction-bar cursor-pointer select-none rounded border overflow-hidden transition-colors ${
        isRevealed ? 'verified' : ''
      } ${
        isInitiallyVerified
          ? 'bg-[#4C7A5E]/15 text-[#4C7A5E] border-[#4C7A5E]/30'
          : 'bg-[#C68A2E]/15 text-[#C68A2E] border-[#C68A2E]/30'
      } ${className}`}
      title={isRevealed ? "Click to redact" : "Click to lift redaction bar & verify hash"}
    >
      {/* Redaction censor bar overlay */}
      <div className="redaction-cover">
        <span className="flex items-center gap-1 px-2 py-0.5">
          <Lock className="w-2.5 h-2.5" /> REDACTED
        </span>
      </div>

      {/* Real verified badge underneath */}
      <div className="flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono font-medium">
        {isInitiallyVerified ? (
          <>
            <Check className="w-3 h-3 text-[#4C7A5E]" />
            <span>Verified (100%)</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-3 h-3 text-[#C68A2E]" />
            <span>Partial ECC ({confidence}%)</span>
          </>
        )}
      </div>
    </div>
  );
}
