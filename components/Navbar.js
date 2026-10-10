'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Menu, X, UserRound, LogOut } from 'lucide-react';
import { authClient } from '/lib/auth-client';
import { API_BASE, formatPrice, extractList, normalizeCategory, normalizeProduct } from '/lib/data';
import toast from 'react-hot-toast';

export default function Navbar() {
 const pathname = usePathname(); const router = useRouter(); const [open,setOpen] = useState(false); const [categories,setCategories] = useState([]); const [ticker,setTicker] = useState([]); const {data:session,isPending} = authClient.useSession();
 useEffect(()=>{setOpen(false)},[pathname]);
 useEffect(()=>{let cancelled=false; Promise.all([fetch(`${API_BASE}/categories`).then(r=>{if(!r.ok) throw new Error('categories');return r.json()}),fetch(`${API_BASE}/products`).then(r=>{if(!r.ok) throw new Error('products');return r.json()})]).then(([catData,productData])=>{if(cancelled)return;const cats=extractList(catData,['categories']).map(normalizeCategory);const products=extractList(productData,['products']).map(normalizeProduct);setCategories(cats.filter(c=>c.slug&&c.name));setTicker(products.filter(p=>p.name).slice(0,10))}).catch(()=>{if(!cancelled){setCategories([]);setTicker([])}});return()=>{cancelled=true}},[]);
 async function logout(){ const result = await authClient.signOut(); if(result?.error) toast.error(result.error.message || 'সাইন আউট করা যায়নি'); else {toast.success('সফলভাবে সাইন আউট হয়েছে');router.push('/');router.refresh();} }
 return <header className="site-header">
  <div className="nav-main container">
   <Link href="/" className="brand"><span className="brand-icon">🛒</span><span><strong>বাজার দর</strong><small>{new Intl.DateTimeFormat('bn-BD',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Dhaka'}).format(new Date())}</small></span></Link>
   <div className="nav-actions">{isPending?<span className="nav-loading"/>:session?.user?<><Link className="profile-link" href="/profile"><UserRound size={16}/><span>{session.user.name?.split(' ')[0]||'প্রোফাইল'}</span></Link><button className="icon-button logout-button" onClick={logout} title="সাইন আউট"><LogOut size={17}/></button></>:<><Link className="btn btn-light btn-sm" href="/signin">সাইন ইন</Link><Link className="btn btn-primary btn-sm" href="/signup">সাইন আপ</Link></>}</div>
   <button className="mobile-menu" onClick={()=>setOpen(!open)} aria-label="মেনু খুলুন">{open?<X/>:<Menu/>}</button>
  </div>
  <div className={`nav-category-row ${open?'nav-category-open':''}`}><nav className="nav-links container" aria-label="পণ্যের বিভাগ">
    {<Link href="/" className={pathname==='/'?'nav-link active':'nav-link'}>সব পণ্য</Link>}{categories.slice(0,8).map(c=><Link key={c.slug} href={`/category/${c.slug}`} className={(c.slug==='all'&&pathname==='/' || pathname===`/category/${c.slug}`)?'nav-link active':'nav-link'}>{c.name}</Link>)}
  </nav></div>
  <div className="ticker" aria-label="আজকের দামের পরিবর্তন"><div className="ticker-track">{(ticker.length?[...ticker,...ticker]:[]).map((p,i)=><span className="ticker-item" key={`${p.id}-${i}`}><span className="ticker-emoji">{p.emoji}</span><b>{p.name}</b><span>{formatPrice(p.price)}/{p.unit}</span><span className={p.change>0?'up':p.change<0?'down':'flat'}>{p.change>0?<ArrowUpRight size={14}/>:p.change<0?<ArrowDownRight size={14}/>:null}{Math.abs(Number(p.change)||0).toLocaleString('bn-BD')}%</span><i/></span>)}</div></div>
 </header>;
}
