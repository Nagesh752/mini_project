import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Check, Send } from 'lucide-react';
import { getSessionProductFeedback } from '../../utils/feedback';
import { submitProductSentimentApi } from '../../services/api';

export const ProductFeedbackWidget = ({
  productId,
  productName,
  query,
  className = '',
}) => {
  const [sessionFeedback, setSessionFeedback] = useState(() => getSessionProductFeedback(productId));
  const [selectedChoice, setSelectedChoice] = useState(
    sessionFeedback ? sessionFeedback.choice : null
  );
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(!!sessionFeedback);

  useEffect(() => {
    const existing = getSessionProductFeedback(productId);
    if (existing) {
      setSessionFeedback(existing);
      setSelectedChoice(existing.choice);
      setSubmitted(true);
    }
  }, [productId]);

  const handleChoice = (choice) => {
    if (submitted) return; // Already locked in for this session

    setSelectedChoice(choice);
    if (choice === 'good') {
      submitProductSentimentApi({
        productId,
        choice: 'good',
        query,
        timestamp: new Date().toISOString(),
      });
      setSubmitted(true);
      setShowNoteInput(false);
    } else {
      setShowNoteInput(true);
    }
  };

  const handleConfirmNotRelevant = () => {
    submitProductSentimentApi({
      productId,
      choice: 'not_relevant',
      reason: note.trim() || undefined,
      query,
      timestamp: new Date().toISOString(),
    });
    setSubmitted(true);
    setShowNoteInput(false);
  };

  const handleCancel = () => {
    setSelectedChoice(null);
    setShowNoteInput(false);
    setNote('');
  };

  if (submitted) {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-slate-500 py-1 ${className}`}>
        <Check className="w-3.5 h-3.5 text-teal-600" />
        <span>Feedback saved: {selectedChoice === 'good' ? 'Good recommendation' : 'Marked not relevant'}</span>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px] font-medium text-slate-400">Recommendation feedback:</span>
        <div className="flex items-center gap-1">
          {/* Thumbs Up */}
          <button
            type="button"
            onClick={() => handleChoice('good')}
            className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
              selectedChoice === 'good'
                ? 'bg-blue-50 text-brand-blue border-blue-300 font-medium'
                : 'bg-white text-slate-500 border-slate-200 hover:text-brand-blue hover:bg-blue-50/50'
            }`}
            title="Good recommendation"
            aria-label={`Mark ${productName} as a good recommendation`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Helpful</span>
          </button>

          {/* Thumbs Down */}
          <button
            type="button"
            onClick={() => handleChoice('not_relevant')}
            className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
              selectedChoice === 'not_relevant'
                ? 'bg-rose-50 text-rose-600 border-rose-300 font-medium'
                : 'bg-white text-slate-500 border-slate-200 hover:text-rose-600 hover:bg-rose-50/50'
            }`}
            title="Not relevant"
            aria-label={`Mark ${productName} as not relevant`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Not relevant</span>
          </button>
        </div>
      </div>

      {/* Optional Note Disclosure for Not Relevant */}
      {showNoteInput && (
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-fade-in text-xs">
          <p className="text-slate-600 font-medium">Why was this product not relevant? (optional)</p>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g., Exceeds budget, wrong specs, or disliked brand"
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={handleCancel}
              className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmNotRelevant}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-md shadow-xs"
            >
              <Send className="w-3 h-3" />
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
