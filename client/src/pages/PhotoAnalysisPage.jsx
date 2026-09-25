import React from 'react';
import PhotoAnalysis from '../components/PhotoAnalysis';

export default function PhotoAnalysisPage({ scanResult }) {
  return (
    <div className="space-y-6">
      <PhotoAnalysis
        artifacts={scanResult?.artifacts || []}
        scanResult={scanResult}
      />
    </div>
  );
}
