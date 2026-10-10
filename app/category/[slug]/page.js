import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { getCategories,getProducts } from '/lib/data';
import CategoryListing from '/components/CategoryListing';
export const revalidate=300;
export async function generateMetadata({params}){const {slug}=await params;const cats=await getCategories();const cat=cats.find(c=>c.slug===slug);return {title:cat?`${cat.name} — বাজার দর`:'বিভাগ পাওয়া যায়নি'};}
export default async function CategoryPage({params}){const {slug}=await params;const [categories,products]=await Promise.all([getCategories(),getProducts(slug)]);const category=categories.find(c=>c.slug===slug);if(!category)notFound();if(!products.length)return <div className="container empty-page"><span className="empty-illustration">🧺</span><h1>এই বিভাগে পণ্য পাওয়া যায়নি</h1><p>অন্য বিভাগ দেখুন অথবা সব পণ্যের তালিকায় ফিরে যান।</p><Link className="btn btn-primary" href="/">হোম পেজে ফিরে যান</Link></div>;return <section className="category-page container"><div className="breadcrumb"><Link href="/">হোম</Link><span>/</span><span>{category.name}</span></div><div className="category-title-row"><div className="category-heading"><span className="category-hero-icon">{category.emoji}</span><div><span className="section-kicker">PRODUCT CATEGORY</span><h1>{category.name} এর বাজারদর</h1><p>আজকের {category.name} এর দাম তুলনা করুন এক নজরে।</p></div></div><span className="total-products">{products.length.toLocaleString('bn-BD')}টি পণ্য</span></div><CategoryListing products={products}/></section>}
