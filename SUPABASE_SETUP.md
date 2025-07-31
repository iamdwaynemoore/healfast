# Supabase Setup Guide for HealFast

## Step 1: Database Setup ✅

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/hmspgkdossrhpbqgjpvn
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy and paste the entire contents of `/supabase/schema.sql`
5. Click "Run" to execute the SQL

This will create:
- All required tables (profiles, fasting_sessions, achievements, etc.)
- Row Level Security policies
- Indexes for performance
- Triggers for new user setup

## Step 2: Enable Authentication

1. In Supabase dashboard, go to "Authentication" → "Providers"
2. Ensure "Email" is enabled
3. Configure email settings:
   - Enable email confirmations (optional for testing)
   - Set up email templates if needed

## Step 3: Test the Connection

Run your app and check the browser console:
```bash
npm run dev
```

Open browser console (F12) and check for any Supabase connection errors.

## Step 4: Switch from localStorage to Supabase

Once tables are created, update `/src/api/entities.js`:

```javascript
// Change from:
export { FastingSession, UserProfile, Achievement, WaterLog, Affirmation, User } from './localStorage';

// To:
export { FastingSession, UserProfile, Achievement, WaterLog, Affirmation, User } from './supabase';
```

## Step 5: Test Core Features

1. **Sign Up**: Create a new account
2. **Login**: Sign in with the account
3. **Start Fast**: Begin a fasting session
4. **Profile**: Update profile information
5. **Water Tracking**: Add water intake
6. **Achievements**: Check if achievements are tracked

## Migration Notes

### Data Migration (Optional)
If you have existing localStorage data to migrate:

```javascript
// One-time migration script (run in browser console)
const migrateData = async () => {
  // Get localStorage data
  const localSessions = JSON.parse(localStorage.getItem('fasting_sessions') || '[]');
  
  // Upload to Supabase
  for (const session of localSessions) {
    await FastingSession.create(session);
  }
};
```

### Authentication Changes
- Supabase handles sessions automatically
- Tokens are refreshed automatically
- Auth state persists across browser sessions

### API Differences
| Feature | localStorage | Supabase |
|---------|-------------|----------|
| Auth | Email/password in localStorage | Secure JWT tokens |
| Data | Browser only | Cloud synced |
| Security | Client-side only | Row Level Security |
| Persistence | Until cleared | Permanent |
| Multi-device | No | Yes |

## Troubleshooting

### Common Issues

1. **"Not authenticated" errors**
   - Check if user is logged in
   - Verify auth token is valid

2. **"Permission denied" errors**
   - Check Row Level Security policies
   - Ensure user owns the data

3. **Connection errors**
   - Verify .env.local file exists
   - Check Supabase URL and anon key
   - Restart dev server after changing .env

### Debug Mode
Add to your app for debugging:
```javascript
// In App.jsx
import { supabase } from '@/lib/supabase';

useEffect(() => {
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('Supabase connected:', !!supabase);
}, []);
```

## Next Steps

After setup:
1. Test all features thoroughly
2. Set up email templates in Supabase
3. Configure custom domain (optional)
4. Set up backup policies
5. Monitor usage in Supabase dashboard