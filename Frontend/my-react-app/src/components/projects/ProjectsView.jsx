import React, { useState } from 'react';
import {
  LayoutGrid,
  List,
  Filter,
  Search,
  Plus,
  MoreVertical,
  ExternalLink,
  Copy,
  Trash2,
  Archive,
  Edit2,
  FolderKanban,
  CheckCircle2,
  Clock,
  FileEdit,
  ArrowUpDown
} from 'lucide-react';

export default function ProjectsView({
  projects = [],
  brands = [],
  onOpenProject,
  onCreateNew,
  onDuplicateProject,
  onDeleteProject,
  onRenameProject
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brandName.toLowerCase().includes(search.toLowerCase()) ||
      p.topic?.toLowerCase().includes(search.toLowerCase());

    const matchesPlatform =
      platformFilter === 'all' || p.platform.toLowerCase() === platformFilter.toLowerCase();

    const matchesStatus =
      statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesBrand = brandFilter === 'all' || p.brandId === brandFilter;

    return matchesSearch && matchesPlatform && matchesStatus && matchesBrand;
  });

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
      case 'facebook':
        return 'badge-facebook';
      case 'blog':
        return 'badge-blog';
      default:
        return 'badge-draft';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ready for Review':
        return <span className="badge badge-review">Ready for Review</span>;
      case 'In Progress':
        return <span className="badge badge-in-progress pulse-active">In Progress</span>;
      case 'Completed':
        return <span className="badge badge-completed">Completed</span>;
      default:
        return <span className="badge badge-draft">Draft</span>;
    }
  };

  const startRename = (project, e) => {
    e.stopPropagation();
    setRenameId(project.id);
    setRenameValue(project.name);
    setActiveMenuId(null);
  };

  const saveRename = (id) => {
    if (renameValue.trim()) {
      onRenameProject(id, renameValue.trim());
    }
    setRenameId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Controls Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          {/* Search box */}
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '400px' }}>
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
              placeholder="Search projects by name, brand, or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', height: '36px', padding: '0 12px 0 36px' }}
            />
          </div>

          {/* Right utility buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              <button
                onClick={() => setViewMode('grid')}
                className="btn-ghost"
                style={{
                  width: '36px',
                  height: '36px',
                  padding: 0,
                  backgroundColor: viewMode === 'grid' ? '#ffffff' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)'
                }}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="btn-ghost"
                style={{
                  width: '36px',
                  height: '36px',
                  padding: 0,
                  backgroundColor: viewMode === 'list' ? '#ffffff' : 'transparent',
                  color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)'
                }}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>

            <button onClick={onCreateNew} className="btn btn-primary btn-sm" style={{ height: '36px' }}>
              <Plus size={16} />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            paddingTop: '10px',
            borderTop: '1px solid var(--border-light)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              color: 'var(--text-muted)'
            }}
          >
            <Filter size={14} />
            <span>Filters:</span>
          </div>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            style={{ height: '32px', fontSize: '0.8rem', padding: '0 8px' }}
          >
            <option value="all">All Platforms</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="x">X (Twitter)</option>
            <option value="facebook">Facebook</option>
            <option value="blog">Blog</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ height: '32px', fontSize: '0.8rem', padding: '0 8px' }}
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="in progress">In Progress</option>
            <option value="ready for review">Ready for Review</option>
            <option value="completed">Completed</option>
          </select>

          {/* Brand Filter */}
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            style={{ height: '32px', fontSize: '0.8rem', padding: '0 8px' }}
          >
            <option value="all">All Brand Profiles</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {(platformFilter !== 'all' || statusFilter !== 'all' || brandFilter !== 'all' || search) && (
            <button
              onClick={() => {
                setPlatformFilter('all');
                setStatusFilter('all');
                setBrandFilter('all');
                setSearch('');
              }}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.76rem', color: 'var(--danger-text)' }}
            >
              Reset Filters
            </button>
          )}

          <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredProjects.length}</strong> of {projects.length} projects
          </span>
        </div>
      </div>

      {/* Projects Display: Grid or List */}
      {filteredProjects.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '56px 24px',
            backgroundColor: '#ffffff'
          }}
        >
          <FolderKanban size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>No projects matched your criteria</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Try adjusting your search terms or filters to find what you need.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onOpenProject(project.id)}
              className="card card-hover card-interactive"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Header row with platform and status */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}
                >
                  <span className={`badge ${getPlatformBadgeClass(project.platform)}`}>
                    {project.platform}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getStatusBadge(project.status)}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === project.id ? null : project.id);
                      }}
                      className="btn-ghost"
                      style={{ padding: '4px', borderRadius: 'var(--radius-xs)' }}
                    >
                      <MoreVertical size={16} color="var(--text-muted)" />
                    </button>
                  </div>
                </div>

                {/* Context dropdown menu */}
                {activeMenuId === project.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '48px',
                      width: '160px',
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--border-subtle)',
                      padding: '4px',
                      zIndex: 30
                    }}
                  >
                    <button
                      onClick={(e) => startRename(project, e)}
                      className="btn btn-ghost"
                      style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '6px 8px' }}
                    >
                      <Edit2 size={14} /> Rename
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateProject(project.id);
                        setActiveMenuId(null);
                      }}
                      className="btn btn-ghost"
                      style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '6px 8px' }}
                    >
                      <Copy size={14} /> Duplicate
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(project.id);
                        setActiveMenuId(null);
                      }}
                      className="btn btn-ghost"
                      style={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        fontSize: '0.8rem',
                        padding: '6px 8px',
                        color: 'var(--danger-text)'
                      }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}

                {/* Title or Rename Input */}
                {renameId === project.id ? (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}
                  >
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      style={{ flex: 1, height: '32px', fontSize: '0.85rem', padding: '0 8px' }}
                      autoFocus
                    />
                    <button
                      onClick={() => saveRename(project.id)}
                      className="btn btn-primary btn-sm"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <h4
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: '8px',
                      lineHeight: 1.35
                    }}
                  >
                    {project.name}
                  </h4>
                )}

                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '16px'
                  }}
                >
                  {project.topic || 'No topic description added.'}
                </p>
              </div>

              {/* Bottom metadata */}
              <div
                style={{
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}
              >
                <div>
                  <strong>{project.brandName}</strong> • {project.format}
                </div>
                <div>{project.lastUpdated}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List / Table View */
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.78rem'
                }}
              >
                <th style={{ padding: '12px 18px' }}>Project Name</th>
                <th style={{ padding: '12px 16px' }}>Brand</th>
                <th style={{ padding: '12px 16px' }}>Platform</th>
                <th style={{ padding: '12px 16px' }}>Format</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Last Updated</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  onClick={() => onOpenProject(project.id)}
                  style={{
                    borderBottom: '1px solid var(--border-light)',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {project.name}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                    {project.brandName}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge ${getPlatformBadgeClass(project.platform)}`}>
                      {project.platform}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {project.format}
                  </td>
                  <td style={{ padding: '14px 16px' }}>{getStatusBadge(project.status)}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                    {project.lastUpdated}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProject(project.id);
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
