import { useEffect, useState } from 'react';
import { explainAvailability } from '@/lib/ai/explainAvailability';
import { ExplanationRequest } from '@/lib/ai/types';

interface ExplainAvailabilityProps {
  request: ExplanationRequest;
}

export function ExplainAvailability({
  request,
}: ExplainAvailabilityProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setExplanation(null);
    setError(null);
  }, [
    request.roomLabel,
    request.startTime,
    request.endTime,
    request.isAvailable,
    request.reasonCode,
    request.reasonDetail,
  ]);

  const handleExplain = () => {
    try {
      const result = explainAvailability(request);
      setExplanation(result.explanation);
      setError(null);
    } catch {
      setExplanation(null);
      setError('Unable to generate an explanation.');
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <button
        type="button"
        onClick={handleExplain}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Explain Availability
      </button>

      {explanation && (
        <div className="mt-3 text-sm text-slate-700">
          <p className="font-semibold">Explanation (Mock AI)</p>
          <p>{explanation}</p>
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
