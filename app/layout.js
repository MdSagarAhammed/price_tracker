import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '/components/Navbar';
import Footer from '/components/Footer';

export const metadata = {
  title: 'বাজার দর — প্রতিদিনের বাজারদর এক নজরে',
  description: 'বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম, বাজারভিত্তিক তুলনা এবং দামের ওঠানামা এক জায়গায়।',
  applicationName: 'বাজার দর'
};
export default function RootLayout({ children }) {
  return <html lang="bn"><body><Navbar/><main>{children}</main><Footer/><Toaster position="top-right" toastOptions={{duration:3500, style:{borderRadius:'14px',fontFamily:'inherit',fontSize:'14px'}}}/></body></html>;
}
