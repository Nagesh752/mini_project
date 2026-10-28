import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { POPULAR_SEARCH_PROMPTS } from '../../data/products';

export const ExamplePrompts = ({
  onSelectPrompt,
  activePrompt = '',
  className = '',
}) => {
  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
        <span>Try these example prompts:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {POPULAR_SEARCH_PROMPTS.map((prompt, index) => {
          const isSelected = activePrompt.trim().toLowerCase() === prompt.trim().toLowerCase();

          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelectPrompt(prompt)}
              className={`group inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm rounded-full transition-all text-left ${
                isSelected
                  ? 'bg-blue-50 text-brand-blue border border-blue-300 font-medium shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 hover:text-brand-blue'
              }`}
            >
              <span>{prompt}</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-brand-blue transition-colors flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
