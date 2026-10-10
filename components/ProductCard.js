'use client';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Minus, ArrowUp } from 'lucide-react';
import { formatPrice, numberValue } from '/lib/data';

export default function ProductCard({ product, compact = false }) {
  const hasChange = product.change !== undefined && product.change !== null && product.change !== '';
  const change = numberValue(product.change);
  return (
    <Link href={`/product/${product.slug || product.id}`} className={`product-card ${compact ? 'compact-card' : ''}`}>
      <div className="product-card-top">
        <div className={`product-visual ${product.image ? 'has-product-image' : ''}`}>
          {product.image ? (
            <img src={product.image} alt={product.name || 'পণ্য'} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          ) : product.emoji ? <span className="product-emoji-fallback">{product.emoji}</span> : null}
        </div>
        <span className={`change-badge ${change > 0 ? 'change-up' : change < 0 ? 'change-down' : 'change-flat'}`}>
          {change > 0 ? <ArrowUpRight size={14} /> : change < 0 ? <ArrowDownRight size={14} /> : <Minus size={14} />}
          {!hasChange ? 'তথ্য নেই' : `${Math.abs(change).toLocaleString('bn-BD', { maximumFractionDigits: 2 })}%`}
        </span>
      </div>
      <div className="product-info">
        <span className="product-category">{product.categoryName || ''}</span>
        <h3>{product.name || 'নাম দেওয়া নেই'}</h3>
        <p className="product-unit">{product.unit ? `প্রতি ${product.unit}` : ''}</p>
      </div>
      <div className="product-price">
        <div><small>আজকের দাম</small><strong>{product.price === undefined || product.price === null || product.price === '' ? 'দাম দেওয়া নেই' : formatPrice(product.price)}</strong></div>
        <span className="price-arrow"><ArrowUp size={17} /></span>
      </div>
    </Link>
  );
}
