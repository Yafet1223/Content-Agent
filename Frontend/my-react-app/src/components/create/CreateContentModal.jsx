import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Save,
  Check,
  ChevronDown,
  Lightbulb,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function CreateContentModal({
  isOpen,
  onClose,
  brands = [],
  onSubmit
}) {
  if (!isOpen) return null;

  const [projectName, setProjectName] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState(brands[0]?.id || 'brand-1');
  const [targetAudience, setTargetAudience] = useState(brands[0]?.targetAudience || '');
  const [contentGoal, setContentGoal] = useState('Brand Awareness & Engagement');
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [format, setFormat] = useState('short-form video');
  const [tone, setTone] = useState('Energetic & Sensory');
  const [keywords, setKeywords] = useState('');

  // Sample quick templates to fill form easily
  const quickTemplates = [
    {
      label: '🎬 TikTok: 3 Mind-Blowing AI Tools for Students',
      brandId: 'brand-1',
      platform: 'TikTok',
      format: 'short-form video',
      name: 'AI Productivity: 3 Mind-Blowing Tools for Students',
      audience: 'High school & college students looking to save time studying and writing papers',
      topic: 'Create a viral 30-second TikTok video script with visual hook ideas showing 3 mind-blowing AI productivity tools for students.',
      goal: 'Viral Reach & Community Growth',
      tone: 'Energetic, Relatable & Fast-Paced',
      keywords: 'productivity, student tools, study hack, time saver'
    },
    {
      label: '✨ Skincare: 3-Step Glass Skin Carousel',
      brandId: 'brand-2',
      platform: 'Instagram',
      format: 'carousel',
      name: 'Star Skin Care: 3-Step Barrier Glow Ritual',
      audience: 'Skincare conscious individuals (18-40) dealing with barrier repair and dull texture',
      topic: 'Educational 7-slide carousel breaking down 3 dermatologist-approved steps for lasting glass skin without 10-step routines.',
      goal: 'Educational Brand Awareness',
      tone: 'Scientific, Conversational & Reassuring',
      keywords: 'ceramides, barrier protection, glass skin, dermatologist recommended'
    },
    {
      label: '💼 Tech: Senior Engineer to Manager Lessons',
      brandId: 'brand-3',
      platform: 'LinkedIn',
      format: 'social media post',
      name: 'Lessons from Transitioning to Engineering Manager',
      audience: 'Senior developers, tech leads, engineering directors',
      topic: 'Write a thought leadership post sharing lessons learned from transitioning from Senior Engineer to Engineering Manager.',
      goal: 'Thought Leadership',
      tone: 'Authoritative, Practical & Story-Driven',
      keywords: 'engineering management, career transition, team autonomy, 1-on-1s'
    }
  ];

  const applyTemplate = (tpl) => {
    setProjectName(tpl.name);
    setSelectedBrandId(tpl.brandId);
    setPlatform(tpl.platform);
    setFormat(tpl.format);
    setTargetAudience(tpl.audience);
    setTopic(tpl.topic);
    setContentGoal(tpl.goal);
    setTone(tpl.tone);
    setKeywords(tpl.keywords);
  };

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setSelectedBrandId(brandId);
    const brand = brands.find((b) => b.id === brandId);
    if (brand && !targetAudience) {
      setTargetAudience(brand.targetAudience);
    }
  };

  const handleSubmit = (actionType) => {
    const finalProjectName =
      projectName.trim() ||
      `${platform} ${format.replace('-', ' ')} - ${new Date().toLocaleDateString()}`;

    const brand = brands.find((b) => b.id === selectedBrandId) || brands[0];

    const newProject = {
      id: `proj-${Date.now()}`,
      name: finalProjectName,
      brandId: selectedBrandId,
      brandName: brand?.name || 'Default Brand',
      platform,
      format,
      status: actionType === 'generate' ? 'In Progress' : 'Draft',
      lastUpdated: 'Just now',
      dateCreated: new Date().toISOString().split('T')[0],
      goal: contentGoal,
      targetAudience,
      topic: topic.trim() || 'Exciting brand update and customer spotlight',
      tone,
      keywords,
      isNewlyCreated: actionType === 'generate'
    };

    onSubmit(newProject, actionType);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '680px', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--primary-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 600, margin: 0 }}>
                Create New Content
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Configure campaign parameters for the AI Creation Agent
              </span>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost btn-icon-only">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Idea Templates */}
          <div>
            <div
              style={{
                fontSize: '0.76rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Lightbulb size={14} color="var(--primary)" />
              <span>Quick Start with realistic templates:</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {quickTemplates.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.76rem', padding: '5px 10px' }}
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Campaign & Brand Identity */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              1. Campaign & Brand Alignment
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    marginBottom: '6px'
                  }}
                >
                  Project / Campaign Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Torched Salmon Launch Reel"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  style={{ width: '100%', height: '38px', padding: '0 12px' }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    marginBottom: '6px'
                  }}
                >
                  Select Brand Profile
                </label>
                <select
                  value={selectedBrandId}
                  onChange={handleBrandChange}
                  style={{ width: '100%', height: '38px', padding: '0 12px' }}
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.logo} {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  marginBottom: '6px'
                }}
              >
                Target Audience
              </label>
              <input
                type="text"
                placeholder="e.g. Local foodies, couples seeking date night dining..."
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                style={{ width: '100%', height: '38px', padding: '0 12px' }}
              />
            </div>
          </div>

          {/* Section 2: Platform & Format */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              2. Channel & Content Architecture
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    marginBottom: '6px'
                  }}
                >
                  Target Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  style={{ width: '100%', height: '38px', padding: '0 10px' }}
                >
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="X">X (Twitter)</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Blog">Blog Article</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    marginBottom: '6px'
                  }}
                >
                  Content Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  style={{ width: '100%', height: '38px', padding: '0 10px' }}
                >
                  <option value="short-form video">Short-form Video</option>
                  <option value="social media post">Social Media Post</option>
                  <option value="carousel">Carousel</option>
                  <option value="blog article">Blog Article</option>
                  <option value="advertisement">Advertisement</option>
                  <option value="caption">Caption Only</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    marginBottom: '6px'
                  }}
                >
                  Desired Tone & Style
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  style={{ width: '100%', height: '38px', padding: '0 10px' }}
                >
                  <option value="Energetic & Sensory">Energetic & Sensory</option>
                  <option value="Conversational & Friendly">Conversational & Friendly</option>
                  <option value="Authoritative & Insightful">Authoritative & Insightful</option>
                  <option value="Scientific & Reassuring">Scientific & Reassuring</option>
                  <option value="Playful & Humorous">Playful & Humorous</option>
                  <option value="Direct Response & Persuasive">Direct Response & Persuasive</option>
                </select>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  marginBottom: '6px'
                }}
              >
                Content Goal
              </label>
              <input
                type="text"
                placeholder="e.g. Brand Awareness, Lead Generation, Product Launch..."
                value={contentGoal}
                onChange={(e) => setContentGoal(e.target.value)}
                style={{ width: '100%', height: '38px', padding: '0 12px' }}
              />
            </div>
          </div>

          {/* Section 3: Topic & Instructions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  marginBottom: '6px'
                }}
              >
                Topic or Initial Concept <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Describe what you want to create (e.g. Highlight our newly opened restaurant, torched salmon roll, fresh knife cuts, and ask diners to tag a date...)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  lineHeight: 1.5,
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  marginBottom: '6px'
                }}
              >
                Optional Keywords or Creative Directives
              </label>
              <input
                type="text"
                placeholder="e.g. 3 tools, student study hacks, time saver, link in bio"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                style={{ width: '100%', height: '38px', padding: '0 12px' }}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            className="btn btn-secondary"
          >
            <Save size={16} />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('generate')}
            className="btn btn-primary"
            style={{ fontWeight: 600 }}
          >
            <Sparkles size={16} />
            <span>Generate Content with AI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
