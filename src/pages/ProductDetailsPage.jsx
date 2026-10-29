import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Plus,
  Check,
  Sparkles,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/products';
import { formatINR, calculateDiscount } from '../utils/formatCurrency';
import { RatingStars } from '../components/common/RatingStars';
import { MarketplaceLogo } from '../components/common/MarketplaceLogo';
import { useCompare } from '../context/CompareContext';
import { useSaved } from '../context/SavedContext';
import { useSearchHistory } from '../context/SearchHistoryContext';
import { ProductFeedbackWidget } from '../components/feedback/ProductFeedbackWidget';
import { getProductByIdApi } from '../services/api';
import { getDynamicProductById } from '../utils/dynamicCatalog';
import { getProductDestination } from '../utils/productLinks';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isCompared, addToCompare, removeFromCompare, limitReached } = useCompare();
  const { isSaved, toggleSave } = useSaved();
  const { addRecentlyViewed } = useSearchHistory();

  const [product, setProduct] = useState(() => MOCK_PRODUCTS.find(p => p.id === id) || getDynamicProductById(id));
  const [isLoading, setIsLoading] = useState(!product);

  useEffect(() => {
    let isMounted = true;
    if (!product || product.id !== id) {
      getProductByIdApi(id).then(res => {
        if (isMounted) {
          if (res) setProduct(res);
          setIsLoading(false);
        }
      });
    }
    return () => { isMounted = false; };
  }, [id]);

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
      window.scrollTo(0, 0);
    }
  }, [product?.id]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-28 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-500">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 text-sm">
          The requested product ID does not exist in our catalog.
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const compared = isCompared(product.id);
  const saved = isSaved(product.id);
  const discount = calculateDiscount(product.originalPrice, product.price);

  const marketplaceName = product.marketplace?.name || 'Seller';
  const marketplaceLogoUrl = product.marketplace?.logo_url;
  const productDestination = getProductDestination(product);
  const isLiveShoppingResult = product.source === 'serpapi-google-shopping';

  const handleCompareClick = () => {
    if (compared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const specs = product.specifications || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-28">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous page</span>
        </button>
      </div>

      {/* Main Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Large Product Image */}
        <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl bg-slate-100 overflow-hidden border border-surface-border shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-800 rounded-lg shadow-sm">
              {product.brand}
            </span>
            {discount > 0 && (
              <span className="px-3 py-1 text-xs font-bold text-white bg-emerald-600 rounded-lg shadow-sm">
                {discount}% OFF
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => toggleSave(product.id)}
            className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all z-10 ${
              saved
                ? 'bg-rose-50 text-rose-600 shadow-sm'
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-600 shadow-xs'
            }`}
            aria-label={saved ? 'Remove from saved' : 'Save product'}
          >
            <Heart className={`w-5 h-5 ${saved ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                {(product.category || '').toUpperCase()}{product.inStock ? ' IN STOCK' : ''}
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                <MarketplaceLogo name={marketplaceName} logoUrl={marketplaceLogoUrl} size="xs" />
                {marketplaceName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-content-primary leading-tight">
              {product.name}
            </h1>
            {product.rating > 0 && <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />}
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-extrabold text-content-primary tracking-tight">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-3 text-sm text-slate-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
              <p className="text-xs text-slate-500 mt-1">Listed price from seller</p>
            </div>
            {discount > 0 && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                Save {formatINR(product.originalPrice - product.price)}
              </span>
            )}
          </div>

          {/* Verified Marketplace Retailer Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 via-amber-50/20 to-blue-50/20 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-center">
                <MarketplaceLogo
                  name={marketplaceName}
                  logoUrl={marketplaceLogoUrl}
                  size="md"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">
                    Listed on {marketplaceName}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Seller-provided details may be incomplete.</p>
              </div>
            </div>

            {productDestination.href ? (
              <a href={productDestination.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:text-brand-blue-hover self-start sm:self-auto hover:underline" title={productDestination.label}><span>{productDestination.label}</span><ExternalLink className="w-3 h-3" /></a>
            ) : (
              <span className="text-xs text-slate-500 self-start sm:self-auto">Product link unavailable</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handleCompareClick}
              disabled={limitReached && !compared}
              className={`inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-sm font-semibold transition-all shadow-xs ${
                compared
                  ? 'bg-blue-50 text-brand-blue border border-brand-blue hover:bg-blue-100'
                  : limitReached
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                  : 'bg-brand-blue text-white hover:bg-brand-blue-hover hover:shadow-sm'
              }`}
            >
              {compared ? (
                <>
                  <Check className="w-4 h-4 text-brand-blue" />
                  <span>In Comparison List (Added)</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Compare</span>
                </>
              )}
            </button>

            {/* Direct External Link to Original Product on Retailer Website */}
            {productDestination.href ? (
              <a id="view-original-product-btn" href={productDestination.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 shadow-xs hover:shadow-sm transition-all" title={productDestination.label}>
                <MarketplaceLogo name={marketplaceName} logoUrl={marketplaceLogoUrl} size="sm" />
                <span className="truncate">{productDestination.label}</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            ) : (
              <button type="button" disabled className="py-3.5 px-5 rounded-xl text-sm text-slate-400 bg-slate-50 border border-slate-200">Product link unavailable</button>
            )}
          </div>

          {/* Inline Product Sentiment Feedback */}
          <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <ProductFeedbackWidget
              productId={product.id}
              productName={product.name}
            />
          </div>

          {/* Value Props */}
          <div className={`grid grid-cols-3 gap-3 pt-2 text-center text-xs text-slate-600 ${isLiveShoppingResult ? 'hidden' : ''}`}>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <Truck className="w-4 h-4 mx-auto text-brand-blue" />
              <p className="font-semibold">Simulated Fast Delivery</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <ShieldCheck className="w-4 h-4 mx-auto text-teal-600" />
              <p className="font-semibold">Brand Warranty</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <RotateCcw className="w-4 h-4 mx-auto text-purple-600" />
              <p className="font-semibold">7-Day Return Policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* “Why This Matches Your Needs” Section */}
      <section className={`bg-gradient-to-br from-blue-50/70 via-teal-50/40 to-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-4 ${isLiveShoppingResult ? 'hidden' : ''}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-blue text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-content-primary">
              Why This Matches Your Needs
            </h2>
            <p className="text-xs text-content-secondary">
              Simulated contextual match assessment based on user profile and shopping intent.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-blue">Core Strength</p>
            <p className="text-xs text-slate-700 leading-relaxed">
              {(product.pros || [])[0] || 'High build quality and verified reliability'}
            </p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-600">Hardware Readiness</p>
            <p className="text-xs text-slate-700 leading-relaxed">
              Equipped with {specs.processor || specs.driverSize || 'High efficiency architecture'} and {specs.ram || specs.battery || 'Extended operation'}.
            </p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-purple-600">Price-to-Value</p>
            <p className="text-xs text-slate-700 leading-relaxed">
              Offered at {formatINR(product.price)} with a strong {product.rating}★ rating from over {(product.reviewCount || 0).toLocaleString('en-IN')} verified owners.
            </p>
          </div>
        </div>
      </section>

      {/* Full Description & Pros and Cons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Description & Features */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-content-primary">Product Overview</h3>
            <p className="text-sm text-content-secondary leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-content-primary">Key Capabilities</h3>
            <ul className="space-y-2">
              {(product.features || []).map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Full Specifications Table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-bold text-content-primary">Technical Specifications</h3>
            <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(product.specifications || {}).map(([key, val]) => {
                    if (!val) return null;
                    return (
                      <tr key={key} className="hover:bg-slate-50/50">
                        <td className="p-3.5 font-semibold text-slate-500 capitalize bg-slate-50/60 w-1/3">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </td>
                        <td className="p-3.5 text-slate-800 font-medium">{val}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pros & Cons Card */}
        <div className="space-y-6">
          {/* Pros */}
          <div className={`bg-emerald-50/40 rounded-2xl border border-emerald-200/60 p-5 space-y-3 ${isLiveShoppingResult ? 'hidden' : ''}`}>
            <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified Strengths</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {(product.pros || []).map((pro, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className={`bg-amber-50/40 rounded-2xl border border-amber-200/60 p-5 space-y-3 ${isLiveShoppingResult ? 'hidden' : ''}`}>
            <h4 className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Trade-offs to Keep in Mind</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {(product.cons || []).map((con, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
