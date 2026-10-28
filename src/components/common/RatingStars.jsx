import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({
  rating = 0,
  reviewCount,
  size = 'sm',
  showNumber = true,
}) => {
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base font-medium',
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;

  return (
    <div className="inline-flex items-center gap-1.5" aria-label={`Rating: ${rating} out of 5 stars`}>
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map(starIndex => {
          const isFilled = starIndex <= fullStars;
          const isHalf = starIndex === fullStars + 1 && hasHalfStar;

          return (
            <Star
              key={starIndex}
              size={iconSizes[size] || 14}
              className={
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : isHalf
                  ? 'fill-amber-400 text-amber-400 opacity-60'
                  : 'fill-slate-200 text-slate-200'
              }
            />
          );
        })}
      </div>
      {showNumber && (
        <span className={`font-semibold text-content-primary ${textSizes[size] || textSizes.sm}`}>
          {Number(rating).toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={`text-content-secondary ${textSizes[size] || textSizes.sm}`}>
          ({Number(reviewCount).toLocaleString('en-IN')})
        </span>
      )}
    </div>
  );
};
