import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Send, CheckCircle2 } from 'lucide-react';
import { getSessionSearchFeedback } from '../../utils/feedback';
import { submitSearchSentimentApi } from '../../services/api';

export const SearchFeedback = ({
  query,
  className = '',
}) => {
  const [existingFeedback, setExistingFeedback] = useState(() => getSessionSearchFeedback(query));
  const [choice, setChoice] = useState(
    existingFeedback ? existingFeedback.choice : null
  );
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(!!existingFeedback);

  useEffect(() => {
    const existing = getSessionSearchFeedback(query);
    if (existing) {
      setExistingFeedback(existing);
      setChoice(existing.choice);
      setSubmitted(true);
    } else {
      setExistingFeedback(null);
      setChoice(null);
      setComment('');
      setSubmitted(false);
    }
  }, [query]);

  const handleSelectChoice = (selected) => {
    if (submitted) return;
    setChoice(selected);
    if (selected === 'helpful') {
      submitSearchSentimentApi({
        query,
        choice: 'helpful',
        timestamp: new Date().toISOString(),
      });
      setSubmitted(true);
    }
  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (!choice) return;

    submitSearchSentimentApi({
      query,
      choice,
      comment: comment.trim() || undefined,
      timestamp: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm max-w-2xl mx-auto my-10 ${className}`}
    >
      {submitted ? (
        <div className="flex items-center gap-3 text-teal-800 bg-teal-50/80 p-4 rounded-xl border border-teal-200 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
          <div className="text-xs sm:text-sm">
            <span className="font-semibold block">Thank you! Your feedback helps us improve your shopping experience.</span>
            <span className="text-slate-600 text-[11px]">
              Response saved for &ldquo;{query}&rdquo; ({choice === 'helpful' ? '👍 Understood accurately' : '👎 Improvement logged'}).
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-content-primary">
                Did we understand what you were looking for?
              </h4>
              <p className="text-xs text-content-secondary">
                Your evaluation helps refine future product matching heuristics.
              </p>
            </div>

            {/* Quick choices */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleSelectChoice('helpful')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  choice === 'helpful'
                    ? 'bg-blue-50 text-brand-blue border-brand-blue shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Yes, helpful</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectChoice('not_quite')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  choice === 'not_quite'
                    ? 'bg-rose-50 text-rose-600 border-rose-300 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />
                <span>Not quite</span>
              </button>
            </div>
          </div>

          {/* Expandable text area when 'not_quite' is selected */}
          {choice === 'not_quite' && (
            <form onSubmit={handleConfirmSubmit} className="space-y-3 pt-3 border-t border-slate-100 animate-fade-in">
              <label htmlFor="feedback-comment" className="block text-xs font-medium text-slate-700">
                What did we get wrong? How can we improve the results?
              </label>
              <textarea
                id="feedback-comment"
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
                placeholder="e.g. Budget was misunderstood, or you wanted 32GB RAM instead of 16GB..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue text-slate-900"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Optional notes for query refinement</span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-xl shadow-xs transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>Submit Feedback</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
