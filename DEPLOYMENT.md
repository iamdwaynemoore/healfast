# HealFast Deployment Guide

## Vercel Deployment

### Prerequisites
- GitHub repository: ✅ https://github.com/iamdwaynemoore/healfast
- Build files: ✅ Ready in `/dist`
- Environment variables: ✅ Configured

### Deploy to Vercel

1. **Visit**: https://vercel.com/new
2. **Import Git Repository**: Select `iamdwaynemoore/healfast`
3. **Configure Project**:
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Environment Variables** (Add these in Vercel):
   ```
   VITE_SUPABASE_URL=https://hmspgkdossrhpbqgjpvn.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtc3Bna2Rvc3NyaHBicWdqcHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODU2ODIsImV4cCI6MjA2OTU2MTY4Mn0.ZigPNBWrzjctFztVqbD2tzyJTs5VKkDR_kwGM80MHuU
   ```

5. **Deploy**

### Post-Deployment

Your app will be available at:
- Production: `https://healfast.vercel.app` (or custom domain)
- Preview: `https://healfast-git-main-iamdwaynemoore.vercel.app`

### Features Working in Production
- ✅ Supabase Authentication
- ✅ Cloud Database
- ✅ All UI Features
- ✅ Video Backgrounds
- ✅ Responsive Design

### Custom Domain (Optional)
1. Go to Vercel project settings
2. Add your domain
3. Update DNS records

### Monitoring
- View deployments: https://vercel.com/iamdwaynemoore/healfast
- Check functions logs
- Monitor performance

## Alternative: Netlify

If you prefer Netlify:
1. Visit: https://app.netlify.com/start
2. Connect GitHub
3. Select repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add same environment variables
6. Deploy

## Local Build Test

Test production build locally:
```bash
npm run build
npm run preview
```

## Support
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs