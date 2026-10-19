import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Plus,
  User,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Command,
  ChevronDown
} from 'lucide-react';

export default function Header({
  activeTab,
  currentProjectTitle,
  onCreateNew,
  searchQuery,
  setSearchQuery,
  onOpenProject
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'AI Evaluation Completed',
      desc: 'Sakura Bistro TikTok script scored 94/100 brand consistency.',
      time: '12m ago',
      unread: true
    },
    {
      id: 2,
      type: 'info',
      title: 'Tavily Web Research Updated',
      desc: '3 new viral food trend sources scraped for date-night restaurant hooks.',
      time: '1h ago',
      unread: true
    },
    {
      id: 3,
      type: 'system',
      title: 'Content Scheduled',
      desc: 'LinkedIn post scheduled for Oct 22 at 8:45 AM.',
      time: 'Yesterday',
      unread: false
    }
  ];

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'projects':
        return 'My Projects';
      case 'calendar':
        return 'Content Calendar';
      case 'library':
        return 'Content Library';
      case 'analytics':
        return 'Analytics & Performance';
      case 'brands':
        return 'Brand Profiles';
      case 'settings':
        return 'Studio Settings';
      case 'workspace':
        return currentProjectTitle || 'Project Workspace';
      default:
        return 'ContentFlow AI';
    }
  };

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.02)'
      }}
    >
      {/* Page Title & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activeTab === 'workspace' && (
              <>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Projects</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--border-strong)' }}>/</span>
              </>
            )}
            <h1
              style={{
                fontSize: '1.18rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                margin: 0
              }}
            >
              {getPageTitle()}
            </h1>
          </div>
          {activeTab === 'dashboard' && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Welcome back, Marcus • AI Studio Active
            </span>
          )}
          {activeTab === 'workspace' && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Interactive AI Workflow & Editor
            </span>
          )}
        </div>
      </div>

      {/* Center Search Bar */}
      <div
        style={{
          flex: 1,
          maxWidth: '440px',
          margin: '0 24px',
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Search projects, topics, or generated drafts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            height: '38px',
            padding: '0 40px 0 36px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            fontSize: '0.85rem'
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
            padding: '2px 5px',
            fontSize: '0.7rem',
            color: 'var(--text-muted)'
          }}
        >
          <Command size={10} />
          <span>K</span>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Prominent Primary Action: Create New Content */}
        <button
          onClick={onCreateNew}
          className="btn btn-primary"
          style={{
            height: '38px',
            padding: '0 16px',
            fontSize: '0.86rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)'
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Create New Content</span>
        </button>

        {/* Notifications Icon with popover */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
            className="btn-secondary"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Bell size={18} color="var(--text-secondary)" />
            <span
              style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                border: '2px solid #ffffff'
              }}
            />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '48px',
                width: '340px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                zIndex: 100
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-subtle)'
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Notifications</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--primary)',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Mark all as read
                </span>
              </div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--border-light)',
                      backgroundColor: item.unread ? 'var(--primary-subtle)' : '#ffffff',
                      display: 'flex',
                      gap: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ marginTop: '2px' }}>
                      {item.type === 'success' && <CheckCircle2 size={16} color="var(--success)" />}
                      {item.type === 'info' && <Sparkles size={16} color="var(--primary)" />}
                      {item.type === 'system' && <AlertCircle size={16} color="var(--text-muted)" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)'
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-secondary)',
                          margin: '2px 0 4px 0',
                          lineHeight: 1.4
                        }}
                      >
                        {item.desc}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px 4px 4px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: '#ffffff'
            }}
            className="btn-ghost"
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              M
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.1 }}>
                Marcus Chen
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Growth Lead</span>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '48px',
                width: '220px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-subtle)',
                padding: '6px',
                zIndex: 100
              }}
            >
              <div
                style={{
                  padding: '8px 10px',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '4px'
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Marcus Chen</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  marcus@contentflow.ai
                </div>
              </div>
              <button
                className="btn btn-ghost"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  fontSize: '0.82rem',
                  padding: '8px 10px'
                }}
              >
                Account Profile
              </button>
              <button
                className="btn btn-ghost"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  fontSize: '0.82rem',
                  padding: '8px 10px'
                }}
              >
                Team Workspace
              </button>
              <button
                className="btn btn-ghost"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  fontSize: '0.82rem',
                  padding: '8px 10px'
                }}
              >
                API Tokens & Keys
              </button>
              <div
                style={{
                  height: '1px',
                  backgroundColor: 'var(--border-subtle)',
                  margin: '4px 0'
                }}
              />
              <button
                className="btn btn-ghost"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  fontSize: '0.82rem',
                  padding: '8px 10px',
                  color: 'var(--danger-text)'
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
