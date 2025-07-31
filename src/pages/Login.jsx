import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = isLogin 
        ? await login(email, password)
        : await signup(email, password);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Failed to sign in with Google');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#000',
      overflow: 'hidden'
    }}>
      {/* Background Video */}
      <div style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}>
        <video
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.3
          }}
          src="/water-swirl.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.4), rgba(0,0,0,0.8))'
        }} />
      </div>

      {/* Content */}
      <div style={{ 
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px'
      }}>
        <div style={{ 
          width: '100%',
          maxWidth: '400px'
        }}>
          {/* Logo */}
          <div style={{ 
            marginBottom: '48px',
            textAlign: 'center'
          }}>
            <h1 style={{ 
              color: 'white',
              fontSize: '48px',
              fontWeight: '200',
              margin: '0 0 16px 0'
            }}>
              HealFast
            </h1>
            <div style={{ 
              color: 'rgba(255,255,255,0.4)',
              fontSize: '12px',
              fontWeight: '300',
              letterSpacing: '0.3em',
              textTransform: 'uppercase'
            }}>
              Transform Through Fasting
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
            {error && (
              <div style={{ 
                color: 'rgba(255,100,100,0.8)',
                fontSize: '12px',
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  width: '100%',
                  padding: '16px 24px',
                  marginBottom: '16px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '50px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
              />
              
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  width: '100%',
                  padding: '16px 24px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '50px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%',
                padding: '16px',
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '50px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.3s',
                transform: 'scale(1)'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => !loading && (e.target.style.transform = 'scale(1)')}
              onMouseDown={(e) => !loading && (e.target.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Divider */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            margin: '32px 0'
          }}>
            <div style={{ 
              flex: 1,
              height: '0.5px',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }} />
            <span style={{ 
              padding: '0 16px',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>or</span>
            <div style={{ 
              flex: 1,
              height: '0.5px',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }} />
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '16px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '300',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'rgba(255,255,255,0.05)')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Toggle */}
          <div style={{ 
            textAlign: 'center',
            marginTop: '32px'
          }}>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{ 
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0
              }}
              onMouseEnter={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '128px',
        background: 'linear-gradient(to top, black, transparent)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}