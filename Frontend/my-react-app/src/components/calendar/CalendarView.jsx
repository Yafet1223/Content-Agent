import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Filter,
  Layers,
  CheckCircle2,
  List,
  Grid
} from 'lucide-react';

export default function CalendarView({
  scheduleItems = [],
  brands = [],
  onCreateNew,
  onOpenProject
}) {
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week' | 'list'
  const [currentMonth, setCurrentMonth] = useState('October 2026');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [selectedDay, setSelectedDay] = useState(null);

  // Calendar dates representation for October 2026
  // October 1, 2026 starts on a Thursday (day index 4, assuming Sunday is 0)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Map schedule items to calendar days
  const eventsByDay = {
    20: [
      {
        id: 'ev-1',
        title: 'Sakura Bistro: Torched Salmon Reel',
        platform: 'TikTok',
        time: '6:30 PM',
        status: 'Ready',
        brand: 'Sakura Japanese Bistro',
        projectId: 'proj-1'
      }
    ],
    21: [
      {
        id: 'ev-2',
        title: 'Star Skin Care: Barrier Routine',
        platform: 'Instagram',
        time: '11:00 AM',
        status: 'In Review',
        brand: 'Star Skin Care',
        projectId: 'proj-2'
      }
    ],
    22: [
      {
        id: 'ev-3',
        title: 'Senior to EM Transition Lessons',
        platform: 'LinkedIn',
        time: '8:45 AM',
        status: 'Scheduled',
        brand: 'Apex Cloud AI',
        projectId: 'proj-3'
      }
    ],
    24: [
      {
        id: 'ev-4',
        title: 'Premature Optimization Thread',
        platform: 'X',
        time: '2:00 PM',
        status: 'Scheduled',
        brand: 'Apex Cloud AI',
        projectId: 'proj-4'
      }
    ],
    27: [
      {
        id: 'ev-5',
        title: 'Star Skin Care: Ingredient Spotlight',
        platform: 'TikTok',
        time: '4:15 PM',
        status: 'Draft',
        brand: 'Star Skin Care',
        projectId: 'proj-2'
      }
    ]
  };

  const getPlatformBadgeClass = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'tiktok':
        return 'badge-tiktok';
      case 'instagram':
        return 'badge-instagram';
      case 'linkedin':
        return 'badge-linkedin';
      case 'x':
      case 'twitter':
        return 'badge-x';
      default:
        return 'badge-draft';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Calendar Header Controls */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn-secondary btn-icon-only" style={{ width: '32px', height: '32px' }}>
              <ChevronLeft size={16} />
            </button>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, minWidth: '140px', textAlign: 'center' }}>
              {currentMonth}
            </h3>
            <button className="btn-secondary btn-icon-only" style={{ width: '32px', height: '32px' }}>
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => setCurrentMonth('October 2026')}
            className="btn btn-secondary btn-sm"
          >
            Today
          </button>
        </div>

        {/* Filters and View Modes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            style={{ height: '34px', fontSize: '0.8rem', padding: '0 8px' }}
          >
            <option value="all">All Channels</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="x">X (Twitter)</option>
          </select>

          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            style={{ height: '34px', fontSize: '0.8rem', padding: '0 8px' }}
          >
            <option value="all">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div
            style={{
              display: 'flex',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-subtle)'
            }}
          >
            {['month', 'week', 'list'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  textTransform: 'capitalize',
                  fontWeight: 500,
                  backgroundColor: viewMode === mode ? '#ffffff' : 'transparent',
                  color: viewMode === mode ? 'var(--primary)' : 'var(--text-muted)'
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          <button onClick={onCreateNew} className="btn btn-primary btn-sm" style={{ height: '34px' }}>
            <Plus size={15} />
            <span>Schedule Content</span>
          </button>
        </div>
      </div>

      {/* View Display */}
      {viewMode === 'month' ? (
        <div className="card" style={{ padding: '16px', overflow: 'hidden' }}>
          {/* Day of Week Headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* 7-column calendar grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '1px',
              backgroundColor: 'var(--border-light)',
              marginTop: '1px'
            }}
          >
            {/* Empty slots for Thursday start in Oct 2026 (Sun, Mon, Tue, Wed = 4 offset days) */}
            {[27, 28, 29, 30].map((prevDay) => (
              <div
                key={`prev-${prevDay}`}
                style={{
                  minHeight: '110px',
                  backgroundColor: '#fbfbfe',
                  padding: '8px',
                  color: 'var(--text-muted)',
                  fontSize: '0.76rem'
                }}
              >
                {prevDay}
              </div>
            ))}

            {/* Days of October */}
            {daysInMonth.map((day) => {
              const dayEvents = eventsByDay[day] || [];
              const isToday = day === 17;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    minHeight: '110px',
                    backgroundColor: isToday ? 'var(--primary-subtle)' : '#ffffff',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isToday) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isToday) e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '2px'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: isToday ? 700 : 500,
                        color: isToday ? 'var(--primary)' : 'var(--text-primary)',
                        width: '22px',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: isToday ? '50%' : 'none',
                        backgroundColor: isToday ? 'var(--primary)' : 'transparent',
                        color: isToday ? '#ffffff' : 'inherit'
                      }}
                    >
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {dayEvents.length} post{dayEvents.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Event cards inside date cell */}
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (ev.projectId) onOpenProject(ev.projectId);
                      }}
                      style={{
                        padding: '4px 6px',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                        fontSize: '0.72rem',
                        lineHeight: 1.25,
                        cursor: 'pointer'
                      }}
                      title={`${ev.title} (${ev.time})`}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginBottom: '2px'
                        }}
                      >
                        <span
                          className={`badge ${getPlatformBadgeClass(ev.platform)}`}
                          style={{ padding: '1px 4px', fontSize: '0.65rem' }}
                        >
                          {ev.platform}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                          {ev.time}
                        </span>
                      </div>
                      <div
                        style={{
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {ev.title}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List / Week View */
        <div className="card" style={{ padding: '24px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>
            Scheduled Publishing Queue (October 2026)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(eventsByDay).map(([day, items]) => (
              <div
                key={day}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border-light)'
                }}
              >
                <div
                  style={{
                    width: '60px',
                    textAlign: 'center',
                    padding: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    fontSize: '1.1rem'
                  }}
                >
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    OCT
                  </div>
                  {day}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {items.map((it) => (
                    <div
                      key={it.id}
                      onClick={() => it.projectId && onOpenProject(it.projectId)}
                      className="card card-hover card-interactive"
                      style={{
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span className={`badge ${getPlatformBadgeClass(it.platform)}`}>
                            {it.platform}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {it.brand}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>•</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {it.time}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>{it.title}</div>
                      </div>
                      <span className="badge badge-completed">{it.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
