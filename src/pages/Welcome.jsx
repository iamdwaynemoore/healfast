import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Welcome() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUserProfile } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const result = await updateUserProfile({ full_name: name });
      if (result.success) {
        navigate('/dashboard');
      } else {
        console.error('Error updating profile:', result.error);
        // Still navigate to dashboard even if update fails
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Still navigate to dashboard even if update fails
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover opacity-20"
          src="/water-swirl.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          {/* Logo */}
          <img 
            src="/healfast-logo.png" 
            alt="Heal Fast" 
            className="h-20 mx-auto mb-12 opacity-90"
          />

          {/* Welcome Text */}
          <div className="mb-12 space-y-4">
            <h1 className="text-white text-4xl font-light">
              Welcome to Your Journey
            </h1>
            <p className="text-white/60 text-sm font-light leading-relaxed">
              Transform your health through the ancient practice of fasting, 
              reimagined for modern life.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-white/40 text-xs font-light tracking-[0.3em] uppercase block">
                What shall we call you?
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white text-center placeholder:text-white/40 focus:outline-none focus:border-white/20 transition-all duration-300"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full py-4 bg-white text-black rounded-full font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : 'Begin'}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-16 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-white/80 text-2xl font-light mb-2">16:8</div>
              <div className="text-white/40 text-[10px] uppercase tracking-wider">Popular</div>
            </div>
            <div className="text-center">
              <div className="text-white/80 text-2xl font-light mb-2">24h</div>
              <div className="text-white/40 text-[10px] uppercase tracking-wider">Effective</div>
            </div>
            <div className="text-center">
              <div className="text-white/80 text-2xl font-light mb-2">48h</div>
              <div className="text-white/40 text-[10px] uppercase tracking-wider">Advanced</div>
            </div>
          </div>

          {/* Tagline */}
          <div className="mt-16">
            <p className="text-white/30 text-xs font-light tracking-wider">
              Your body knows how to heal. We help you listen.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}