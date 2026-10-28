import React from 'react';
import { Cpu, DollarSign, Target, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { Badge } from '../common/Badge';

export const QueryInterpretationBadge = ({
  interpretation = {},
  totalFound = 0,
}) => {
  const hasExtractedParams =
    interpretation.categoryLabel ||
    interpretation.budgetLabel ||
    interpretation.purpose ||
    (interpretation.keySpecs && interpretation.keySpecs.length > 0);

  return (
    <div className="bg-white rounded-2xl border border-blue-100 p-4 sm:p-5 shadow-sm space-y-3.5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-content-primary flex items-center gap-2">
              <span>Simulated AI Requirement Analysis</span>
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                Natural Language Parsed
              </span>
            </h3>
            <p className="text-xs text-content-secondary">
              Extracted constraints from: &ldquo;<span className="italic text-slate-800 font-medium">{interpretation.originalQuery}</span>&rdquo;
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium self-start sm:self-auto">
          Found <span className="font-bold text-slate-900">{totalFound}</span> matching {totalFound === 1 ? 'product' : 'products'}
        </div>
      </div>

      {hasExtractedParams ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Target Category */}
          {interpretation.categoryLabel && (
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <Cpu className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Category</span>
                <span className="font-medium text-slate-800">{interpretation.categoryLabel}</span>
              </div>
            </div>
          )}

          {/* Budget */}
          {interpretation.budgetLabel && (
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <DollarSign className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Budget Ceiling</span>
                <span className="font-medium text-slate-800">{interpretation.budgetLabel}</span>
              </div>
            </div>
          )}

          {/* Purpose */}
          {interpretation.purpose && (
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <Target className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Intended Purpose</span>
                <span className="font-medium text-slate-800">{interpretation.purpose}</span>
              </div>
            </div>
          )}

          {/* Key Specs */}
          {interpretation.keySpecs && interpretation.keySpecs.length > 0 && (
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 sm:col-span-2 lg:col-span-1">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Key Specs Identified</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {interpretation.keySpecs.map((spec, i) => (
                    <Badge key={i} variant="neutral" size="sm">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs text-slate-500 py-1 flex items-center gap-2">
          <span>Broad search intent detected across catalog. Showing all available matches.</span>
        </div>
      )}
    </div>
  );
};
