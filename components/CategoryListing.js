'use client';
import { useMemo,useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ProductsGrid from '/components/ProductsGrid';
import { numberValue } from '/lib/data';
export default function CategoryListing({products}){const [sort,setSort]=useState('default');const sorted=useMemo(()=>{const copy=[...products];if(sort==='asc')copy.sort((a,b)=>numberValue(a.price)-numberValue(b.price));if(sort==='desc')copy.sort((a,b)=>numberValue(b.price)-numberValue(a.price));return copy},[products,sort]);return <><div className="listing-toolbar"><span>পণ্যের তালিকা <b>{sorted.length.toLocaleString('bn-BD')}</b></span><label className="sort-select">সাজান: <select value={sort} onChange={e=>setSort(e.target.value)}><option value="default">ডিফল্ট</option><option value="asc">দাম: কম থেকে বেশি</option><option value="desc">দাম: বেশি থেকে কম</option></select><ChevronDown size={16}/></label></div><ProductsGrid products={sorted}/></>}
