import Link from 'next/link';
import { ArrowLeft,Search } from 'lucide-react';
export default function NotFound(){return <section className="container empty-page not-found-page"><div className="not-found-number">৪০৪</div><span className="empty-illustration"><Search size={34}/></span><h1>ওহ! পেজটি খুঁজে পাওয়া যায়নি</h1><p>আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে অথবা ঠিকানাটি ভুল হতে পারে।</p><Link href="/" className="btn btn-primary"><ArrowLeft size={17}/> হোম পেজে ফিরে যান</Link></section>}
