import React, { useState } from 'react';
import {
  TrendingUp,
  Eye,
  Heart,
  Share2,
  BarChart2,
  Info,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function AnalyticsView({ analyticsData }) {
  const [dateRange, setDateRange] = useState('30d');
  const { overview, bestPerforming, platformBreakdown } = analyticsData;

  // Monthly trend datapoints for clean SVG chart
  const trendData = [
    { label: 'Sep 15', reach: 35, engagement: 4.2 },
    { label: 'Sep 22', reach: 48, engagement: 4.8 },
    { label: 'Sep 29', reach: 62, engagement: 5.1 },
    { label: 'Oct 06', reach: 78, engagement: 5.4 },
    { label: 'Oct 13', reach: 95, engagement: 5.9 },
    { label: 'Oct 17', reach: 110, engagement: 6.2 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Sample Data Notice Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 18px',
          backgroundColor: 'var(--primary-subtle)',
          border: '1px solid var(--primary-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--primary)',
          fontSize: '0.84rem'
        }}
      >
        <Info size={18} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <strong>Sample Design Data:</strong> These metrics illustrate social performance
          projections and campaign benchmarks. Live API platform integrations can be connected in
          Settings.
        </div>
      </div>

      {/* Date Range Selector */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        {['7d', '30d', '90d'].map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className="btn btn-secondary btn-sm"
            style={{
              backgroundColor: dateRange === range ? 'var(--primary)' : '#ffffff',
              color: dateRange === range ? '#ffffff' : 'var(--text-secondary)',
              borderColor: dateRange === range ? 'var(--primary)' : 'var(--border-subtle)',
              fontSize: '0.78rem'
            }}
          >
            Last {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '3 Months'}
          </button>
        ))}
      </div>

      {/* Metric Cards (4 KPIs) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Total Reach */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Total Audience Reach
            </span>
            <Eye size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {overview.totalReach}
          </div>
          <div
            style={{
              fontSize: '0.74rem',
              color: 'var(--success-text)',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <TrendingUp size={12} />
            <span>{overview.reachTrend}</span>
          </div>
        </div>

        {/* Impressions */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Gross Impressions
            </span>
            <BarChart2 size={18} color="var(--lavender)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {overview.impressions}
          </div>
          <div
            style={{
              fontSize: '0.74rem',
              color: 'var(--success-text)',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <TrendingUp size={12} />
            <span>{overview.impressionsTrend}</span>
          </div>
        </div>

        {/* Avg Engagement Rate */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Avg. Engagement Rate
            </span>
            <Heart size={18} color="#e11d48" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {overview.avgEngagementRate}
          </div>
          <div
            style={{
              fontSize: '0.74rem',
              color: 'var(--success-text)',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <TrendingUp size={12} />
            <span>{overview.engagementTrend}</span>
          </div>
        </div>

        {/* Total Shares */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Total Content Shares
            </span>
            <Share2 size={18} color="var(--info)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {overview.totalShares}
          </div>
          <div
            style={{
              fontSize: '0.74rem',
              color: 'var(--success-text)',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <TrendingUp size={12} />
            <span>{overview.sharesTrend}</span>
          </div>
        </div>
      </div>

      {/* Charts Grid: Trends Over Time (Left) + Platform Comparison (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)',
          gap: '20px',
          alignItems: 'start'
        }}
      >
        {/* Performance Trends Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>
                Audience Reach & Trajectory
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Weekly organic reach volume across generated campaigns
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '2px',
                    backgroundColor: 'var(--primary)',
                    display: 'inline-block'
                  }}
                />
                Reach (k)
              </div>
            </div>
          </div>

          {/* SVG Bar / Area visualization */}
          <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '10px 0' }}>
            {trendData.map((d, index) => {
              const heightPct = (d.reach / 120) * 100;
              return (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    height: '100%',
                    justifyContent: 'flex-end'
                  }}
                >
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {d.reach}k
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '44px',
                      height: `${heightPct}%`,
                      backgroundColor: index === trendData.length - 1 ? 'var(--primary)' : '#c7d2fe',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease'
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Share Breakdown */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>
            Platform Distribution
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '20px' }}>
            Engagement contribution by channel
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {platformBreakdown.map((p) => (
              <div key={p.platform}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    marginBottom: '6px'
                  }}
                >
                  <span>{p.platform}</span>
                  <span>{p.share}%</span>
                </div>
                <div
                  style={{
                    height: '8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-subtle)',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      width: `${p.share}%`,
                      height: '100%',
                      backgroundColor: p.color,
                      borderRadius: 'var(--radius-full)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best-Performing Content Table */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>
          Top Performing Content Assets
        </h3>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '16px' }}>
          Highest converting campaigns ranked by organic engagement rate
        </span>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderBottom: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              <th style={{ padding: '10px 14px' }}>Content Title</th>
              <th style={{ padding: '10px 14px' }}>Brand</th>
              <th style={{ padding: '10px 14px' }}>Platform</th>
              <th style={{ padding: '10px 14px' }}>Reach</th>
              <th style={{ padding: '10px 14px' }}>Engagement</th>
              <th style={{ padding: '10px 14px' }}>Impact / Conversions</th>
            </tr>
          </thead>
          <tbody>
            {bestPerforming.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {item.title}
                </td>
                <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{item.brand}</td>
                <td style={{ padding: '14px' }}>
                  <span className="badge badge-draft">{item.platform}</span>
                </td>
                <td style={{ padding: '14px', fontWeight: 600 }}>{item.reach}</td>
                <td style={{ padding: '14px', color: 'var(--success-text)', fontWeight: 600 }}>
                  {item.engagement}
                </td>
                <td style={{ padding: '14px', color: 'var(--text-primary)' }}>{item.conversions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
