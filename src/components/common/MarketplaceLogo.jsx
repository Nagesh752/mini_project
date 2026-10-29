import React, { useState } from 'react';

/**
 * Resilient Marketplace Logo component
 * Renders verified retailer logos (Amazon, Flipkart, Apple, etc.)
 * with pixel-perfect SVG fallbacks in case remote CDN images are blocked or offline.
 */
export const MarketplaceLogo = ({
  name = 'Amazon India',
  logoUrl,
  className = '',
  size = 'md',
  showNameFallback = false
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  const normalized = (name || '').toLowerCase();

  // Size configurations
  const sizeClasses = {
    xs: 'h-3.5',
    sm: 'h-4',
    md: 'h-5',
    lg: 'h-7',
    xl: 'h-9',
  };

  const currentHeight = sizeClasses[size] || sizeClasses.md;

  // If external logoUrl is available and hasn't failed, render it
  if (logoUrl && !imageFailed) {
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className={`${currentHeight} w-auto object-contain inline-block transition-opacity ${className}`}
        onError={() => setImageFailed(true)}
        loading="lazy"
      />
    );
  }

  // Built-in Crisp SVG Vector Fallbacks
  if (normalized.includes('amazon')) {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`} title={name}>
        <svg
          viewBox="0 0 95 28"
          className={`${currentHeight} w-auto overflow-visible select-none`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Amazon"
        >
          {/* amazon text */}
          <text
            x="2"
            y="17"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="800"
            fontSize="18"
            fill="#131921"
            letterSpacing="-0.5px"
          >
            amazon
          </text>
          {/* .in subtext */}
          <text
            x="68"
            y="17"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="600"
            fontSize="10"
            fill="#E47911"
          >
            .in
          </text>
          {/* Distinctive Amazon smile arrow */}
          <path
            d="M 6 22 Q 40 31 74 21"
            stroke="#FF9900"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 70 18 L 76 21 L 71 24.5 Z"
            fill="#FF9900"
          />
        </svg>
      </div>
    );
  }

  if (normalized.includes('flipkart')) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`} title={name}>
        <svg
          viewBox="0 0 100 28"
          className={`${currentHeight} w-auto overflow-visible select-none`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Flipkart"
        >
          {/* Flipkart Yellow Shopping Bag with 'F' */}
          <rect x="2" y="4" width="18" height="20" rx="3.5" fill="#FFE11B" />
          <path d="M 6 4 C 6 1 16 1 16 4" stroke="#FFE11B" strokeWidth="2" fill="none" />
          <text
            x="8"
            y="19"
            fontFamily="sans-serif"
            fontWeight="900"
            fontStyle="italic"
            fontSize="14"
            fill="#2874F0"
          >
            f
          </text>
          {/* Flipkart brand text */}
          <text
            x="24"
            y="19"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="800"
            fontStyle="italic"
            fontSize="15"
            fill="#2874F0"
          >
            Flipkart
          </text>
        </svg>
      </div>
    );
  }

  if (normalized.includes('meesho')) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`} title={name}>
        <svg
          viewBox="0 0 95 28"
          className={`${currentHeight} w-auto overflow-visible select-none`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Meesho"
        >
          {/* Meesho Magenta Bag/Badge */}
          <rect x="2" y="3" width="22" height="22" rx="6" fill="#84226B" />
          <path
            d="M 8 18 L 8 10 C 8 8.5 10 8.5 11 10 L 13 13 L 15 10 C 16 8.5 18 8.5 18 10 L 18 18"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Meesho text */}
          <text
            x="28"
            y="19"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="800"
            fontSize="16"
            fill="#84226B"
            letterSpacing="-0.3px"
          >
            meesho
          </text>
        </svg>
      </div>
    );
  }

  if (normalized.includes('myntra')) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`} title={name}>
        <svg
          viewBox="0 0 95 28"
          className={`${currentHeight} w-auto overflow-visible select-none`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Myntra"
        >
          {/* Myntra M Icon */}
          <path d="M 4 20 L 9 8 L 13 16 L 17 8 L 22 20" stroke="#FF3F6C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <text
            x="26"
            y="19"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="800"
            fontSize="15"
            fill="#282C3F"
          >
            Myntra
          </text>
        </svg>
      </div>
    );
  }

  // Generic Retail Merchant Store Badge
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold ${className}`}>
      <svg
        className="w-3.5 h-3.5 text-brand-blue"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      {showNameFallback && <span>{name}</span>}
    </div>
  );
};
