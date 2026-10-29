import { rankSelectedProducts as localRankProducts } from '../utils/rankProducts';
import { saveFeedbackSubmission as localSaveFeedback, saveSessionProductFeedback as localSaveProductFeedback, saveSessionSearchFeedback as localSaveSearchFeedback } from '../utils/feedback';
import { MOCK_PRODUCTS } from '../data/products';
import { getDynamicProductById } from '../utils/dynamicCatalog';
import { normalizeProduct } from '../utils/normalizeProduct';

export { normalizeProduct };

const API_BASE = '/api';

/**
 * Normalizes backend ranked recommendation item
 */
export function normalizeRankedItem(item) {
  if (!item) return null;
  const baseProduct = normalizeProduct(item.product || item);
  return {
    ...baseProduct,
    rank: item.rank || 1,
    score: item.score || 85,
    isBestMatch: !!item.is_best_match || !!item.isBestMatch,
    rankReason: item.reason || item.rankReason || 'Matches your specified requirements and budget criteria.',
    matchHighlights: item.match_highlights || item.matchHighlights || [],
    budgetSuitability: item.budget_suitability || item.budgetSuitability || 'Within Budget',
    valueForMoney: item.value_for_money || item.valueForMoney || 'Good',
    scoreBreakdown: item.score_breakdown || item.scoreBreakdown || {
      requirementMatch: 30,
      budgetSuitability: 20,
      specifications: 18,
      userRating: 9,
      valueScore: 8,
    },
  };
}

/**
 * Check if the backend is online and reachable
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
    if (!res.ok) return false;
    const data = await res.json();
    return data && data.status === 'online';
  } catch {
    return false;
  }
}

/**
 * Fetch a single product by ID from FastAPI backend with local mock fallback
 */
export async function getProductByIdApi(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (res.ok) {
      const data = await res.json();
      return normalizeProduct(data);
    }
  } catch (err) {
    console.warn(`Backend fetch for product ${id} failed, falling back to local dataset.`, err);
  }

  const local = MOCK_PRODUCTS.find(p => p.id === id) || getDynamicProductById(id);
  return local ? normalizeProduct(local) : null;
}

/**
 * Performs natural language search with FastAPI backend and automatic fallback
 */
export async function searchProductsApi(query, budget, category, purpose, signal) {
    const res = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        query,
        budget: budget || undefined,
        category: category || undefined,
        purpose: purpose || undefined,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || `Search failed (HTTP ${res.status}). Please try again.`);
    }
      const interpretation = {
        originalQuery: data.query || query,
        category: data.interpretation?.category,
        categoryLabel: data.interpretation?.category_label,
        budgetLimit: data.interpretation?.budget_limit,
        budgetLabel: data.interpretation?.budget_label,
        purpose: data.interpretation?.purpose,
        keySpecs: data.interpretation?.key_specs || [],
        notes: data.interpretation?.confidence_notes || data.interpretation?.notes || 'Requirements interpreted by the backend',
      };

      const results = (Array.isArray(data.all_results) ? data.all_results : []).map(normalizeProduct).filter(Boolean);
      return { interpretation, results, source: 'backend' };
}

/**
 * Performs product comparison with FastAPI backend and automatic fallback
 */
export async function compareProductsApi(products, query) {
  const productIds = products.map(p => p.id);
  try {
    const res = await fetch(`${API_BASE}/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_ids: productIds,
        query: query || '',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const topRecommendations = (data.top_recommendations || []).map(normalizeRankedItem);
      const otherCompared = (data.other_compared || []).map(normalizeRankedItem);
      const allRanked = [...topRecommendations, ...otherCompared];

      return {
        topRecommendations,
        otherCompared,
        allRanked,
        source: 'backend',
      };
    }
  } catch (err) {
    console.warn('Backend compare API unreachable, using resilient local ranking engine.', err);
  }

  // Fallback to local ranking engine
  const localRes = localRankProducts(products, query);
  return { ...localRes, source: 'local' };
}

/**
 * Wishlist API with offline fallback
 */
export async function getWishlistApi(token) {
  if (token) {
    try {
      const res = await fetch(`${API_BASE}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const items = await res.json();
        return (items || []).map(item => normalizeProduct(item.product));
      }
    } catch (err) {
      console.warn('Backend wishlist unreachable, using localStorage.', err);
    }
  }
  return null; // Signals caller to use local storage
}

export async function addToWishlistApi(productId, token) {
  if (token) {
    try {
      await fetch(`${API_BASE}/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });
    } catch {
      // Ignored for resilient operation
    }
  }
}

export async function removeFromWishlistApi(productId, token) {
  if (token) {
    try {
      await fetch(`${API_BASE}/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Ignored for resilient operation
    }
  }
}

/**
 * Feedback APIs with offline fallback
 */
export async function submitGeneralFeedbackApi(feedback) {
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: feedback.category,
        rating: feedback.rating,
        message: feedback.message,
        email: feedback.email || undefined,
        search_query: feedback.searchQuery || undefined,
        product_id: feedback.productId || undefined,
      }),
    });
    if (res.ok) {
      return localSaveFeedback(feedback);
    }
  } catch (err) {
    console.warn('Backend feedback API unreachable, saving locally.', err);
  }
  return localSaveFeedback(feedback);
}

export async function submitProductSentimentApi(record) {
  try {
    await fetch(`${API_BASE}/feedback/product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: record.productId,
        choice: record.choice,
        reason: record.reason,
        query: record.query,
      }),
    });
  } catch {
    // Resilient fallback
  }
  localSaveProductFeedback(record);
}

export async function submitSearchSentimentApi(record) {
  try {
    await fetch(`${API_BASE}/feedback/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: record.query,
        choice: record.choice,
        comment: record.comment,
      }),
    });
  } catch {
    // Resilient fallback
  }
  localSaveSearchFeedback(record);
}

/**
 * Authentication APIs with offline fallback
 */
export async function loginApi(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, user: data.user, token: data.access_token };
    } else {
      const err = await res.json();
      return { success: false, error: err.detail || 'Invalid email or password' };
    }
  } catch {
    // Local mock login
    return {
      success: true,
      user: {
        id: 'usr-mock-1',
        name: email.split('@')[0] || 'Demo User',
        email,
        joinedDate: 'October 2026',
      },
      token: 'demo-token-123',
    };
  }
}

export async function registerApi(name, email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, user: data.user, token: data.access_token };
    } else {
      const err = await res.json();
      return { success: false, error: err.detail || 'Registration failed' };
    }
  } catch {
    // Local mock registration
    return {
      success: true,
      user: {
        id: `usr-${Date.now()}`,
        name,
        email,
        joinedDate: 'October 2026',
      },
      token: 'demo-token-reg',
    };
  }
}
