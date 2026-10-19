import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Edit3,
  X,
  Check,
  Tag,
  Palette,
  ShieldAlert,
  Sliders,
  Layers
} from 'lucide-react';

export default function BrandProfilesView({ brands = [], onSaveBrand }) {
  const [editingBrand, setEditingBrand] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form state for creating/editing
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAudience: '',
    voiceAndTone: '',
    coreMessaging: '',
    preferredTerminology: '',
    phrasesToAvoid: '',
    brandColors: ['#4f46e5', '#7c3aed', '#0f172a', '#ffffff'],
    logo: '✨',
    contentGuidelines: '',
    preferredPlatforms: ['TikTok', 'Instagram']
  });

  const openEditor = (brand) => {
    setEditingBrand(brand);
    setIsCreatingNew(false);
    setFormData({
      ...brand,
      preferredTerminology: Array.isArray(brand.preferredTerminology)
        ? brand.preferredTerminology.join(', ')
        : brand.preferredTerminology,
      phrasesToAvoid: Array.isArray(brand.phrasesToAvoid)
        ? brand.phrasesToAvoid.join(', ')
        : brand.phrasesToAvoid
    });
  };

  const openNewBrand = () => {
    setEditingBrand(null);
    setIsCreatingNew(true);
    setFormData({
      name: '',
      description: '',
      targetAudience: '',
      voiceAndTone: '',
      coreMessaging: '',
      preferredTerminology: 'High quality, authentic, trusted',
      phrasesToAvoid: 'Cheap, magic fix, overnight',
      brandColors: ['#4f46e5', '#7c3aed', '#0f172a', '#ffffff'],
      logo: '🚀',
      contentGuidelines: 'Natural lighting, concise messaging, transparent ingredients/metrics.',
      preferredPlatforms: ['TikTok', 'LinkedIn']
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...formData,
      id: editingBrand ? editingBrand.id : `brand-${Date.now()}`,
      preferredTerminology: formData.preferredTerminology
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      phrasesToAvoid: formData.phrasesToAvoid
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    };

    onSaveBrand(updated);
    setEditingBrand(null);
    setIsCreatingNew(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header bar */}
      <div
        className="card"
        style={{
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.12rem', fontWeight: 600, margin: 0 }}>
            Brand Identity Profiles
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Configure tone, prohibited phrases, and design directions used by the AI agent during
            generation
          </span>
        </div>
        <button onClick={openNewBrand} className="btn btn-primary btn-sm" style={{ height: '36px' }}>
          <Plus size={16} />
          <span>Add Brand Profile</span>
        </button>
      </div>

      {/* Brand Profile Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}
      >
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="card card-hover"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px'
            }}
          >
            <div>
              {/* Brand Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary-subtle)',
                      border: '1px solid var(--primary-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem'
                    }}
                  >
                    {brand.logo || '✨'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {brand.name}
                    </h4>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {brand.preferredPlatforms?.join(' • ')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openEditor(brand)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '4px' }}
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.45,
                  marginBottom: '16px'
                }}
              >
                {brand.description}
              </p>

              {/* Brand Palette */}
              <div style={{ marginBottom: '16px' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '6px'
                  }}
                >
                  Brand Palette
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {brand.brandColors?.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: c,
                        border: '1px solid rgba(0,0,0,0.1)'
                      }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              {/* Voice and Tone */}
              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '14px',
                  fontSize: '0.8rem'
                }}
              >
                <strong style={{ color: 'var(--text-primary)' }}>Voice & Tone: </strong>
                <span style={{ color: 'var(--text-secondary)' }}>{brand.voiceAndTone}</span>
              </div>

              {/* Preferred Terminology */}
              <div style={{ marginBottom: '12px' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '6px'
                  }}
                >
                  Key Terminology
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {brand.preferredTerminology?.slice(0, 4).map((t, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--success-subtle)',
                        color: 'var(--success-text)',
                        border: '1px solid var(--success-border)'
                      }}
                    >
                      + {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Phrases to Avoid */}
              <div>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '6px'
                  }}
                >
                  Phrases to Avoid
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {brand.phrasesToAvoid?.slice(0, 3).map((t, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--danger-subtle)',
                        color: 'var(--danger-text)',
                        border: '1px solid var(--danger-border)'
                      }}
                    >
                      ✕ {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom target audience */}
            <div
              style={{
                paddingTop: '12px',
                borderTop: '1px solid var(--border-light)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}
            >
              Audience: {brand.targetAudience}
            </div>
          </div>
        ))}
      </div>

      {/* Brand Profile Editor / Creator Modal */}
      {(editingBrand || isCreatingNew) && (
        <div
          className="modal-overlay"
          onClick={() => {
            setEditingBrand(null);
            setIsCreatingNew(false);
          }}
        >
          <div
            className="modal-card"
            style={{ maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>
                {isCreatingNew ? 'Create New Brand Profile' : `Edit ${editingBrand?.name}`}
              </h3>
              <button
                onClick={() => {
                  setEditingBrand(null);
                  setIsCreatingNew(false);
                }}
                className="btn-ghost btn-icon-only"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div
                className="modal-body"
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', marginBottom: '4px' }}>
                      Logo Icon
                    </label>
                    <input
                      type="text"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      style={{ width: '100%', height: '36px', textAlign: 'center', fontSize: '1.2rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', marginBottom: '4px' }}>
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{ width: '100%', height: '36px', padding: '0 10px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', marginBottom: '4px' }}>
                    Brand Description & Offering
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', marginBottom: '4px' }}>
                    Target Audience Demographics & Needs
                  </label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    style={{ width: '100%', height: '36px', padding: '0 10px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', marginBottom: '4px' }}>
                    Voice and Tone Directives
                  </label>
                  <input
                    type="text"
                    value={formData.voiceAndTone}
                    onChange={(e) => setFormData({ ...formData, voiceAndTone: e.target.value })}
                    style={{ width: '100%', height: '36px', padding: '0 10px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', marginBottom: '4px' }}>
                    Core Messaging & Value Proposition
                  </label>
                  <input
                    type="text"
                    value={formData.coreMessaging}
                    onChange={(e) => setFormData({ ...formData, coreMessaging: e.target.value })}
                    style={{ width: '100%', height: '36px', padding: '0 10px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', marginBottom: '4px' }}>
                      Preferred Terminology (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.preferredTerminology}
                      onChange={(e) =>
                        setFormData({ ...formData, preferredTerminology: e.target.value })
                      }
                      style={{ width: '100%', height: '36px', padding: '0 10px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', marginBottom: '4px' }}>
                      Phrases to Avoid (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.phrasesToAvoid}
                      onChange={(e) =>
                        setFormData({ ...formData, phrasesToAvoid: e.target.value })
                      }
                      style={{ width: '100%', height: '36px', padding: '0 10px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', marginBottom: '4px' }}>
                    Content Guidelines & Visual Direction
                  </label>
                  <textarea
                    rows={2}
                    value={formData.contentGuidelines}
                    onChange={(e) =>
                      setFormData({ ...formData, contentGuidelines: e.target.value })
                    }
                    style={{ width: '100%', padding: '8px 10px' }}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBrand(null);
                    setIsCreatingNew(false);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Save Brand Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
