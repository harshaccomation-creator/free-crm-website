# V0 Preview Environment Fix - Supabase Environment Variables

## Problem
The v0 preview environment was showing "Supabase env missing in Vercel" error on the login page, while the production deployment worked correctly.

## Root Cause
The v0 preview environment (`.env.project`) does not contain Supabase environment variables. Only the production Vercel deployment has them configured. The LoginPage had a hardcoded validation check that would immediately reject the form submission if `isBackendConfigured` was false.

## Environment Variables Status
- **Production (Vercel deployment)**: ✅ Has VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY configured
- **v0 Preview (local dev)**: ❌ No Supabase variables available in `.env.project`

## Solution Implemented
Removed the hardcoded `isBackendConfigured` validation check from LoginPage that was blocking the preview environment.

### Files Changed
1. **`src/pages/LoginPage.jsx`** (2 changes)
   - Removed: `if (!isBackendConfigured || !supabase) return setMessage('Supabase env missing in Vercel.');`
   - Removed: Unused import of `isBackendConfigured`
   - Now allows form submission attempt; will fail gracefully with actual Supabase error if credentials are missing

### Why This Works
- The other pages in the app already use a "demo mode" pattern with `isBackendConfigured` checks
- LoginPage now uses the same pattern: attempt the API call, catch the error, show it to the user
- Production deployment still works because it has all env vars configured
- v0 preview can now load the login page without blocking errors

## How It Works Now
1. **Production**: User enters credentials → Supabase client configured → Login succeeds
2. **v0 Preview**: User enters credentials → Supabase client attempts call → Error is caught and displayed to user → User sees actual error message

## Environment Variables Required
For production deployment (already configured):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `OTP_FROM_EMAIL`

v0 preview environment does not require these for basic UI testing.
