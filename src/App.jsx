import React from 'react';
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { supabase } from "@/lib/supabase"

function App() {
  // Check if Supabase is configured
  if (!supabase) {
    return (
      <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Configuration Error</h1>
          <p style={{ marginBottom: '1rem' }}>
            Supabase environment variables are not configured. 
          </p>
          <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
            Please add the following environment variables in your Vercel project settings:
          </p>
          <div style={{ background: '#111', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', textAlign: 'left' }}>
            <div>VITE_SUPABASE_URL=your_supabase_url</div>
            <div>VITE_SUPABASE_ANON_KEY=your_supabase_anon_key</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      <Pages />
      <Toaster />
    </div>
  )
}

export default App