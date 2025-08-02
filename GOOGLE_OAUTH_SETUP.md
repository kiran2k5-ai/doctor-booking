# 🔐 Google OAuth Setup Guide

## 1. Create Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable Google+ API (or People API)
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set Application Type to "Web Application"

## 2. Configure OAuth Consent Screen

1. Go to "OAuth consent screen"
2. Choose "External" for user type
3. Fill in app information:
   - App name: Doctor Booking System
   - User support email: your-email@domain.com
   - Developer contact: your-email@domain.com
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (optional for development)

## 3. Set Redirect URIs

In your OAuth 2.0 Client configuration, add these URIs:

### For Development:
```
http://localhost:3000/api/auth/callback/google
```

### For Production (replace with your domain):
```
https://your-app.render.com/api/auth/callback/google
```

## 4. Environment Variables

Add these to your `.env.local` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_SECRET=your_random_secret_key_here
NEXTAUTH_URL=http://localhost:3000  # Change for production

# Existing Supabase vars
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 5. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

## 6. Test Google Login

1. Start your development server: `npm run dev`
2. Go to http://localhost:3000/login
3. Click "Continue with Google"
4. Sign in with your Google account
5. You'll be redirected to the appropriate dashboard

## 7. User Type Detection

The system determines user type based on email:

### Doctor Emails (redirect to doctor dashboard):
- sarah.wilson@hospital.com
- michael.chen@hospital.com  
- emily.davis@hospital.com
- james.brown@hospital.com
- lisa.johnson@hospital.com

### All other emails → Patient dashboard

## 8. Production Deployment

For Render deployment, add these environment variables in your Render dashboard:

```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret  
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=https://your-app.render.com
```

## 9. Troubleshooting

- **"Redirect URI mismatch"**: Check your OAuth client redirect URIs
- **"Invalid client"**: Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- **Not redirecting**: Check NEXTAUTH_URL matches your domain
- **Session issues**: Clear browser cookies and try again
