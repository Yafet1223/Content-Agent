import React, { useState } from 'react';
import {
  Search,
  Filter,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Share2,
  Download,
  FileText
} from 'lucide-react';

export default function LibraryView({
  libraryItems = [],
  onOpenProject,
  onCopyContent
}) {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const filteredItems = libraryItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.snippet.toLowerCase().includes(search.toLowerCase()) ||
      item.brandName.toLowerCase().includes(search.toLowerCase());

    const matchesPlatform =
      platformFilter === 'all' || item.platform.toLowerCase() === platformFilter.toLowerCase();

    return matchesSearch && matchesPlatform;
  });

  const handleCopy = (item, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.snippet);
    setCopiedId(item.id);
    if (onCopyContent) onCopyContent(item.title);
    setTimeout(() => setCopiedId(null), 2000);
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
      case 'blog':
        return 'badge-blog';
      default:
        return 'badge-draft';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Filter and Search Bar */}
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
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Search generated drafts, hooks, and published copies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', height: '36px', padding: '0 12px 0 36px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            style={{ height: '36px', fontSize: '0.82rem', padding: '0 10px' }}
          >
            <option value="all">All Content Formats</option>
            <option value="tiktok">TikTok Scripts</option>
            <option value="instagram">Instagram Carousels</option>
            <option value="linkedin">LinkedIn Posts</option>
            <option value="x">X Threads</option>
            <option value="blog">Blog Articles</option>
          </select>
        </div>
      </div>

      {/* Library Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px'
        }}
      >
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="card card-hover"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              {/* Card Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className={`badge ${getPlatformBadgeClass(item.platform)}`}>
                    {item.platform}
                  </span>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      color: 'var(--text-muted)',
                      textTransform: 'capitalize'
                    }}
                  >
                    {item.format}
                  </span>
                </div>
                <span className="badge badge-completed">{item.status}</span>
              </div>

              {/* Title */}
              <h4
                style={{
                  fontSize: '0.98rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                  lineHeight: 1.35
                }}
              >
                {item.title}
              </h4>

              {/* Preview Snippet */}
              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  fontFamily: item.platform === 'TikTok' ? 'var(--font-mono)' : 'inherit',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  border: '1px solid var(--border-light)'
                }}
              >
                "{item.snippet}"
              </div>
            </div>

            {/* Bottom metadata & actions */}
            <div
              style={{
                paddingTop: '12px',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                <span>{item.brandName}</span> • <span>{item.wordCount} words</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={(e) => handleCopy(item, e)}
                  className="btn btn-secondary btn-sm"
                  title="Copy content snippet"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check size={13} color="var(--success)" />
                      <span style={{ color: 'var(--success)' }}>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
