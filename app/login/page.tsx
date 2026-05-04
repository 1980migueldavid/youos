'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function login() {
    await supabase.auth.signInWithOtp({ email });
    setSent(true);
  }

  return (
    <main style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", gap:"16px" }}>
      <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:"32px", letterSpacing:"2px" }}>LOGIN</div>
      {sent ? (
        <p style={{ color:"#22C55E", fontFamily:"'DM Mono',monospace", fontSize:"12px", letterSpacing:"2px" }}>CHECK YOUR EMAIL</p>
      ) : (
        <>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{ width:"100%", maxWidth:"320px", background:"#0d0d0d", border:"1px solid #1a1a1a", borderRadius:"6px", padding:"14px", color:"#F0EDE8", fontFamily:"'DM Sans',sans-serif", fontSize:"15px", outline:"none" }}
          />
          <button onClick={login} style={{ background:"#E85A1A", border:"none", borderRadius:"6px", padding:"14px 32px", color:"#fff", fontFamily:"'Oswald',sans-serif", fontSize:"16px", letterSpacing:"3px", cursor:"pointer" }}>
            SEND LINK →
          </button>
        </>
      )}
    </main>
  );
}
