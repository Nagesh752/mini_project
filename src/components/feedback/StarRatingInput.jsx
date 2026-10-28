import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRatingInput = ({
  value = 0,
  onChange,
  disabled = false,
}) => {
  const [hoverRating, setHoverRating] = useState(null);

  const starLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Exceptional'];
  const displayRating = hoverRating !== null ? hoverRating : value;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map(star => {
          const isFilled = star <= displayRating;

          return (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className="p-1 rounded-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-transform"
              aria-label={`Rate ${star} out of 5 stars (${starLabels[star]})`}
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-100 text-slate-300 hover:text-amber-300'
                }`}
              />
            </button>
          );
        })}

        {displayRating > 0 && (
          <span className="ml-2 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
            {starLabels[displayRating]} ({displayRating} / 5)
          </span>
        )}
      </div>
    </div>
  );
};
