import { Suspense } from 'react';
import AuthForm from '/components/AuthForm';
export const metadata={title:'সাইন আপ — বাজার দর'};
export default function SignUpPage(){return <Suspense fallback={<div className="container loading-page"><div className="skeleton skeleton-title"/></div>}><AuthForm mode="signup"/></Suspense>}
