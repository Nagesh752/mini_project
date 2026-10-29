import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Check, Plus, ArrowRight } from 'lucide-react';
import { formatINR, calculateDiscount } from '../../utils/formatCurrency';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';
import { MarketplaceLogo } from '../common/MarketplaceLogo';
import { useCompare } from '../../context/CompareContext';
import { useSaved } from '../../context/SavedContext';
import { ProductFeedbackWidget } from '../feedback/ProductFeedbackWidget';

export const ProductCard = ({
  product,
  searchQuery,
  showFeedback = true,
}) => {
  const { isCompared, addToCompare, removeFromCompare, limitReached } = useCompare();
  const { isSaved, toggleSave } = useSaved();
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const compared = isCompared(product.id);
  const saved = isSaved(product.id);
  const discount = calculateDiscount(product.originalPrice, product.price);

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (compared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(product.id);
  };

  // Safe fallback placeholder SVG if Unsplash image fails or is blocked
  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="%23f1f5f9"><rect width="400" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%2394a3b8">${encodeURIComponent(
    (product.name || '').slice(0, 24)
  )}</text></svg>`;

  const specs = product.specifications || {};

  const marketplaceName = typeof product.marketplace === 'object'
    ? product.marketplace?.name
    : (product.marketplace || null);

  const marketplaceLogo = typeof product.marketplace === 'object'
    ? product.marketplace?.logo_url
    : null;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-surface-border hover:border-slate-300 hover:shadow-card transition-all duration-200 overflow-hidden">
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-50 overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={imageError ? fallbackSvg : (product.image || fallbackSvg)}
            alt={product.name || 'Product'}
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Brand Tag & Discount Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          {product.brand && (
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-slate-800 rounded-md shadow-xs">
              {product.brand}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-0.5 text-[11px] font-bold text-white bg-emerald-600 rounded-md shadow-xs">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Save Bookmark Button */}
        <button
          type="button"
          onClick={handleSaveClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 focus:outline-none focus:ring-2 focus:ring-brand-blue ${
            saved
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 text-slate-500 hover:bg-white hover:text-rose-600 shadow-xs'
          }`}
          title={saved ? 'Remove from Saved' : 'Save Product'}
          aria-label={saved ? `Remove ${product.name || 'item'} from saved` : `Save ${product.name || 'item'}`}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-rose-600' : ''}`} />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Rating */}
          {product.rating > 0 && (
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
          )}

          {/* Product Title */}
          <Link to={`/product/${product.id}`} className="block group-hover:text-brand-blue transition-colors">
            <h3 className="font-semibold text-base text-content-primary line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Price & Marketplace Section */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-content-primary tracking-tight">
                {formatINR(product.price || 0)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>

            {marketplaceName && (
              <div
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/60 text-[11px] font-semibold text-slate-600 shadow-2xs"
                title={`Available on ${marketplaceName}`}
              >
                <MarketplaceLogo
                  name={marketplaceName}
                  logoUrl={marketplaceLogo}
                  size="xs"
                />
                <span className="truncate max-w-[80px]">{marketplaceName}</span>
              </div>
            )}
          </div>

          {/* Key Specs Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {specs.ram && (
              <Badge variant="neutral" size="sm">
                {String(specs.ram).split(' ')[0]} RAM
              </Badge>
            )}
            {specs.processor && (
              <Badge variant="neutral" size="sm">
                {String(specs.processor).split('(')[0].trim().slice(0, 18)}
              </Badge>
            )}
            {specs.battery && (
              <Badge variant="neutral" size="sm">
                {String(specs.battery).split('(')[0].trim()}
              </Badge>
            )}
            {specs.display && (
              <Badge variant="neutral" size="sm">
                {String(specs.display).includes('OLED') ? 'OLED Display' : 'FHD IPS'}
              </Badge>
            )}
            {specs.driverSize && (
              <Badge variant="neutral" size="sm">
                {String(specs.driverSize).split(' ')[0]} Drivers
              </Badge>
            )}
            {specs.fabric && (
              <Badge variant="neutral" size="sm">
                {String(specs.fabric).split(' ')[0]} Fabric
              </Badge>
            )}
            {specs.occasion && (
              <Badge variant="neutral" size="sm">
                {String(specs.occasion).split(',')[0].trim()}
              </Badge>
            )}
            {specs.soleMaterial && (
              <Badge variant="neutral" size="sm">
                {String(specs.soleMaterial).split(' ')[0]} Sole
              </Badge>
            )}
            {specs.closure && (
              <Badge variant="neutral" size="sm">
                {String(specs.closure).split(' ')[0]}
              </Badge>
            )}
            {specs.waterResistance && (
              <Badge variant="neutral" size="sm">
                {String(specs.waterResistance).split(' ')[0]}
              </Badge>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed pt-1">
              {product.description}
            </p>
          )}
        </div>

        {/* Actions & Feedback */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          {/* Comparison and View Details Action Bar */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCompareClick}
              disabled={limitReached && !compared}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                compared
                  ? 'bg-blue-50 text-brand-blue border border-brand-blue/30 hover:bg-blue-100'
                  : limitReached
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
              title={limitReached && !compared ? 'Max 5 products selected for comparison' : undefined}
            >
              {compared ? (
                <>
                  <Check className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Compare</span>
                </>
              )}
            </button>

            <Link
              to={`/product/${product.id}`}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-brand-blue rounded-xl border border-slate-200 transition-colors"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* In-Card Feedback Widget */}
          {showFeedback && (
            <ProductFeedbackWidget
              productId={product.id}
              productName={product.name}
              query={searchQuery}
            />
          )}
        </div>
      </div>
    </div>
  );
};
