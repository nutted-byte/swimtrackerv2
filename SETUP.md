# Swim Tracker Authentication Setup Guide

This guide will walk you through setting up Google authentication and Supabase for your swim tracker app.

## Prerequisites

- A Supabase account (free tier works great!)
- A Google Cloud project for OAuth
- Node.js 16+ installed

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: swim-tracker (or any name you prefer)
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest region to you
5. Click "Create new project"
6. Wait for the project to be created (takes ~2 minutes)

---

## Step 2: Set Up the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" to execute the SQL
6. You should see a success message

This creates:
- `swim_sessions` table with proper columns
- Row Level Security (RLS) policies
- Indexes for performance
- Automatic timestamp updates

---

## Step 3: Configure Google OAuth

### 3.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add **Authorized JavaScript origins**:
     - `http://localhost:5173` (for development)
     - Your production URL (e.g., `https://your-app.netlify.app`)
   - Add **Authorized redirect URIs**:
     - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
     - Replace `YOUR_PROJECT_REF` with your actual Supabase project reference
     - You can find this in Supabase: Settings > API > Project URL
   - Click "Create"
   - Copy your **Client ID** and **Client Secret**

### 3.2 Configure Google OAuth in Supabase

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Find "Google" in the list
3. Toggle it **ON**
4. Paste your Google OAuth credentials:
   - **Client ID**: from Google Cloud Console
   - **Client Secret**: from Google Cloud Console
5. Click "Save"

---

## Step 4: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Find and copy these values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

---

## Step 5: Configure Environment Variables

1. Open the `.env` file in the root of your project
2. Replace the placeholder values with your actual credentials:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

**Important**: Never commit your `.env` file to version control! It's already in `.gitignore`.

---

## Step 6: Start the Development Server

```bash
npm install  # Install dependencies (if you haven't already)
npm run dev  # Start the development server
```

The app should open at `http://localhost:5173`

---

## Step 7: Test Authentication

1. Navigate to `http://localhost:5173`
2. You should be redirected to the login page
3. Click "Continue with Google"
4. Sign in with your Google account
5. You should be redirected back to the app and see the dashboard

---

## Step 8: Data Migration (If Applicable)

If you were using the app before with localStorage:

1. When you first log in, the app will automatically detect localStorage data
2. It will migrate all your sessions to Supabase
3. You'll see a console log confirming the migration
4. Your data is now safely stored in Supabase!

---

## Production Deployment

When deploying to production (e.g., Netlify):

⚠️ **IMPORTANT:** Follow the complete deployment checklist at `docs/DEPLOYMENT_CHECKLIST.md` before deploying!

### 1. Configure Supabase Auth URLs (CRITICAL!)

1. Go to your Supabase dashboard: **Authentication** > **URL Configuration**
   - Direct link: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF/auth/url-configuration`
2. Set **Site URL** to: `https://your-app.netlify.app`
3. Add to **Redirect URLs**:
   - `https://your-app.netlify.app/**`
   - `https://your-app.netlify.app/auth/callback`
4. Click **Save**

### 2. Update Google OAuth

1. Go back to Google Cloud Console > Credentials
2. Edit your OAuth client
3. Add your production URLs:
   - **Authorized JavaScript origins**: `https://your-app.netlify.app`
   - **Authorized redirect URIs**: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
4. Save

### 3. Set Environment Variables in Netlify

1. Go to your Netlify site settings
2. Navigate to "Site settings" > "Environment variables"
3. Add the same variables from your `.env` file:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Redeploy your site

### 4. Deploy via GitHub (Recommended)

Since Netlify is connected to your GitHub repo, simply push to main:

```bash
git push origin main
```

This automatically triggers a Netlify deployment.

### 5. Verify Deployment

See `docs/DEPLOYMENT_CHECKLIST.md` for post-deployment verification steps.

---

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure your `.env` file is in the root directory
- Restart your dev server after updating `.env`
- Check that variable names start with `VITE_`

### Google OAuth redirect not working
- Verify your redirect URIs in Google Cloud Console
- Make sure they exactly match (including https vs http)
- Check that Google+ API is enabled

### Can't sign in / Sessions not loading
- Check Supabase SQL Editor for any errors
- Verify RLS policies are enabled
- Check browser console for error messages

### Migration not working
- Check browser console for migration logs
- Verify you have localStorage data from the old version
- Migration only runs once per user

---

## Next Steps

- Upload your swim data via the Upload page
- Explore your dashboard, insights, and records
- Invite friends to track their swims too!

---

## Support

If you run into issues:
1. Check the browser console for error messages
2. Check Supabase logs in the dashboard
3. Verify all environment variables are set correctly
4. Make sure the database schema was created successfully
