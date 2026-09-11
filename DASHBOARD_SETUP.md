# Zara Kitchen AI Content Dashboard - Complete Setup Guide

## 🚀 Overview

Your integrated dashboard includes:
- ✅ AI Content Generation (Text, Images, Videos)
- ✅ 30-Day Content Calendar
- ✅ Social Media Auto-Posting (FB, IG, TikTok, Twitter, WhatsApp)
- ✅ Ghana Holiday Auto-Detection
- ✅ Engagement Analytics
- ✅ Multi-Model AI Integration (Claude, DALL-E, Stable Diffusion, Groq, Google AI)

---

## 📋 Prerequisites

Before starting, you need:

1. **Node.js 18+** - https://nodejs.org
2. **Supabase Account** - https://supabase.com (free tier)
3. **AI API Keys** (at least one):
   - OpenAI (DALL-E): https://platform.openai.com
   - FAL AI (Stable Diffusion): https://fal.ai
   - Groq: https://console.groq.com
   - Google AI: https://ai.google.dev
   - Anthropic (Claude): https://console.anthropic.com

4. **Social Media Developer Access**:
   - Facebook/Instagram Business Account
   - TikTok Creator Account
   - Twitter Developer Account
   - WhatsApp Business API

---

## 🗄️ Step 1: Setup Supabase Database

### 1.1 Create Supabase Project

```bash
1. Go to https://supabase.com
2. Click "New Project"
3. Name it "zara-kitchen"
4. Set password (save it!)
5. Select region closest to Ghana (Europe is fine)
6. Wait for project to be ready
```

### 1.2 Setup Database Schema

```bash
# Copy the SQL schema from supabase/schema.sql
# In Supabase Dashboard:
1. Go to SQL Editor
2. Click "New Query"
3. Copy-paste content from supabase/schema.sql
4. Click "Run"
5. Wait for all tables to be created
```

### 1.3 Get Supabase Credentials

```bash
In Supabase Dashboard:
1. Go to Settings → API
2. Copy "Project URL" → NEXT_PUBLIC_SUPABASE_URL
3. Copy "anon public" key → NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Copy "service_role" key → SUPABASE_SERVICE_KEY
```

---

## 🔑 Step 2: Get AI API Keys

### Option A: Anthropic Claude (Recommended)
```bash
1. Go to https://console.anthropic.com
2. Create account / Sign in
3. Click "API Keys"
4. Create new key
5. Copy and save: ANTHROPIC_API_KEY
```

### Option B: OpenAI DALL-E 3
```bash
1. Go to https://platform.openai.com
2. Billing → Set payment method
3. API Keys → Create new key
4. Copy: OPENAI_API_KEY
Cost: $0.04 per image (1024x1024)
```

### Option C: FAL AI (Stable Diffusion) - FREE
```bash
1. Go to https://fal.ai
2. Sign up free
3. Dashboard → API Keys
4. Create key
5. Copy: FAL_AI_KEY
Cost: FREE for Stable Diffusion
```

### Option D: Groq (Fast LLM) - FREE
```bash
1. Go to https://console.groq.com
2. Sign up
3. API Keys → Create key
4. Copy: GROQ_API_KEY
Cost: FREE tier available
```

### Option E: Google AI (Gemini) - FREE
```bash
1. Go to https://ai.google.dev
2. Create API key (free)
3. Copy: GOOGLE_AI_KEY
Cost: FREE tier available
```

---

## 📱 Step 3: Connect Social Media Accounts

### Facebook/Instagram

```bash
1. Go to https://developers.facebook.com
2. Create App → Select "Business"
3. Add Instagram Basic Display & Graph API
4. Get Page Access Token
5. Copy to: FACEBOOK_PAGE_ACCESS_TOKEN
```

### TikTok

```bash
1. Go to https://developers.tiktok.com
2. Register Developer Account
3. Create Application
4. Get Access Token
5. Copy to: TIKTOK_ACCESS_TOKEN
```

### Twitter/X

```bash
1. Go to https://developer.twitter.com
2. Create Application
3. Generate Bearer Token
4. Copy to: TWITTER_BEARER_TOKEN
```

### WhatsApp Business

```bash
1. Go to https://developers.facebook.com
2. Create WhatsApp Business App
3. Get access token & phone number ID
4. Copy to: WHATSAPP_BUSINESS_TOKEN
           WHATSAPP_PHONE_NUMBER_ID
```

---

## 🛠️ Step 4: Setup Environment Variables

### Create `.env.local` File

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# AI Services
ANTHROPIC_API_KEY=sk-your-key
OPENAI_API_KEY=sk-your-key
FAL_AI_KEY=your-key
GROQ_API_KEY=your-key
GOOGLE_AI_KEY=your-key

# Social Media
FACEBOOK_PAGE_ACCESS_TOKEN=your-token
INSTAGRAM_ACCESS_TOKEN=your-token
TIKTOK_ACCESS_TOKEN=your-token
TWITTER_BEARER_TOKEN=your-token
WHATSAPP_BUSINESS_TOKEN=your-token

# Business Info
NEXT_PUBLIC_BUSINESS_PHONE=+233243637122
NEXT_PUBLIC_BUSINESS_EMAIL=info@zarakitchengh.com
```

---

## 📦 Step 5: Install & Run Locally

```bash
# Navigate to project
cd zara-kitchen

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# Public site: http://localhost:3000
# Dashboard: http://localhost:3000/dashboard/login
```

---

## 🔐 Step 6: Create Staff Accounts (Website Admin / Restaurant Manager)

**First**, run `supabase/auth_and_roles.sql` in Supabase SQL Editor (in addition to `supabase/schema.sql`) -- this sets up the `profiles` table and real authentication, replacing the old `admin_users.password_hash` approach below.

### Create a user via Supabase Dashboard

```bash
1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add User" > "Create new user"
3. Enter their email and a password
4. Under "User Metadata" (or via SQL after creating), set:
   role = "website_admin"   (for the Admin dashboard)
   role = "restaurant_manager"   (for the Restaurant Manager dashboard)
```

If you create the user without setting the role in metadata, it defaults to
`restaurant_manager` -- fix it afterward with SQL:

```sql
update profiles set role = 'website_admin' where email = 'someone@zarakitchen.com';
```

### Log in

```bash
1. Visit /dashboard/login on the live site (or localhost:3000/dashboard/login)
2. Enter the email + password you just created
3. You'll land on /dashboard (Website Admin) or /manager (Restaurant Manager)
   automatically based on their role
```

---

## 🧪 Step 7: Test Dashboard

```bash
1. Visit http://localhost:3000/dashboard/login
2. Email: admin@zarakitchen.com
3. Password: Your password
4. Should see dashboard overview
5. Try generating content:
   - Go to "Generate Content"
   - Fill in prompt
   - Click "Generate Content"
   - See AI-generated post preview
```

---

## 🚀 Step 8: Deploy to Production

### Option A: Deploy to Vercel (Recommended)

```bash
# Push code to GitHub
git init
git add .
git commit -m "Add Zara Kitchen dashboard"
git push origin main

# Go to https://vercel.com
1. Import project from GitHub
2. Add environment variables (.env.local)
3. Click Deploy
4. Update domain DNS to point to Vercel
```

### Option B: Deploy to Your VPS

```bash
# On your VPS
ssh root@your-vps-ip

# Clone repository
git clone https://github.com/your-username/zara-kitchen.git
cd zara-kitchen

# Install dependencies
npm install

# Build production
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "zara-kitchen" -- start
pm2 save
pm2 startup

# Point domain to VPS
# Update DNS A record in Namecheap
```

---

## 📊 Dashboard Usage Guide

### Generate Content
```
1. Go to "Generate Content"
2. Select content type (image, video, text)
3. Choose category (promotion, holiday, event, etc.)
4. Write detailed prompt
5. Select image model (free Stable Diffusion or paid DALL-E 3)
6. Pick scheduled date
7. Select platforms to post to
8. Click "Generate Content"
9. Preview generated content
10. Auto-post or save as draft
```

### Content Calendar
```
1. View 30-day calendar
2. Click date to see scheduled posts
3. Drag posts between dates
4. Edit/delete posts as needed
5. Monitor status (draft/scheduled/published)
```

### Analytics
```
1. Select timeframe (7/30/90 days or all-time)
2. View key metrics:
   - Total impressions
   - Engagement rate
   - Platform performance
   - Top performing posts
3. Export data for reports
```

### Settings
```
1. Update business info
2. Add/update API keys
3. Configure social media accounts
4. Set content preferences
5. Enable auto-approval
```

---

## 🐛 Troubleshooting

### "Cannot connect to Supabase"
- Check SUPABASE_URL and ANON_KEY in .env.local
- Verify Supabase project is running
- Check internet connection

### "Content generation fails"
- Verify API key is valid and active
- Check API key has appropriate permissions
- Ensure account has credits/budget left
- Check Anthropic/OpenAI status page

### "Social media posts not publishing"
- Verify access tokens are valid (they expire!)
- Check Facebook/Instagram app is approved
- Ensure permissions are correct
- Verify phone number for WhatsApp

### "Dashboard won't load"
- Clear browser cache
- Check console for errors (F12)
- Verify .env.local variables
- Restart dev server: npm run dev

---

## 🔄 Updating API Keys

API keys expire or change. To update:

```bash
1. Go to Dashboard → Settings
2. Find the expired key
3. Get new key from provider
4. Paste new key (click eye icon to edit)
5. Click "Save Settings"
6. Test immediately
```

---

## 📈 Monthly Content Strategy

### Week 1: Promotions
- Monday: Food specials
- Wednesday: Lunch deals
- Friday: Weekend offers

### Week 2: Engagement
- Monday: Poll about favorite dish
- Thursday: Quiz about Ghana culture
- Saturday: Giveaway announcement

### Week 3: Holidays/Events
- Generate content for upcoming holidays
- Post before holidays with special menus
- Show behind-the-scenes during events

### Week 4: User-Generated Content
- Share customer reviews
- Feature customer photos
- Thank loyal customers

---

## 💡 Pro Tips

1. **Use specific prompts** - "Festive Eid dinner with traditional Ghanaian jollof rice" generates better results than "Food"

2. **Schedule content** - Generate 30 days of content once, let it auto-post daily

3. **Monitor analytics** - Check what content performs best, adjust future content

4. **Vary content types** - Mix images, videos, text, carousels for better engagement

5. **Time posts** - Schedule posts for peak engagement times (usually 7-9pm)

6. **Use Ghana holidays** - Dashboard auto-generates content for Eid, Independence Day, etc.

7. **A/B test** - Try different captions, images, times to see what works

8. **Respond to engagement** - Set aside time daily to reply to comments

---

## 📞 Support

- **Supabase Issues**: https://supabase.com/docs
- **Next.js Issues**: https://nextjs.org/docs
- **Claude API**: https://console.anthropic.com/docs
- **FAL AI**: https://fal.ai/docs

---

## ✨ Next Steps

After launch:

1. ✅ Generate first week of content
2. ✅ Monitor engagement metrics
3. ✅ Adjust posting schedule based on analytics
4. ✅ Add payment processing for orders
5. ✅ Integrate with WhatsApp Business API
6. ✅ Add customer lead tracking
7. ✅ Create loyalty rewards program
8. ✅ Build mobile app for customers

---

**Good Food, Good Mood! 🍽️**

Your Zara Kitchen AI Dashboard is ready to revolutionize your social media marketing!
