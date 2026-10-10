import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '/lib/auth';
import ProductDetail from '/components/ProductDetail';
import { getProduct } from '/lib/data';
export const dynamic='force-dynamic';
export async function generateMetadata({params}){const {slug}=await params;const p=await getProduct(slug);return {title:p?`${p.name} — বাজার দর`:'পণ্য পাওয়া যায়নি'};}
export default async function ProductPage({params}){const {slug}=await params;let session=null;try{session=await auth.api.getSession({headers:await headers()})}catch{}if(!session?.user)redirect(`/signin?callbackUrl=${encodeURIComponent(`/product/${slug}`)}&required=1`);const product=await getProduct(slug);return <ProductDetail product={product}/>;}
