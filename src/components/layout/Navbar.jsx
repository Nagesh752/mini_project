import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, Layers, Bookmark, MessageSquarePlus, User, LogOut, Menu, X, ArrowRight } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { useSaved } from '../../context/SavedContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { selectionCount } = useCompare();
  const { savedCount } = useSaved();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
      isActive
        ? 'text-brand-blue bg-blue-50/80 font-semibold'
        : 'text-content-secondary hover:text-content-primary hover:bg-slate-100/70'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center justify-between px-4 py-3 text-base font-medium rounded-xl transition-colors ${
      isActive
        ? 'text-brand-blue bg-blue-50 font-semibold'
        : 'text-content-secondary hover:text-content-primary hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-xl p-1"
          >
            <img
              src="/shopmind-logo.png"
              alt="ShopMind AI Logo"
              className="w-9 h-9 rounded-xl object-cover shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg leading-tight tracking-tight text-content-primary flex items-center gap-1.5">
                <span>ShopMind</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xs">
                  AI
                </span>
              </span>
              <span className="text-[11px] text-content-secondary leading-none hidden sm:block">
                Smart Semantic Discovery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/explore" className={navLinkClass}>
              Explore Products
            </NavLink>
            <NavLink to="/compare" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-400" />
                Compare
                {selectionCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-brand-blue text-white min-w-[20px] text-center">
                    {selectionCount}
                  </span>
                )}
              </span>
            </NavLink>
            <NavLink to="/saved" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-slate-400" />
                Saved
                {savedCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-teal-600 text-white min-w-[20px] text-center">
                    {savedCount}
                  </span>
                )}
              </span>
            </NavLink>
            <NavLink to="/feedback" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <MessageSquarePlus className="w-4 h-4 text-slate-400" />
                Feedback
              </span>
            </NavLink>
          </nav>

          {/* Desktop Auth / Account Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  aria-expanded={userDropdownOpen}
                >
                  <span className="text-xs font-medium text-slate-700 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-full bg-slate-100 ring-1 ring-slate-200"
                  />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-elevated border border-surface-border py-1.5 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-blue transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      My Account
                    </Link>
                    <Link
                      to="/saved"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-blue transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-slate-400" />
                      Saved Products ({savedCount})
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-content-secondary hover:text-content-primary rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-hover rounded-lg shadow-sm shadow-blue-500/20 transition-all hover:shadow"
                >
                  Sign Up
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            {selectionCount > 0 && (
              <Link
                to="/compare"
                className="px-2.5 py-1 text-xs font-semibold rounded-full bg-brand-blue text-white flex items-center gap-1"
              >
                <Layers className="w-3 h-3" />
                {selectionCount}
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-surface-border bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg animate-fade-in">
          <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            Home
          </NavLink>
          <NavLink to="/explore" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            Explore Products
          </NavLink>
          <NavLink to="/compare" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <span>Compare Products</span>
            {selectionCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-blue text-white">
                {selectionCount} selected
              </span>
            )}
          </NavLink>
          <NavLink to="/saved" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <span>Saved Products</span>
            {savedCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-teal-600 text-white">
                {savedCount}
              </span>
            )}
          </NavLink>
          <NavLink to="/feedback" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            Feedback
          </NavLink>

          <div className="pt-4 border-t border-slate-100 mt-2">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl">
                  <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full bg-slate-200" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-hover rounded-xl shadow-sm transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
