import { MOCK_PRODUCTS } from '../data/products';
import { generateDynamicProductsForQuery } from './dynamicCatalog';

/**
 * Parses a natural language search query and extracts structured requirements
 * (Simulating an AI requirement extraction pipeline)
 */
export function interpretQuery(query) {
  const normalized = (query || '').toLowerCase();

  // 1. Detect Category
  let category = undefined;
  let categoryLabel = undefined;

  if (/(laptop|notebook|macbook|ultrabook|pc)/i.test(normalized)) {
    category = 'laptop';
    categoryLabel = 'Laptops & Ultrabooks';
  } else if (/(phone|smartphone|mobile|android|iphone|pixel|galaxy)/i.test(normalized)) {
    category = 'smartphone';
    categoryLabel = 'Smartphones & Mobiles';
  } else if (/(headphone|earphone|audio|earbuds|anc|sound|tws)/i.test(normalized)) {
    category = 'headphones';
    categoryLabel = 'Headphones & Audio';
  } else if (/(monitor|screen|display|panel)/i.test(normalized)) {
    category = 'monitor';
    categoryLabel = 'Monitors & Displays';
  } else if (/kurta|kurti|ethnic|sherwani|dhoti|saree|lehenga/i.test(normalized)) {
    category = 'ethnic-wear';
    categoryLabel = "Men's & Ethnic Fashion";
  } else if (/shoe|sneaker|footwear|running|loafer/i.test(normalized)) {
    category = 'footwear';
    categoryLabel = 'Footwear & Shoes';
  } else if (/watch|smartwatch|chronograph/i.test(normalized)) {
    category = 'smartwatch';
    categoryLabel = 'Watches & Wearables';
  } else if (/shirt|t-shirt|jeans|clothing|apparel|dress/i.test(normalized)) {
    category = 'fashion';
    categoryLabel = 'Fashion & Apparel';
  }

  // 2. Detect Budget Constraint
  let budgetLimit = null;
  let budgetLabel = undefined;

  // Pattern matches: "under 60,000", "under ₹60000", "< 60k", "below 15,000", "under 15k", "within 50000"
  const budgetMatches = [
    /(?:under|below|less than|within|up to|budget of|max)\s*(?:rs\.?|inr|₹)?\s*(\d{1,3}(?:,\d{3})+|\d+)(?:\s*(k|thousand|lakh))?/i,
    /(?:rs\.?|inr|₹)\s*(\d{1,3}(?:,\d{3})+|\d+)\s*(?:budget|or less|max)?/i,
    /(\d+)\s*k\s*(?:budget|laptop|phone|monitor|headphones)?/i,
  ];

  for (const pattern of budgetMatches) {
    const match = normalized.match(pattern);
    if (match) {
      let rawVal = match[1].replace(/,/g, '');
      let num = parseFloat(rawVal);
      const suffix = match[2]?.toLowerCase();

      if (suffix === 'k' || (!suffix && num < 1000 && num > 5)) {
        num = num * 1000;
      } else if (suffix === 'lakh') {
        num = num * 100000;
      }

      if (num > 1000) {
        budgetLimit = num;
        budgetLabel = `Up to ₹${num.toLocaleString('en-IN')}`;
        break;
      }
    }
  }

  // 3. Detect Purpose / Use Case
  let purpose = undefined;
  if (/(coding|programming|developer|software|compile|vscode|python)/i.test(normalized)) {
    purpose = 'Software Development & Programming';
  } else if (/(gaming|gamer|rtx|fps|games)/i.test(normalized)) {
    purpose = 'Gaming & High Performance';
  } else if (/(camera|photography|photos|portrait|video|selfie)/i.test(normalized)) {
    purpose = 'Photography & Content Creation';
  } else if (/(student|college|school|study|office|work)/i.test(normalized)) {
    purpose = 'College, Productivity & Daily Work';
  } else if (/(travel|commute|flight|noise|silence)/i.test(normalized)) {
    purpose = 'Commuting & Travel (Focus Mode)';
  }

  // 4. Detect Specific Key Specs
  const keySpecs = [];

  // RAM
  const ramMatch = normalized.match(/(\d{1,2})\s*(?:gb)?\s*ram/i) || normalized.match(/(\d{1,2})gb/i);
  if (ramMatch && parseInt(ramMatch[1], 10) >= 8) {
    keySpecs.push(`${ramMatch[1]}GB RAM`);
  }

  // Battery
  if (/(battery|long battery|endurance|battery life|playback)/i.test(normalized)) {
    keySpecs.push('Long Battery Endurance');
  }

  // Display / Refresh Rate / OLED
  if (/oled/i.test(normalized)) keySpecs.push('OLED Display');
  if (/4k|uhd/i.test(normalized)) keySpecs.push('4K UHD Resolution');
  if (/120hz|144hz|165hz|high refresh/i.test(normalized)) keySpecs.push('High Refresh Rate');
  if (/pivot|vertical/i.test(normalized)) keySpecs.push('90° Vertical Pivot Stand');
  if (/anc|noise cancel/i.test(normalized)) keySpecs.push('Active Noise Cancellation');
  if (/lightweight|thin|portable/i.test(normalized)) keySpecs.push('Lightweight & Portable');

  return {
    originalQuery: query,
    category,
    categoryLabel,
    budgetLimit,
    budgetLabel,
    purpose,
    keySpecs,
    notes: 'Parsed via simulated on-device semantic intent extractor',
  };
}

/**
 * Searches and scores mock products based on a natural language query
 */
export function searchProducts(query) {
  const trimmed = (query || '').trim();
  if (!trimmed) {
    return {
      interpretation: {
        originalQuery: '',
        keySpecs: [],
      },
      results: MOCK_PRODUCTS,
    };
  }

  const interpretation = interpretQuery(trimmed);
  const searchWords = trimmed.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  // Score each product
  const scored = MOCK_PRODUCTS.map(product => {
    let score = 0;
    const nameLower = product.name.toLowerCase();
    const brandLower = product.brand.toLowerCase();
    const descLower = product.description.toLowerCase();
    const tagsLower = product.tags.map(t => t.toLowerCase());
    const specsString = Object.values(product.specifications || {}).join(' ').toLowerCase();

    // Category match
    if (interpretation.category) {
      if (product.category === interpretation.category) {
        score += 50;
      } else {
        score -= 40; // Deprioritize wrong category
      }
    }

    // Budget match
    if (interpretation.budgetLimit) {
      if (product.price <= interpretation.budgetLimit) {
        // Within budget bonus
        score += 30;
        const budgetRatio = product.price / interpretation.budgetLimit;
        if (budgetRatio >= 0.7 && budgetRatio <= 1.0) {
          score += 10;
        }
      } else {
        // Over budget penalty
        const excessPercent = (product.price - interpretation.budgetLimit) / interpretation.budgetLimit;
        score -= excessPercent > 0.25 ? 40 : 15;
      }
    }

    // Purpose match
    if (interpretation.purpose) {
      if (interpretation.purpose.includes('Programming') && tagsLower.includes('coding')) {
        score += 25;
      }
      if (interpretation.purpose.includes('Photography') && tagsLower.includes('camera')) {
        score += 25;
      }
      if (interpretation.purpose.includes('Gaming') && tagsLower.includes('gaming')) {
        score += 25;
      }
    }

    // Key specs matching
    for (const spec of interpretation.keySpecs) {
      if (spec.includes('16GB') && (specsString.includes('16gb') || tagsLower.includes('16gb'))) {
        score += 20;
      }
      if (spec.includes('Battery') && (descLower.includes('battery') || tagsLower.includes('battery'))) {
        score += 15;
      }
      if (spec.includes('OLED') && specsString.includes('oled')) {
        score += 20;
      }
      if (spec.includes('Pivot') && specsString.includes('pivot')) {
        score += 20;
      }
      if (spec.includes('Noise Cancellation') && specsString.includes('noise')) {
        score += 20;
      }
    }

    // Keyword matching
    for (const word of searchWords) {
      if (['the', 'and', 'with', 'for', 'under', 'need', 'want', 'looking'].includes(word)) continue;
      if (nameLower.includes(word)) score += 12;
      if (brandLower.includes(word)) score += 15;
      if (tagsLower.includes(word)) score += 10;
      if (descLower.includes(word)) score += 6;
      if (specsString.includes(word)) score += 8;
    }

    // Rating boost
    score += (product.rating || 4) * 2;

    return { product, score };
  });

  // Filter out negative/irrelevant scores and sort descending
  const matching = scored
    .filter(item => item.score > 20)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);

  // If query had a specific category but none matched high score, fallback to category items
  if (matching.length === 0 && interpretation.category) {
    const categoryFallback = MOCK_PRODUCTS.filter(p => p.category === interpretation.category);
    if (categoryFallback.length > 0) {
      return {
        interpretation,
        results: categoryFallback,
      };
    }
  }

  // If still no results, dynamically generate authentic products across Amazon, Flipkart, and Meesho
  if (matching.length === 0) {
    const dynamicResults = generateDynamicProductsForQuery(trimmed, interpretation.budgetLimit);
    if (dynamicResults && dynamicResults.length > 0) {
      return {
        interpretation,
        results: dynamicResults,
      };
    }
  }

  return {
    interpretation,
    results: matching,
  };
}
