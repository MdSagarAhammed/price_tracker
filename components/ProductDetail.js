'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft,ArrowUpRight,ArrowDownRight,MapPin,ShieldCheck,LockKeyhole,TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '/lib/auth-client';
import { formatPrice } from '/lib/data';
export default function ProductDetail({product}){const {data:session,isPending}=authClient.useSession();const router=useRouter();useEffect(()=>{if(!isPending&&!session){toast('পণ্যের বিস্তারিত দেখতে সাইন ইন করুন',{icon:'🔐'});router.replace(`/signin?callbackUrl=${encodeURIComponent(typeof window!=='undefined'?window.location.pathname:'/')}`)}},[isPending,session,router]);if(!product)return <div className="container empty-page"><span className="empty-illustration">🔎</span><h1>পণ্যটি খুঁজে পাওয়া যায়নি</h1><p>লিংকটি সঠিক নয়, অথবা পণ্যটি আর উপলভ্য নেই।</p><Link href="/" className="btn btn-primary">হোম পেজে ফিরে যান</Link></div>;if(isPending||!session)return <div className="container loading-page"><div className="skeleton skeleton-title"/><div className="skeleton skeleton-copy"/><div className="skeleton-card detail-skeleton"/></div>;
 const rawMarkets=Array.isArray(product.markets)?product.markets:[];
 const markets=rawMarkets.map((market)=>{
   if (Array.isArray(market)) return { market: market[0] ?? '—', division: market[1] ?? '—', min: market[2], max: market[3] };
   const min=market?.min ?? market?.minPrice ?? market?.min_price ?? market?.minimumPrice ?? null;
   const max=market?.max ?? market?.maxPrice ?? market?.max_price ?? market?.maximumPrice ?? null;
   return { market: market?.market ?? market?.name ?? market?.marketName ?? market?.market_name ?? market?.bazar ?? market?.bazarName ?? '—', division: market?.division ?? market?.location ?? market?.district ?? '—', min, max, average: market?.average ?? market?.avg ?? market?.averagePrice ?? market?.avgPrice };
 });
 const values=markets.flatMap(m=>[m.min,m.max]).map(Number).filter(n=>Number.isFinite(n)&&n>0);
 const min=product.minPrice ?? (values.length?Math.min(...values):null);
 const max=product.maxPrice ?? (values.length?Math.max(...values):null);
 const avg=product.averagePrice ?? product.average_price ?? product.avgPrice ?? product.avg_price ?? product.today ?? product.price ?? (values.length ? values.reduce((sum,n)=>sum+n,0)/values.length : null);
 const marketAverage=(market)=>{
   const explicit=market.average ?? market.avg ?? market.averagePrice ?? market.avgPrice;
   if(explicit !== undefined && explicit !== null && explicit !== '') return explicit;
   const low=Number(market.min), high=Number(market.max);
   return Number.isFinite(low)&&Number.isFinite(high) ? (low+high)/2 : null;
 };

 return <section className="container detail-page"><Link href="/" className="back-link"><ArrowLeft size={16}/> সব পণ্যে ফিরে যান</Link><div className="detail-hero"><div className="detail-product-icon">{product.emoji}</div><div className="detail-intro"><div className="detail-tags"><span>{product.categoryName}</span><span>প্রতি {product.unit}</span></div><h1>{product.name}</h1><p>{product.description}</p><div className="detail-market-note"><MapPin size={16}/> ঢাকা ও আশেপাশের বাজারের সম্ভাব্য দাম</div></div><div className="detail-current-price"><small>আজকের গড় দাম</small><strong>{formatPrice(product.price)}</strong><span className={`change-badge ${product.change>0?'change-up':product.change<0?'change-down':'change-flat'}`}>{product.change>0?<ArrowUpRight size={14}/>:product.change<0?<ArrowDownRight size={14}/>:null}{Math.abs(Number(product.change)||0).toLocaleString('bn-BD')}% {product.change>0?'বৃদ্ধি':product.change<0?'হ্রাস':'পরিবর্তন নেই'}</span></div></div>
 <div className="detail-stats"><div className="detail-stat"><span className="stat-symbol stat-min">↓</span><small>সর্বনিম্ন দাম</small><strong>{formatPrice(min===Infinity?product.minPrice:min)}</strong><span>প্রতি {product.unit}</span></div><div className="detail-stat featured-stat"><span className="stat-symbol stat-avg">≈</span><small>গড় বাজারদর</small><strong>{formatPrice(avg)}</strong><span>প্রতি {product.unit}</span></div><div className="detail-stat"><span className="stat-symbol stat-max">↑</span><small>সর্বোচ্চ দাম</small><strong>{formatPrice(max)}</strong><span>প্রতি {product.unit}</span></div></div>
 <div className="market-section"><div className="section-heading"><div><span className="section-kicker">MARKET COMPARISON</span><h2>বাজারভিত্তিক আজকের দাম</h2><p>বিভিন্ন বাজারের সম্ভাব্য দামের তুলনা</p></div><span className="market-count"><MapPin size={15}/> {markets.length.toLocaleString('bn-BD')}টি বাজার</span></div><div className="market-table-wrap"><table className="market-table"><thead><tr><th>বাজার</th><th>বিভাগ</th><th>সর্বনিম্ন</th><th>সর্বাধিক</th><th>গড়</th></tr></thead><tbody>{markets.length ? markets.map((m,i)=><tr key={`${m.market}-${i}`}><td><span className="market-name-icon"><MapPin size={16}/></span><span><b>{m.market}</b></span></td><td>{m.division || '—'}</td><td>{formatPrice(m.min)}</td><td>{formatPrice(m.max)}</td><td>{formatPrice(marketAverage(m))}</td></tr>) : <tr><td colSpan={5}>API-তে বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।</td></tr>}</tbody></table></div><div className="detail-disclaimer"><ShieldCheck size={18}/><p>এই দামগুলো তথ্যভিত্তিক আনুমানিক হিসাব। বাজার, মান ও সময়ভেদে প্রকৃত দাম ভিন্ন হতে পারে। কেনার আগে বিক্রেতার কাছে যাচাই করুন।</p></div></div>
 </section>;
}
