import { interpretQuery } from './searchProducts';

/**
 * Multi-criteria ranking engine for user-selected products.
 * Strictly ranks ONLY the products passed in.
 */
export function rankSelectedProducts(products, queryOrInterpretation) {
  if (!products || products.length === 0) {
    return { topRecommendations: [], otherCompared: [], allRanked: [] };
  }

  // Resolve interpretation
  let interpretation;
  if (!queryOrInterpretation) {
    interpretation = { originalQuery: '', keySpecs: [] };
  } else if (typeof queryOrInterpretation === 'string') {
    interpretation = interpretQuery(queryOrInterpretation);
  } else {
    interpretation = queryOrInterpretation;
  }

  // Score each selected product
  const ranked = products.map(product => {
    // 1. Requirement Match (0 - 35 points)
    let requirementScore = 20; // baseline for being in user's comparison set
    const tagsLower = (product.tags || []).map(t => t.toLowerCase());
    const specsString = Object.values(product.specifications || {}).join(' ').toLowerCase();
    const highlights = [];

    if (interpretation.category && product.category === interpretation.category) {
      requirementScore += 5;
      highlights.push(`Direct match for category: ${interpretation.categoryLabel || interpretation.category}`);
    }

    if (interpretation.purpose) {
      if (interpretation.purpose.includes('Programming') && tagsLower.includes('coding')) {
        requirementScore += 5;
        highlights.push('Engineered for programming & multi-threaded compiler tasks');
      } else if (interpretation.purpose.includes('Photography') && tagsLower.includes('camera')) {
        requirementScore += 5;
        highlights.push('Exceptional camera optics and sensor tuning');
      } else if (interpretation.purpose.includes('Gaming') && tagsLower.includes('gaming')) {
        requirementScore += 5;
        highlights.push('High-performance GPU & high refresh panel');
      }
    }

    // 2. Budget Suitability (0 - 25 points)
    let budgetScore = 18;
    let budgetSuitability = 'Budget Friendly';

    if (interpretation.budgetLimit) {
      const budgetLimit = interpretation.budgetLimit;
      if (product.price <= budgetLimit) {
        const ratio = product.price / budgetLimit;
        if (ratio <= 0.8) {
          budgetScore = 25;
          budgetSuitability = 'Well Under Budget';
          highlights.push(`Save ₹${(budgetLimit - product.price).toLocaleString('en-IN')} below your ceiling`);
        } else {
          budgetScore = 24;
          budgetSuitability = 'Within Budget';
          highlights.push('Optimally maximizes features within stated budget');
        }
      } else {
        const excess = (product.price - budgetLimit) / budgetLimit;
        if (excess <= 0.15) {
          budgetScore = 14;
          budgetSuitability = 'Slightly Over Budget';
          highlights.push('Slightly above target budget, but offers higher durability/specs');
        } else {
          budgetScore = 8;
          budgetSuitability = 'Slightly Over Budget';
          highlights.push('Exceeds budget target; premium flagship tier');
        }
      }
    } else {
      if (product.price < 50000) {
        budgetScore = 22;
        budgetSuitability = 'Budget Friendly';
      } else {
        budgetScore = 20;
        budgetSuitability = 'Within Budget';
      }
    }

    // 3. Relevant Specifications (0 - 20 points)
    let specsScore = 12;
    // Check RAM
    if (specsString.includes('16gb') || tagsLower.includes('16gb')) {
      specsScore += 4;
      highlights.push('16GB RAM prevents memory bottlenecks');
    }
    // Check OLED or 4K or 165Hz
    if (specsString.includes('oled')) {
      specsScore += 3;
      highlights.push('Vivid OLED panel for superior contrast');
    }
    if (specsString.includes('165hz') || specsString.includes('144hz') || specsString.includes('120hz')) {
      specsScore += 2;
      highlights.push('High refresh rate reduces visual strain');
    }
    if (specsString.includes('pivot')) {
      specsScore += 3;
      highlights.push('90° vertical pivot stand ideal for viewing code');
    }
    if (specsString.includes('battery') && (specsString.includes('65wh') || specsString.includes('50 hours') || specsString.includes('65 hours'))) {
      specsScore += 3;
      highlights.push('Extended battery capacity');
    }
    specsScore = Math.min(20, specsScore);

    // 4. Product Rating (0 - 10 points)
    const userRatingScore = Math.min(10, Math.max(0, Math.round(((product.rating || 4) / 5) * 10)));
    highlights.push(`Rated ${product.rating || 4}★ across ${(product.reviewCount || 0).toLocaleString('en-IN')} verified customer reviews`);

    // 5. Value for Money (0 - 10 points)
    let valueScore = 7;
    let valueForMoney = 'Good';
    if (product.originalPrice && product.originalPrice > product.price) {
      const discountPercent = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      if (discountPercent >= 20) {
        valueScore = 10;
        valueForMoney = 'Exceptional';
        highlights.push(`${Math.round(discountPercent)}% promotional discount provides stellar price-to-performance`);
      } else {
        valueScore = 8;
        valueForMoney = 'Excellent';
      }
    } else {
      valueForMoney = 'Good';
    }

    // Total Score
    const totalScore = Math.min(
      100,
      Math.round(requirementScore + budgetScore + specsScore + userRatingScore + valueScore)
    );

    // Create concise transparent justification for rank
    let rankReason = '';
    if (budgetSuitability === 'Within Budget' || budgetSuitability === 'Well Under Budget') {
      rankReason = `Balanced performance, strong ${product.rating || 4}★ user satisfaction, and comfortably fits within ₹${(product.price || 0).toLocaleString('en-IN')}.`;
    } else {
      rankReason = `High-tier hardware specifications and premium build quality, delivering elevated longevity despite a slight budget stretch.`;
    }

    return {
      ...product,
      rank: 0, // will assign after sorting
      score: totalScore,
      isBestMatch: false,
      rankReason,
      matchHighlights: highlights.slice(0, 3),
      budgetSuitability,
      valueForMoney,
      scoreBreakdown: {
        requirementMatch: requirementScore,
        budgetSuitability: budgetScore,
        specifications: specsScore,
        userRating: userRatingScore,
        valueScore,
      },
    };
  });

  // Sort descending by score
  ranked.sort((a, b) => b.score - a.score);

  // Assign ranks & mark Best Match on #1
  ranked.forEach((item, index) => {
    item.rank = index + 1;
    if (index === 0) {
      item.isBestMatch = true;
      item.rankReason = `Top balanced choice: Highest overall score (${item.score}/100) combining strict requirement fulfillment, budget compliance, and verified user reliability.`;
    }
  });

  // Top recommendations logic according to exact user rules:
  // - If 5 selected: top 3 highlighted, 2 under otherCompared
  // - If 4 selected: top 3 highlighted, 1 under otherCompared
  // - If 3 selected: rank those 3 (otherCompared is empty)
  // - If 2 selected: rank only those 2 (otherCompared is empty)
  // Never add unselected products! Never invent a 3rd if < 3 selected!
  let topRecommendations = [];
  let otherCompared = [];

  if (ranked.length >= 4) {
    topRecommendations = ranked.slice(0, 3);
    otherCompared = ranked.slice(3);
  } else {
    topRecommendations = ranked;
    otherCompared = [];
  }

  return {
    topRecommendations,
    otherCompared,
    allRanked: ranked,
  };
}
