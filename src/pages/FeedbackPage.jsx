import React, { useState } from 'react';
import { MessageSquarePlus, CheckCircle2, AlertCircle, Send, ShieldCheck, Clock } from 'lucide-react';
import { StarRatingInput } from '../components/feedback/StarRatingInput';
import { getSavedFeedbacks } from '../utils/feedback';
import { submitGeneralFeedbackApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const FeedbackPage = () => {
  const { user } = useAuth();
  const [category, setCategory] = useState('Search Results');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [recentSubmissions, setRecentSubmissions] = useState(() => getSavedFeedbacks());

  const categories = [
    'Search Results',
    'Product Recommendations',
    'Product Comparison',
    'Website Experience',
    'Login or Sign Up',
    'Other',
  ];

  const MAX_CHAR_LIMIT = 500;

  const validateForm = () => {
    const newErrors = {};

    if (!message.trim()) {
      newErrors.message = 'Please provide your feedback message (required).';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Feedback message must be at least 10 characters long.';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please provide a valid email format, or leave it blank.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    const newRecord = await submitGeneralFeedbackApi({
      category,
      rating,
      message: message.trim(),
      email: email.trim() || undefined,
    });

    setRecentSubmissions(prev => [newRecord, ...prev]);
    setIsSubmitting(false);
    setSubmittedSuccess(true);
    setMessage('');
  };

  const handleResetForAnother = () => {
    setSubmittedSuccess(false);
    setRating(5);
    setMessage('');
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto mb-2">
          <MessageSquarePlus className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-content-primary tracking-tight">
          Help Us Improve Your Shopping Experience
        </h1>
        <p className="text-sm text-content-secondary leading-relaxed">
          Your feedback helps us understand what works and what needs improvement.
        </p>
      </div>

      {/* Main Feedback Box */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {submittedSuccess ? (
          <div className="py-8 text-center space-y-4 animate-fade-in max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-content-primary">Thank you!</h2>
              <p className="text-sm font-medium text-teal-800">
                Your feedback helps us improve your shopping experience.
              </p>
              <p className="text-xs text-slate-500 pt-1">
                This mock feedback has been saved and forwarded to the backend.
              </p>
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={handleResetForAnother}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-black transition-colors"
              >
                Send Another Response
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Select */}
            <div className="space-y-2">
              <label htmlFor="feedback-category" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Feedback Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="feedback-category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Star Rating Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Overall Experience Rating <span className="text-rose-500">*</span>
              </label>
              <StarRatingInput value={rating} onChange={setRating} />
            </div>

            {/* Message Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="feedback-message" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Feedback Message <span className="text-rose-500">*</span>
                </label>
                <span
                  className={`text-xs ${
                    message.length > MAX_CHAR_LIMIT ? 'text-rose-600 font-bold' : 'text-slate-400'
                  }`}
                >
                  {message.length} / {MAX_CHAR_LIMIT} characters
                </span>
              </div>
              <textarea
                id="feedback-message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                maxLength={MAX_CHAR_LIMIT}
                rows={4}
                placeholder="Tell us about your experience or suggest an improvement…"
                className={`w-full p-4 rounded-xl text-sm bg-slate-50 border focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.message
                    ? 'border-rose-300 focus:ring-rose-500'
                    : 'border-slate-200 focus:ring-brand-blue'
                }`}
              />
              {errors.message && (
                <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.message}</span>
                </p>
              )}
            </div>

            {/* Optional Email */}
            <div className="space-y-2">
              <label htmlFor="feedback-email" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Email Address (Optional)
              </label>
              <input
                id="feedback-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com for follow-up"
                className={`w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-rose-300 focus:ring-rose-500'
                    : 'border-slate-200 focus:ring-brand-blue'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Simulated submission — Integrated with backend</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-semibold shadow-xs disabled:opacity-50 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting…' : 'Submit Feedback'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Recent Local Feedback Submissions */}
      {recentSubmissions.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-content-primary">
              Recent Feedback Submissions (Session)
            </h3>
            <span className="text-xs text-slate-500">{recentSubmissions.length} records logged</span>
          </div>

          <div className="space-y-3">
            {recentSubmissions.slice(0, 4).map(fb => (
              <div
                key={fb.id}
                className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                      {fb.category}
                    </span>
                    <span className="text-amber-500 font-bold">{'★'.repeat(fb.rating || 5)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(fb.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed font-normal">{fb.message}</p>

                {fb.searchQuery && (
                  <p className="text-[11px] text-brand-blue">Related query: &ldquo;{fb.searchQuery}&rdquo;</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
