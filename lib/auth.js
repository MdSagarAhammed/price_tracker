import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const uri = process.env.BETTER_AUTH_DB_URL;
if (!uri) console.warn('BETTER_AUTH_DB_URL is missing. Configure it in .env.local to enable authentication.');
const client = uri ? new MongoClient(uri) : null;
const database = client ? client.db() : null;
const socialProviders = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) socialProviders.google = { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET };
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) socialProviders.github = { clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET };

export const auth = betterAuth({
  appName: 'বাজার দর',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET || 'development-only-change-this-secret-before-deployment',
  ...(database ? { database: mongodbAdapter(database) } : {}),
  emailAndPassword: { enabled: true, requireEmailVerification: false },
  socialProviders,
  user: { additionalFields: {} }
});
