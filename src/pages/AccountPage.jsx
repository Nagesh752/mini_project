import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  History,
  MessageSquarePlus,
  LogOut,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import { useCompare } from '../context/CompareContext';
import { useSearchHistory } from '../context/SearchHistoryContext';

export const AccountPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { savedCount } = useSaved();
  const { selectionCount } = useCompare();
  const { recentSearches, clearSearchHistory } = useSearchHistory();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Please Sign In</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          You need to be signed in to view your profile and account activity.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-xl text-sm font-semibold"
        >
          <span>Go to Login</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 text-center sm:text-left">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-20 h-20 rounded-2xl bg-blue-100 ring-4 ring-blue-50 shadow-sm"
          />
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-content-primary">{user.name}</h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                Active Member
              </span>
            </div>
            <p className="text-xs sm:text-sm text-content-secondary">{user.email}</p>
            <p className="text-xs text-slate-400">Account status: Active • {user.joinedDate}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Quick Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Saved Count */}
        <Link
          to="/saved"
          className="p-5 bg-white rounded-2xl border border-surface-border shadow-xs hover:border-slate-300 hover:shadow-card transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Saved Products
            </span>
            <p className="text-2xl font-bold text-slate-900">{savedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Bookmark className="w-5 h-5" />
          </div>
        </Link>

        {/* Compared Items */}
        <Link
          to="/compare"
          className="p-5 bg-white rounded-2xl border border-surface-border shadow-xs hover:border-slate-300 hover:shadow-card transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Comparison Queue
            </span>
            <p className="text-2xl font-bold text-slate-900">{selectionCount} / 5</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
        </Link>

        {/* Feedback Link */}
        <Link
          to="/feedback"
          className="p-5 bg-white rounded-2xl border border-surface-border shadow-xs hover:border-slate-300 hover:shadow-card transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Feedback Center
            </span>
            <p className="text-sm font-semibold text-slate-800">Share Ideas</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <MessageSquarePlus className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* Recent Searches Section */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <h3 className="text-base font-bold text-content-primary">Your Recent AI Searches</h3>
          </div>
          {recentSearches.length > 0 && (
            <button
              type="button"
              onClick={clearSearchHistory}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Clear History
            </button>
          )}
        </div>

        {recentSearches.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">No recent searches recorded yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentSearches.map((search, idx) => (
              <div
                key={idx}
                className="py-3 flex items-center justify-between gap-3 text-xs sm:text-sm hover:bg-slate-50/50 rounded-lg px-2 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-slate-700 min-w-0">
                  <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">&ldquo;{search}&rdquo;</span>
                </div>
                <Link
                  to={`/search?q=${encodeURIComponent(search)}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:text-brand-blue-hover flex-shrink-0"
                >
                  <span>Re-run</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disclosures */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-500 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Profile Information: Synchronized with backend services and local browser storage.
        </p>
      </div>
    </div>
  );
};
