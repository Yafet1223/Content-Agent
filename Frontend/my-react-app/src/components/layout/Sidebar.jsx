import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CalendarDays,
  Library,
  BarChart3,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Layers
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  onCreateNew,
  projectCount = 0
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'My Projects', icon: FolderKanban, badge: projectCount },
    { id: 'calendar', label: 'Content Calendar', icon: CalendarDays },
    { id: 'library', label: 'Content Library', icon: Library },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      style={{
        width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        minWidth: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        zIndex: 50,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '0 8px' : '0 20px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          onClick={() => setActiveTab('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 4px rgba(79, 70, 229, 0.25)',
              flexShrink: 0
            }}
          >
            <Layers size={20} strokeWidth={2.2} />
          </div>
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  ContentFlow
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                    border: '1px solid var(--primary-border)',
                    letterSpacing: '0.04em'
                  }}
                >
                  AI
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  fontWeight: 400
                }}
              >
                Creation Studio
              </span>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            title="Collapse Sidebar"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              border: '1px solid transparent',
            }}
            className="btn-ghost"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Quick Action Button */}
      <div style={{ padding: collapsed ? '14px 10px' : '16px 16px 8px 16px' }}>
        <button
          onClick={onCreateNew}
          style={{
            width: '100%',
            height: '40px',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '0.86rem',
            border: 'none',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all 0.15s ease'
          }}
          className="btn-primary"
          title="Create New Content"
        >
          <PlusCircle size={18} />
          {!collapsed && <span>New Content</span>}
        </button>
      </div>

      {/* Navigation Links */}
      <div style={{ flex: 1, padding: '10px 10px 16px 10px' }}>
        {!collapsed && (
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              padding: '8px 12px 6px 12px'
            }}
          >
            Main Menu
          </div>
        )}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={collapsed ? item.label : undefined}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: collapsed ? '10px 0' : '10px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive ? 'var(--primary-subtle)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.88rem',
                  border: isActive ? '1px solid var(--primary-border)' : '1px solid transparent',
                  transition: 'all 0.12s ease',
                  position: 'relative'
                }}
                className={isActive ? '' : 'btn-ghost'}
              >
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  style={{
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    flexShrink: 0
                  }}
                />
                {!collapsed && (
                  <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                )}
                {!collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-subtle)',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Expand Button if Collapsed */}
      {collapsed && (
        <div style={{ padding: '8px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setCollapsed(false)}
            title="Expand Sidebar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
            className="btn-ghost"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* User Brand Status Bar */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: collapsed ? '12px 8px' : '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#fafafa'
        }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#eef2ff',
            border: '1px solid #c7d2fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            flexShrink: 0
          }}
        >
          ⚡
        </div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <div
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}
            >
              FastAPI Agent
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success)',
                  display: 'inline-block'
                }}
              />
              Agent Engine Online
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
