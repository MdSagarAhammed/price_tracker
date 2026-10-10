export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://openapi.programming-hero.com/api/bazardor').replace(/\/$/, '');

export function toEnglishDigits(value) {
  return String(value ?? '').replace(/[০-৯]/g, d => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
}
export function numberValue(value) {
  const n = Number(toEnglishDigits(value).replace(/[৳টাকা,\s]/g, '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
export function formatPrice(value) {
  if (value === null || value === undefined || value === '') return 'দাম পাওয়া যায়নি';
  return `${Math.round(numberValue(value)).toLocaleString('bn-BD')} টাকা`;
}


export function extractList(payload, preferredKeys = []) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  const keys = [...preferredKeys, 'data', 'result', 'results', 'items', 'records', 'products', 'categories', 'docs'];
  for (const key of keys) {
    if (payload[key] !== undefined) {
      const found = extractList(payload[key], preferredKeys);
      if (found.length) return found;
    }
  }
  return [];
}
const first = (obj, keys) => {
  for (const key of keys) if (obj?.[key] !== undefined && obj?.[key] !== null && obj?.[key] !== '') return obj[key];
  return undefined;
};
export function normalizeCategory(c = {}) {
  const rawSlug = first(c, ['slug', 'categorySlug', 'category_slug', 'key', 'id', '_id', 'categoryId', 'category_id']);
  const name = first(c, ['name', 'title', 'label', 'categoryName', 'category_name', 'nameBn', 'name_bn', 'bnName', 'bn_name']);
  return { ...c, slug: rawSlug == null ? undefined : String(rawSlug), name, emoji: first(c, ['emoji', 'icon', 'symbol']) };
}
export function normalizeProduct(p = {}) {
  const first = (obj, keys) => {
    for (const key of keys) {
      const value = obj?.[key];
      if (value !== undefined && value !== null && value !== '') return value;
    }
    return undefined;
  };
  const rawCategory = first(p, ['category', 'categorySlug', 'category_slug', 'categoryName', 'category_name', 'categoryId', 'category_id']);
  const categoryObject = rawCategory && typeof rawCategory === 'object' ? rawCategory : null;
  const category = categoryObject ? first(categoryObject, ['slug', 'id', '_id', 'name', 'title']) : rawCategory;
  const categoryName = first(p, ['categoryNameBn', 'category_name_bn', 'categoryName', 'category_name', 'categoryTitle', 'category_title']) ?? (categoryObject ? first(categoryObject, ['nameBn', 'name_bn', 'name', 'title', 'label']) : undefined);

  // The supplied API schema uses `today`, `yesterday`, and `change: {dir, pct}`.
  const rawPrice = first(p, ['today', 'price', 'currentPrice', 'current_price', 'todayPrice', 'today_price', 'priceToday', 'price_today', 'averagePrice', 'average_price', 'avg_price', 'avgPrice', 'pricePerUnit', 'price_per_unit', 'unitPrice', 'unit_price', 'marketPrice', 'market_price', 'today_price_bdt', 'price_bdt', 'latestPrice', 'latest_price', 'pricePerKg', 'price_per_kg', 'rate', 'amount']);
  const price = rawPrice && typeof rawPrice === 'object'
    ? first(rawPrice, ['average', 'avg', 'amount', 'value', 'current', 'today', 'price', 'min', 'minimum'])
    : rawPrice;
  const changeRaw = first(p, ['change', 'priceChange', 'price_change', 'priceChangePercent', 'price_change_percent', 'changePercentage', 'change_percentage', 'change_percent', 'percentageChange', 'percentage_change', 'price_change_percentage', 'changePercent', 'percentage', 'priceTrendPercent', 'price_trend_percent']);
  let change;
  if (changeRaw && typeof changeRaw === 'object') {
    const pct = first(changeRaw, ['pct', 'percent', 'percentage', 'value', 'change', 'rate']);
    if (pct !== undefined) {
      const magnitude = Math.abs(numberValue(pct));
      const dir = String(first(changeRaw, ['dir', 'direction', 'trend']) ?? '').toLowerCase();
      change = dir === 'down' || dir === 'decrease' || dir === 'fall' ? -magnitude
        : dir === 'up' || dir === 'increase' || dir === 'rise' ? magnitude
        : numberValue(pct);
    }
  } else if (changeRaw !== undefined) change = numberValue(changeRaw);
  const previousPrice = first(p, ['yesterday', 'previousPrice', 'previous_price', 'oldPrice', 'old_price', 'yesterdayPrice', 'yesterday_price', 'lastPrice', 'last_price', 'priceYesterday', 'price_yesterday']);
  if (change === undefined && price !== undefined && previousPrice !== undefined && numberValue(previousPrice) > 0) {
    change = ((numberValue(price) - numberValue(previousPrice)) / numberValue(previousPrice)) * 100;
  }

  const imageRaw = first(p, ['imageUrl', 'image_url', 'imageURL', 'photo', 'photoUrl', 'photo_url', 'thumbnail', 'thumbnailUrl', 'thumbnail_url', 'picture', 'src', 'img']);
  const imageList = first(p, ['images', 'imageUrls', 'image_urls', 'photos', 'gallery', 'galleryImages', 'gallery_images']);
  const firstImage = Array.isArray(imageList) ? imageList[0] : undefined;
  const imageValue = imageRaw ?? firstImage;
  const image = typeof imageValue === 'string' && /^https?:\/\//i.test(imageValue) ? imageValue : imageValue && typeof imageValue === 'object'
    ? first(imageValue, ['url', 'src', 'href', 'original', 'large', 'medium'])
    : undefined;
  
  const emoji = first(p, ['image', 'emoji', 'icon', 'symbol', 'imageEmoji', 'image_emoji', 'productImage', 'product_image']);
  const markets = first(p, ['markets', 'bazars', 'bazaars', 'marketPrices', 'market_prices', 'pricesByMarket', 'prices_by_market', 'marketData', 'market_data', 'marketPricesByBazar', 'market_prices_by_bazar']);
  const marketValues = Array.isArray(markets) ? markets.flatMap(m => [m?.min, m?.max].map(numberValue).filter(n => n > 0)) : [];
  const explicitMin = first(p, ['minPrice', 'min_price', 'minimumPrice', 'minimum_price']);
  const explicitMax = first(p, ['maxPrice', 'max_price', 'maximumPrice', 'maximum_price']);
  const explicitAvg = first(p, ['averagePrice', 'average_price', 'avgPrice', 'avg_price', 'average', 'avg']);

  return {
    ...p,
    id: first(p, ['id', '_id', 'productId', 'product_id']),
    name: first(p, ['nameBn', 'name_bn', 'name', 'title', 'productName', 'product_name', 'productNameBn', 'product_name_bn', 'bnName', 'bn_name']),
    slug: first(p, ['slug', 'productSlug', 'product_slug', 'slugify']) ?? String(first(p, ['id', '_id', 'productId', 'product_id']) ?? ''),
    category: category == null ? undefined : String(category),
    categoryName,
    emoji,
    image,
    unit: first(p, ['unitBn', 'unit_bn', 'unit', 'unitName', 'unit_name', 'measurementUnit', 'measurement_unit', 'unitLabel', 'unit_label', 'measurement', 'measure']),
    price,
    change,
    description: first(p, ['description', 'details', 'summary', 'marketSummary', 'market_summary']),
    averagePrice: explicitAvg ?? (price !== undefined ? price : (marketValues.length ? marketValues.reduce((a,b)=>a+b,0) / marketValues.length : undefined)),
    minPrice: explicitMin ?? (marketValues.length ? Math.min(...marketValues) : undefined),
    maxPrice: explicitMax ?? (marketValues.length ? Math.max(...marketValues) : undefined),
    markets,
  };
}
async function getJson(path) {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 60 }, headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`BazarDor API request failed (${res.status}): ${path}`);
  return res.json();
}
export async function getProducts(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  const payload = await getJson(`/products${query}`);
  const list = extractList(payload, ['products']);
  return list.map(normalizeProduct).filter(p => p.id != null || p.name);
}
export async function getProduct(slug) {
 
  const all = await getProducts();
  const match = all.find(item => String(item.id) === String(slug) || String(item.slug) === String(slug));
  if (match) {
    if (match.id != null && String(match.id) !== String(slug)) {
      try {
        const payload = await getJson(`/products/${encodeURIComponent(match.id)}`);
        const candidate = payload?.product ?? payload?.data?.product ?? payload?.data ?? payload?.result ?? payload;
        const item = Array.isArray(candidate) ? candidate[0] : candidate;
        if (item && typeof item === 'object') return normalizeProduct(item);
      } catch { }
    }
    return match;
  }
  if (/^\d+$/.test(String(slug))) {
    try {
      const payload = await getJson(`/products/${encodeURIComponent(slug)}`);
      const candidate = payload?.product ?? payload?.data?.product ?? payload?.data ?? payload?.result ?? payload;
      const item = Array.isArray(candidate) ? candidate[0] : candidate;
      if (item && typeof item === 'object') return normalizeProduct(item);
    } catch (error) {
      if (!error.message?.includes('(404)')) throw error;
    }
  }
  return null;
}
export async function getCategories() {
  const payload = await getJson('/categories');
  return extractList(payload, ['categories']).map(normalizeCategory).filter(c => c.slug && c.name);
}
export async function getCategory(slug) {
  try {
    const payload = await getJson(`/categories/${encodeURIComponent(slug)}`);
    const c = payload?.category ?? payload?.data?.category ?? payload?.data ?? payload?.result ?? payload;
    if (!c || typeof c !== 'object') return null;
    const normalized = normalizeCategory(c);
    return { ...normalized, slug: normalized.slug ?? slug };
  } catch (error) {
    if (error.message?.includes('(404)')) return null;
    throw error;
  }
}
