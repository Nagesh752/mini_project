const FEEDBACK_STORAGE_KEY = 'ai_shop_feedback_submissions';
const PRODUCT_FEEDBACK_KEY = 'ai_shop_product_feedback_session';
const SEARCH_FEEDBACK_KEY = 'ai_shop_search_feedback_session';

/**
 * Loads all submitted general feedbacks from localStorage
 */
export function getSavedFeedbacks() {
  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse feedback from localStorage', e);
    return [];
  }
}

/**
 * Saves a new general or contextual feedback submission
 */
export function saveFeedbackSubmission(feedback) {
  const newSubmission = {
    ...feedback,
    id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date().toISOString(),
  };

  const current = getSavedFeedbacks();
  current.unshift(newSubmission);

  try {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save feedback to localStorage', e);
  }

  return newSubmission;
}

/**
 * Tracks product sentiment feedback submitted during current session
 */
export function getSessionProductFeedback(productId) {
  try {
    const raw = sessionStorage.getItem(`${PRODUCT_FEEDBACK_KEY}_${productId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSessionProductFeedback(record) {
  try {
    sessionStorage.setItem(`${PRODUCT_FEEDBACK_KEY}_${record.productId}`, JSON.stringify(record));
    
    // Also record in general feedback storage for demonstration
    saveFeedbackSubmission({
      category: 'Product Recommendations',
      rating: record.choice === 'good' ? 5 : 2,
      message: record.reason || (record.choice === 'good' ? 'Marked as a good recommendation' : 'Marked as not relevant'),
      productId: record.productId,
      searchQuery: record.query,
      feedbackChoice: record.choice,
    });
  } catch (e) {
    console.error('Failed to record product feedback', e);
  }
}

/**
 * Tracks search results feedback submitted during current session
 */
export function saveSessionSearchFeedback(record) {
  try {
    sessionStorage.setItem(`${SEARCH_FEEDBACK_KEY}_${record.query}`, JSON.stringify(record));

    saveFeedbackSubmission({
      category: 'Search Results',
      rating: record.choice === 'helpful' ? 5 : 2,
      message: record.comment || (record.choice === 'helpful' ? 'Query understood accurately' : 'Search results could be improved'),
      searchQuery: record.query,
      feedbackChoice: record.choice,
    });
  } catch (e) {
    console.error('Failed to record search feedback', e);
  }
}

export function getSessionSearchFeedback(query) {
  try {
    const raw = sessionStorage.getItem(`${SEARCH_FEEDBACK_KEY}_${query}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
