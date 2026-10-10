'use client';
import { createAuthClient } from 'better-auth/react';
export const authClient = createAuthClient({ baseURL: typeof window !== 'undefined' ? window.location.origin : (process.env.BETTER_AUTH_URL || 'https://price-tracker-five-kohl.vercel.app') });
