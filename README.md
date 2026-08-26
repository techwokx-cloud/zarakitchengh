# Zara Kitchen - Next.js Landing Page

Professional restaurant website for Zara Kitchen - Authentic Ghanaian & Continental Cuisine.

## Features

✅ **Responsive Design** - Mobile, tablet, and desktop optimized  
✅ **Hero Section with Carousel** - Auto-rotating food images  
✅ **Ask Zara AI Widget** - Interactive food recommendations  
✅ **Menu Categories** - 16 food categories with emojis  
✅ **Social Media Integration** - Facebook, Instagram, X/Twitter links  
✅ **Payment Methods** - Display multiple payment options  
✅ **WhatsApp Integration** - Direct WhatsApp ordering  
✅ **SEO Optimized** - Meta tags and structured data  
✅ **Performance** - Fast load times with Next.js 15  

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 3
- **UI Components**: Lucide React Icons
- **Language**: TypeScript
- **Hosting**: Namecheap VPS / Vercel / Railway

## Local Setup

### 1. Prerequisites
```bash
Node.js 18+ installed
npm or yarn package manager
```

### 2. Clone & Install
```bash
cd zara-kitchen
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Visit: `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

## Deployment Options

### Option A: Deploy to Vercel (Recommended - Easiest)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel auto-detects Next.js, click Deploy
5. In Vercel dashboard → Settings → Domains
6. Add `zarakitchengh.com`
7. Update Namecheap nameservers to Vercel's nameservers (24-48 hours)

### Option B: Deploy to Namecheap VPS ($3/mo)

1. Purchase Namecheap VPS with Node.js support
2. SSH into your VPS:
```bash
ssh root@your_vps_ip
```

3. Install Node.js (if not included):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Install PM2 (process manager):
```bash
npm install -g pm2
```

5. Clone your repository:
```bash
git clone https://github.com/YOUR_USERNAME/zara-kitchen.git
cd zara-kitchen
npm install
npm run build
```

6. Start with PM2:
```bash
pm2 start npm --name "zara-kitchen" -- start
pm2 save
pm2 startup
```

7. Update Namecheap DNS:
   - Point A record to your VPS IP
   - Keep email MX records as they are

8. Install & Configure Nginx (reverse proxy):
```bash
sudo apt-get install nginx
```

Create `/etc/nginx/sites-available/zarakitchen`:
```nginx
server {
    listen 80;
    server_name zarakitchengh.com www.zarakitchengh.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable & restart:
```bash
sudo ln -s /etc/nginx/sites-available/zarakitchen /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option C: Deploy to Railway

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Connect GitHub account
4. Select your repository
5. Railway auto-detects Next.js
6. Add domain in settings
7. Deploy automatically on push

### Option D: Deploy to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repo
5. Build command: `npm install && npm run build`
6. Start command: `npm start`
7. Add environment variable (if needed)
8. Add custom domain

## Environment Variables

Create `.env.local` (for local development):
```
NEXT_PUBLIC_RESTAURANT_PHONE=+233241234567
NEXT_PUBLIC_RESTAURANT_EMAIL=info@zarakitchen.com
NEXT_PUBLIC_RESTAURANT_ADDRESS=Accra, Ghana
NEXT_PUBLIC_WHATSAPP_NUMBER=233241234567
```

## Customization

### Change Contact Information
Edit `/components/Header.tsx` and `/components/Footer.tsx`:
```tsx
href="tel:+233241234567"  // Change phone number
href="https://wa.me/233241234567"  // Change WhatsApp number
```

### Add Menu Items
Edit `/components/MenuCategories.tsx`:
```tsx
const menuCategories = [
  { id: 1, name: 'Your Category', icon: '🍕', color: 'bg-red-50' },
  // Add more...
]
```

### Update Hero Images
Edit `/components/HeroSection.tsx`:
```tsx
const heroImages = [
  {
    url: 'YOUR_IMAGE_URL',
    alt: 'Image description',
  },
]
```

### Change Colors
Edit `/tailwind.config.js`:
```js
colors: {
  'zara-gold': '#FFC107',
  'zara-orange': '#FF9800',
  // Customize as needed
}
```

## Social Media Links

Update in `/components/Footer.tsx`:
- Facebook: `https://www.facebook.com/ZaraKitchenOfficial`
- Instagram: `https://www.instagram.com/zarakitchenofficial/`
- Twitter/X: `https://x.com/Zarakitchengh`

## SSL Certificate (HTTPS)

### On Namecheap VPS:
Use Certbot for free SSL:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d zarakitchengh.com -d www.zarakitchengh.com
```

### On Vercel/Railway/Render:
Automatic SSL provided by default.

## Performance Tips

1. **Optimize Images**: Use WebP format
2. **Lazy Load**: Images load on scroll
3. **Cache**: Leverage browser caching
4. **CDN**: Use Vercel's global CDN (free with Vercel)

## Maintenance

### Update Dependencies
```bash
npm update
```

### Monitor Performance
- Vercel: Built-in analytics
- Namecheap VPS: Use PM2 logs
  ```bash
  pm2 logs zara-kitchen
  ```

### Backup
```bash
# On VPS
tar -czf zara-kitchen-backup.tar.gz ~/zara-kitchen
```

## Troubleshooting

### Port 3000 Already in Use
```bash
sudo lsof -i :3000
kill -9 PID
```

### Build Fails
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Domain Not Pointing
Check DNS propagation: https://mxtoolbox.com/

## Support

**Technical Issues**: Contact your hosting provider  
**Design Changes**: Edit React components in `/components`  
**Content Updates**: Edit text in component files  

## License

This website is proprietary to Zara Kitchen. All rights reserved.

---

**Built with ❤️ for Zara Kitchen**  
*Good Food, Good Mood*
