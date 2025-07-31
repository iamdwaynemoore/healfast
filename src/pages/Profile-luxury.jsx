import React, { useState, useEffect } from "react";
import { UserProfile, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Settings, Save } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const [currentUser, userProfiles] = await Promise.all([
        User.me(),
        UserProfile.list()
      ]);
      
      setUser(currentUser);
      setProfile(userProfiles[0] || {});
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (profile.id) {
        await UserProfile.update(profile.id, profile);
      } else {
        await UserProfile.create(profile);
      }
      setIsEditing(false);
      loadProfileData();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: '#b794f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#000',
      overflow: 'auto'
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'radial-gradient(ellipse at top right, rgba(183, 148, 246, 0.1), transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '40px 20px 120px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={() => navigate(createPageUrl("Dashboard"))}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ArrowLeft style={{ width: '20px', height: '20px', color: '#fff' }} />
            </button>
            
            <div>
              <h1 style={{
                fontSize: '36px',
                fontWeight: '300',
                letterSpacing: '2px',
                margin: 0,
                background: 'linear-gradient(135deg, #ffffff, #b794f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase'
              }}>
                Profile
              </h1>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.5)',
                margin: 0,
                letterSpacing: '1px'
              }}>
                {user?.full_name || user?.email}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            style={{
              background: isEditing 
                ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                : 'linear-gradient(135deg, #b794f6, #60a5fa)',
              color: '#fff',
              border: 'none',
              borderRadius: '25px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '1px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isEditing ? (
              <>
                <Save style={{ width: '16px', height: '16px' }} />
                SAVE CHANGES
              </>
            ) : (
              <>
                <Settings style={{ width: '16px', height: '16px' }} />
                EDIT PROFILE
              </>
            )}
          </button>
        </div>

        {/* Personal Information */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '400',
            color: '#b794f6',
            marginBottom: '25px',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #b794f6, #60a5fa)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="#fff" strokeWidth="1.5"/>
              </svg>
            </div>
            Personal Information
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {[
              { label: 'Height', key: 'height', unit: 'cm', type: 'number' },
              { label: 'Weight', key: 'weight', unit: 'kg', type: 'number' },
              { label: 'Age', key: 'age', unit: '', type: 'number' },
              { 
                label: 'Gender', 
                key: 'gender', 
                type: 'select',
                options: [
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' }
                ]
              }
            ].map((field) => (
              <div key={field.key}>
                <label style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  {field.label}
                </label>
                {isEditing ? (
                  field.type === 'select' ? (
                    <select
                      value={profile[field.key] || ''}
                      onChange={(e) => setProfile({...profile, [field.key]: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(183, 148, 246, 0.5)';
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      }}
                    >
                      <option value="" style={{ backgroundColor: '#000' }}>Select {field.label}</option>
                      {field.options.map(opt => (
                        <option key={opt.value} value={opt.value} style={{ backgroundColor: '#000' }}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={profile[field.key] || ''}
                      onChange={(e) => setProfile({...profile, [field.key]: parseInt(e.target.value) || ''})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(183, 148, 246, 0.5)';
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      }}
                    />
                  )
                ) : (
                  <div style={{
                    fontSize: '18px',
                    color: '#fff',
                    fontWeight: '300'
                  }}>
                    {profile[field.key] 
                      ? field.unit 
                        ? `${profile[field.key]} ${field.unit}`
                        : field.key === 'gender' 
                          ? profile[field.key].charAt(0).toUpperCase() + profile[field.key].slice(1)
                          : profile[field.key]
                      : <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>Not set</span>
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Fasting Goals */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '30px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '400',
            color: '#60a5fa',
            marginBottom: '25px',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="1.5"/>
                <path d="M12 6v6l4 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            Fasting Goals
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {[
              { 
                label: 'Primary Goal', 
                key: 'primary_goal',
                type: 'select',
                options: [
                  { value: 'weight_loss', label: 'Weight Loss' },
                  { value: 'health_improvement', label: 'Health Improvement' },
                  { value: 'spiritual', label: 'Spiritual Growth' },
                  { value: 'longevity', label: 'Longevity' },
                  { value: 'other', label: 'Other' }
                ]
              },
              { 
                label: 'Experience Level', 
                key: 'fasting_experience',
                type: 'select',
                options: [
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' }
                ]
              }
            ].map((field) => (
              <div key={field.key}>
                <label style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  {field.label}
                </label>
                {isEditing ? (
                  <select
                    value={profile[field.key] || ''}
                    onChange={(e) => setProfile({...profile, [field.key]: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(96, 165, 250, 0.5)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    <option value="" style={{ backgroundColor: '#000' }}>Select {field.label}</option>
                    {field.options.map(opt => (
                      <option key={opt.value} value={opt.value} style={{ backgroundColor: '#000' }}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div style={{
                    fontSize: '18px',
                    color: '#fff',
                    fontWeight: '300'
                  }}>
                    {profile[field.key] 
                      ? field.options.find(opt => opt.value === profile[field.key])?.label || profile[field.key]
                      : <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>Not set</span>
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sign Out Button */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <button
            onClick={async () => {
              try {
                await User.signOut();
                navigate(createPageUrl('Login'));
              } catch (error) {
                console.error('Error signing out:', error);
              }
            }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              color: '#ef4444',
              borderRadius: '25px',
              padding: '12px 30px',
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '1px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.borderColor = '#ef4444';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100px',
        background: 'linear-gradient(to top, #000 50%, transparent)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: '20px',
        zIndex: 20
      }}>
        <div style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'center'
        }}>
          {[
            { icon: 'home', page: 'Dashboard' },
            { icon: 'breath', page: 'Breathe' },
            { icon: 'timer', page: 'ActiveTimer' },
            { icon: 'nutrition', page: 'Nutrition' },
            { icon: 'profile', page: 'Profile', active: true }
          ].map((item) => (
            <button
              key={item.page}
              onClick={() => !item.active && navigate(createPageUrl(item.page))}
              style={{
                width: item.active ? '56px' : '44px',
                height: item.active ? '56px' : '44px',
                borderRadius: '50%',
                border: 'none',
                background: item.active 
                  ? 'linear-gradient(135deg, #b794f6, #60a5fa)'
                  : 'rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {item.active && (
                <>
                  <div style={{
                    position: 'absolute',
                    inset: '-4px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #b794f6, #60a5fa)',
                    opacity: 0.3,
                    filter: 'blur(8px)'
                  }} />
                  <div style={{
                    position: 'absolute',
                    inset: '-8px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #b794f6, #60a5fa)',
                    opacity: 0.2,
                    filter: 'blur(16px)'
                  }} />
                </>
              )}
              <div style={{ position: 'relative', zIndex: 1 }}>
                {item.icon === 'profile' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={item.active ? '#fff' : '#888'} strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="12" cy="7" r="4" stroke={item.active ? '#fff' : '#888'} strokeWidth="1.5"/>
                  </svg>
                )}
                {item.icon === 'home' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" fill="#888"/>
                    <circle cx="12" cy="12" r="8" stroke="#888" strokeWidth="1.5" fill="none"/>
                  </svg>
                )}
                {item.icon === 'breath' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3c-2 2-2 4 0 6 2-2 2-4 0-6z" stroke="#888" strokeWidth="1.5" fill="none"/>
                    <circle cx="12" cy="12" r="2" stroke="#888" strokeWidth="1.5" fill="none"/>
                  </svg>
                )}
                {item.icon === 'timer' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="1.5"/>
                    <polyline points="12,6 12,12 16,14" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
                {item.icon === 'nutrition' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 2v7c0 6 4 10 9 10s9-4 9-10V2" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M9 2v20" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}