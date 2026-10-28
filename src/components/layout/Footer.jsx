import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ShieldCheck, HelpCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-surface-border bg-white text-content-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/shopmind-logo.png"
                alt="ShopMind AI Logo"
                className="w-8 h-8 rounded-lg object-cover shadow-xs group-hover:scale-105 transition-transform"
              />
              <span className="font-extrabold text-lg text-content-primary">ShopMind AI</span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500">
              Simplifying e-commerce shopping with natural language understanding. Tell us your needs and budget — we discover and compare the best products for you.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Smart Semantic Discovery Prototype</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-content-primary uppercase tracking-wider mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-blue transition-colors">
                  Home Landing
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-brand-blue transition-colors">
                  Explore Catalog
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-brand-blue transition-colors">
                  Product Comparison
                </Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-brand-blue transition-colors">
                  Saved Products
                </Link>
              </li>
            </ul>
          </div>

          {/* User Feedback & Support */}
          <div>
            <h4 className="text-xs font-semibold text-content-primary uppercase tracking-wider mb-3">
              Feedback & Help
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/feedback" className="hover:text-brand-blue transition-colors">
                  Give Feedback
                </Link>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={e => {
                    e.preventDefault();
                    window.location.href = '/#how-it-works';
                  }}
                  className="hover:text-brand-blue transition-colors"
                >
                  How AI Discovery Works
                </a>
              </li>
              <li>
                <Link to="/account" className="hover:text-brand-blue transition-colors">
                  My Profile & History
                </Link>
              </li>
            </ul>
          </div>

          {/* Prototype Notice */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <HelpCircle className="w-4 h-4 text-brand-blue flex-shrink-0" />
              <span>College Project Notice</span>
            </div>
            <p className="text-slate-500 leading-normal">
              This application is a responsive frontend prototype. Recommendation ranking and natural language parsing are simulated client-side using deterministic scoring heuristics and local mock catalog data.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} ShopMind AI. Built with React & Tailwind CSS.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for academic evaluation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
