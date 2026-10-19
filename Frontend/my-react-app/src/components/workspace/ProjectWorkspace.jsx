import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  Download,
  Share2,
  Eye,
  FileEdit,
  Sliders,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  Music,
  Maximize2,
  GitCompare,
  HelpCircle,
  ThumbsUp,
  RefreshCw
} from 'lucide-react';

export default function ProjectWorkspace({
  project,
  onBack,
  onUpdateProject,
  onToast
}) {
  if (!project) return null;

  // Active stage tab (1 to 5)
  const [activeStage, setActiveStage] = useState(3); // Default to Content Creation
  const [rightPanelTab, setRightPanelTab] = useState('preview'); // 'preview' | 'evaluator' | 'actionkit'
  const [isDiffMode, setIsDiffMode] = useState(false);
  const [isExecutingWorkflow, setIsExecutingWorkflow] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);
  const [saveIndicator, setSaveIndicator] = useState('Saved just now');

  // Editable fields for Content Creation
  const [editableHook, setEditableHook] = useState(
    project.workflowStages?.creation?.output?.hook || `Stop scrolling if you need ${project.topic || 'this game-changing insight'}! ⚡`
  );
  const [editableCaption, setEditableCaption] = useState(
    project.workflowStages?.creation?.output?.caption ||
      `Here is the ultimate breakdown for ${project.topic || 'maximizing your results'}. Save this for later! 👇`
  );
  const [editableHashtags, setEditableHashtags] = useState(
    project.workflowStages?.creation?.output?.hashtags ||
      `#${project.platform || 'Trending'} #ContentFlowAI #Growth #ViralTips`
  );
  const [editableImagePrompt, setEditableImagePrompt] = useState(
    project.workflowStages?.creation?.output?.imagePrompt ||
      `Cinematic high-contrast visual showcasing ${project.topic || 'the core concept'} with modern aesthetic lighting.`
  );

  const [projectTitle, setProjectTitle] = useState(project.name);
  const [projectStatus, setProjectStatus] = useState(project.status);

  // Workflow Stages
  const stages = [
    {
      num: 1,
      id: 'planning',
      title: 'Planning & Branding',
      shortTitle: '1. Plan & Brand',
      status: project.workflowStages?.planning?.status || 'Completed',
      desc: 'Strategy, audience triggers, platform guidelines, posting cadence'
    },
    {
      num: 2,
      id: 'research',
      title: 'Research & Analysis',
      shortTitle: '2. Research',
      status: project.workflowStages?.research?.status || 'Completed',
      desc: 'Tavily live search, competitor gap analysis, trending hooks'
    },
    {
      num: 3,
      id: 'creation',
      title: 'Content Creation',
      shortTitle: '3. Create Content',
      status: project.workflowStages?.creation?.status || 'Completed',
      desc: 'Scene-by-scene beat sheet, visual directions, hooks, and copy'
    },
    {
      num: 4,
      id: 'evaluator',
      title: 'Evaluator',
      shortTitle: '4. Evaluator',
      status: project.workflowStages?.evaluator?.status || 'Completed',
      desc: '7-point quality assessment, audience fit, brand tone compliance'
    },
    {
      num: 5,
      id: 'finalizer',
      title: 'Improve & Finalize',
      shortTitle: '5. Finalize',
      status: project.workflowStages?.finalizer?.status || 'Needs Review',
      desc: 'Polished revisions, creator action kit, post-launch checklist'
    }
  ];

  // Stage status badge helper
  const getStageBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="badge badge-completed" style={{ fontSize: '0.7rem' }}>
            <CheckCircle2 size={11} /> Completed
          </span>
        );
      case 'Running':
        return (
          <span className="badge badge-in-progress pulse-active" style={{ fontSize: '0.7rem' }}>
            <RefreshCw size={11} className="pulse-active" /> Running
          </span>
        );
      case 'Needs Review':
        return (
          <span className="badge badge-review" style={{ fontSize: '0.7rem' }}>
            <AlertCircle size={11} /> Needs Review
          </span>
        );
      default:
        return (
          <span className="badge badge-pending" style={{ fontSize: '0.7rem' }}>
            <Clock size={11} /> Pending
          </span>
        );
    }
  };

  // 1-Click Copy helper
  const copyToClipboard = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    if (onToast) onToast(`Copied ${sectionName} to clipboard!`);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Simulate Running AI Agent
  const runWorkflowSimulation = () => {
    setIsExecutingWorkflow(true);
    setSaveIndicator('AI Agent executing...');

    // Progress through stages
    setTimeout(() => {
      setActiveStage(1);
      setTimeout(() => {
        setActiveStage(2);
        setTimeout(() => {
          setActiveStage(3);
          setTimeout(() => {
            setActiveStage(4);
            setRightPanelTab('evaluator');
            setTimeout(() => {
              setActiveStage(5);
              setRightPanelTab('actionkit');
              setIsExecutingWorkflow(false);
              setSaveIndicator('All 5 stages completed');
              if (onToast) onToast('AI Agent successfully completed all 5 stages!');
            }, 1200);
          }, 1200);
        }, 1200);
      }, 1200);
    }, 800);
  };

  // Export full action kit
  const exportActionKit = () => {
    const textContent = `# ${projectTitle}
Platform: ${project.platform} | Brand: ${project.brandName}
Status: ${projectStatus}

## 1. SCROLL-STOPPING HOOK
${editableHook}

## 2. MAIN CAPTION & SCRIPT
${editableCaption}

## 3. CURATED HASHTAGS
${editableHashtags}

## 4. VISUAL CONCEPT & IMAGE PROMPT
${editableImagePrompt}

## 5. FIRST PINNED COMMENT
${project.workflowStages?.finalizer?.output?.pinnedComment || 'Leave your thoughts below!'}
`;

    const blob = new Blob([textContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-action-kit.md`;
    a.click();
    URL.revokeObjectURL(url);
    if (onToast) onToast('Exported Content Action Kit (.md)');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '100%' }}>
      {/* Top Workspace Header */}
      <div
        className="card"
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        {/* Left: Back button + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 300px' }}>
          <button
            onClick={onBack}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 10px' }}
            title="Back to Projects"
          >
            <ArrowLeft size={16} />
            <span>Projects</span>
          </button>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => {
                  setProjectTitle(e.target.value);
                  setSaveIndicator('Saving...');
                  setTimeout(() => setSaveIndicator('Saved just now'), 600);
                }}
                style={{
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  border: '1px solid transparent',
                  background: 'transparent',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-xs)',
                  width: '100%',
                  maxWidth: '460px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.background = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'transparent';
                  e.target.style.background = 'transparent';
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '6px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {project.brandName}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>•</span>
              <span className="badge badge-draft" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                {project.platform}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--success-text)' }}>
                ● {saveIndicator}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Status Selector */}
          <select
            value={projectStatus}
            onChange={(e) => {
              setProjectStatus(e.target.value);
              if (onToast) onToast(`Project status changed to ${e.target.value}`);
            }}
            style={{ height: '34px', fontSize: '0.8rem', padding: '0 8px' }}
          >
            <option value="Draft">Status: Draft</option>
            <option value="In Progress">Status: In Progress</option>
            <option value="Ready for Review">Status: Ready for Review</option>
            <option value="Completed">Status: Completed</option>
          </select>

          {/* Run Agent Workflow button */}
          <button
            onClick={runWorkflowSimulation}
            disabled={isExecutingWorkflow}
            className="btn btn-secondary btn-sm"
            style={{
              height: '34px',
              backgroundColor: isExecutingWorkflow ? 'var(--primary-subtle)' : '#ffffff',
              color: 'var(--primary)',
              borderColor: 'var(--primary-border)'
            }}
          >
            <Sparkles size={14} className={isExecutingWorkflow ? 'pulse-active' : ''} />
            <span>{isExecutingWorkflow ? 'Executing...' : 'Run AI Workflow'}</span>
          </button>

          {/* Export Action Kit */}
          <button onClick={exportActionKit} className="btn btn-primary btn-sm" style={{ height: '34px' }}>
            <Download size={14} />
            <span>Export Action Kit</span>
          </button>
        </div>
      </div>

      {/* COMPACT WORKFLOW PROGRESS INDICATOR (All 5 stages inside project) */}
      <div
        className="card"
        style={{
          padding: '12px 18px',
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--text-muted)'
              }}
            >
              AI Agent Execution Pipeline:
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Step {activeStage} of 5 Active
            </span>
          </div>

          <button
            onClick={() => setIsDiffMode(!isDiffMode)}
            className="btn btn-ghost btn-sm"
            style={{
              fontSize: '0.75rem',
              gap: '6px',
              color: isDiffMode ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            <GitCompare size={14} />
            <span>{isDiffMode ? 'Close Draft Comparison' : 'Compare Revisions'}</span>
          </button>
        </div>

        {/* The 5 stage tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '8px'
          }}
        >
          {stages.map((st) => {
            const isActive = activeStage === st.num;
            return (
              <button
                key={st.num}
                onClick={() => {
                  setActiveStage(st.num);
                  if (st.num === 4) setRightPanelTab('evaluator');
                  if (st.num === 5) setRightPanelTab('actionkit');
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive ? 'var(--primary-subtle)' : 'var(--bg-subtle)',
                  border: isActive ? '1px solid var(--primary-border)' : '1px solid var(--border-light)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: isActive ? 'var(--primary)' : 'var(--text-primary)'
                    }}
                  >
                    {st.shortTitle}
                  </span>
                  {getStageBadge(st.status)}
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {st.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* THREE-PART WORKSPACE LAYOUT */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '290px minmax(0, 1.6fr) 370px',
          gap: '18px',
          alignItems: 'start'
        }}
      >
        {/* LEFT COLUMN: Stage Inspection & Strategy Brief */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Active Stage Inspector */}
          <div className="card" style={{ padding: '18px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}
            >
              <h4 style={{ fontSize: '0.92rem', fontWeight: 600, margin: 0 }}>
                Stage {activeStage} Output
              </h4>
              <span className="badge badge-completed" style={{ fontSize: '0.7rem' }}>
                Inspecting
              </span>
            </div>

            {/* Stage 1 details */}
            {activeStage === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8rem' }}>
                <div style={{ padding: '10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    🎯 Target Audience Trigger
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    {project.workflowStages?.planning?.output?.targetAudience ||
                      'Active food lovers looking for dinner reservations.'}
                  </p>
                </div>

                <div style={{ padding: '10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    🏆 Primary Content Goal
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    {project.workflowStages?.planning?.output?.contentGoals ||
                      'Drive local table bookings and brand curiosity.'}
                  </p>
                </div>

                <div style={{ padding: '10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    📅 Recommended Schedule
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    {project.workflowStages?.planning?.output?.publishingSchedule ||
                      'Thursday or Friday between 5:30 PM - 7:30 PM.'}
                  </p>
                </div>
              </div>
            )}

            {/* Stage 2 details (Research & Sourced links) */}
            {activeStage === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8rem' }}>
                <div style={{ padding: '10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    💡 Audience Insights & Burning Cravings
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    {project.workflowStages?.research?.output?.audienceInsights ||
                      'Diners want fresh quality assurance and aesthetic date spots.'}
                  </p>
                </div>

                <div style={{ padding: '10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    ⚡ Competitor Gap Cut-Through
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    {project.workflowStages?.research?.output?.competitorGap ||
                      'Cut through silent b-roll with macro torching flame hooks in the first 2s.'}
                  </p>
                </div>

                <div>
                  <span style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                    Sourced Intelligence vs AI Suggestions:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {project.workflowStages?.research?.output?.sources?.map((s, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '8px',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-xs)',
                          fontSize: '0.74rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.title}</span>
                          <span
                            className={s.isLiveSource ? 'badge badge-completed' : 'badge badge-draft'}
                            style={{ fontSize: '0.62rem', padding: '1px 5px' }}
                          >
                            {s.isLiveSource ? 'Tavily Live Source' : 'AI Synthetic'}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>{s.snippet}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stage 3 details */}
            {activeStage === 3 && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <p style={{ marginBottom: '10px' }}>
                  The AI Creative Agent has compiled a full video script / copy package tailored for{' '}
                  <strong>{project.platform}</strong>.
                </p>
                <div style={{ padding: '10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                    Audio Direction
                  </div>
                  <span>{project.workflowStages?.creation?.output?.audioRecommendation || 'Trending indie hip-hop / lo-fi beat'}</span>
                </div>
              </div>
            )}

            {/* Stage 4 details */}
            {activeStage === 4 && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <p style={{ marginBottom: '8px' }}>
                  The Evaluator agent assessed brand tone, audience relevance, and call-to-action completeness.
                </p>
                <button
                  onClick={() => setRightPanelTab('evaluator')}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                >
                  View Quality Scorecard (94/100)
                </button>
              </div>
            )}

            {/* Stage 5 details */}
            {activeStage === 5 && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <p style={{ marginBottom: '8px' }}>
                  The Finalizer agent formatted the ready-to-use Creator Action Kit and post-launch checklist.
                </p>
                <button
                  onClick={() => setRightPanelTab('actionkit')}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  View Final Action Kit
                </button>
              </div>
            )}
          </div>

          {/* Brand Alignment Card */}
          <div className="card" style={{ padding: '18px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              Brand Alignment Profile
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--primary-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                🍣
              </div>
              <strong style={{ fontSize: '0.88rem' }}>{project.brandName}</strong>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
              Voice: Refined craftsmanship, sensory-rich culinary descriptions. Prohibits terms like "cheap eats".
            </p>
          </div>
        </div>

        {/* CENTER COLUMN: Spacious Content Editor & Beat Sheet */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Editor Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '14px'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 600, margin: 0 }}>
                {isDiffMode ? 'Draft Revision Comparison (Diff)' : 'Publish-Ready Content Draft'}
              </h3>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                {isDiffMode
                  ? 'Inspect improvements made between Stage 3 initial draft and Stage 5 final version'
                  : 'Edit hooks, scene actions, captions, and visual prompts directly'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => copyToClipboard(editableCaption, 'Full Copy')}
                className="btn btn-secondary btn-sm"
              >
                {copiedSection === 'Full Copy' ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                <span>{copiedSection === 'Full Copy' ? 'Copied' : 'Copy Draft'}</span>
              </button>
            </div>
          </div>

          {/* Diff View Comparison Mode */}
          {isDiffMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--primary-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  color: 'var(--primary)',
                  border: '1px solid var(--primary-border)'
                }}
              >
                <strong>Improvement Summary:</strong> The Stage 5 Finalizer tightened the opening
                hook duration from 3.0s down to 1.8s for higher retention, injected localized
                neighborhood keywords, and prepared the algorithm first-pinned comment protocol.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Earlier Draft */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #fecaca',
                    backgroundColor: '#fff5f5'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--danger-text)',
                      textTransform: 'uppercase'
                    }}
                  >
                    Earlier Draft (Stage 3)
                  </span>
                  <div style={{ marginTop: '10px', fontSize: '0.84rem', lineHeight: 1.5, color: '#450a0a' }}>
                    <p style={{ fontWeight: 600 }}>Initial Draft Hook:</p>
                    <p>"{project.workflowStages?.creation?.output?.hook || 'Initial hook draft'}"</p>
                    <p style={{ fontWeight: 600, marginTop: '10px' }}>Scene 1 visual:</p>
                    <p>Standard introduction before getting straight to the core insight.</p>
                  </div>
                </div>

                {/* Finalized Revised Version */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--success-border)',
                    backgroundColor: 'var(--success-subtle)'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--success-text)',
                      textTransform: 'uppercase'
                    }}
                  >
                    Revised Final Version (Stage 5)
                  </span>
                  <div style={{ marginTop: '10px', fontSize: '0.84rem', lineHeight: 1.5, color: 'var(--success-text)' }}>
                    <p style={{ fontWeight: 600 }}>Hook (Optimized +0.5s faster):</p>
                    <p>"{project.workflowStages?.finalizer?.output?.revisedHook || `Stop scrolling if you need ${project.topic || 'this game-changing insight'}! ⚡`}"</p>
                    <p style={{ fontWeight: 600, marginTop: '10px' }}>Scene 1 visual:</p>
                    <p>Immediate high-energy visual hook and on-screen text overlay.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Standard Content Editor */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Field 1: Scroll-Stopping Hook */}
              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    marginBottom: '6px'
                  }}
                >
                  <span>1. Scroll-Stopping Hook / Headline</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {editableHook.length} characters
                  </span>
                </label>
                <input
                  type="text"
                  value={editableHook}
                  onChange={(e) => setEditableHook(e.target.value)}
                  style={{ width: '100%', height: '38px', padding: '0 12px', fontWeight: 600 }}
                />
              </div>

              {/* Field 2: Scene-by-Scene Beat Sheet (Filming directions) */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6px'
                  }}
                >
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                    2. Filming Shot List & Script Beat Sheet
                  </label>
                  <span className="badge badge-draft" style={{ fontSize: '0.68rem' }}>
                    TikTok Vertical 9:16
                  </span>
                </div>

                <div
                  style={{
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden'
                  }}
                >
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '0.78rem',
                      textAlign: 'left'
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <th style={{ padding: '8px 10px', width: '90px' }}>Timestamp</th>
                        <th style={{ padding: '8px 10px', width: '110px' }}>Framing</th>
                        <th style={{ padding: '8px 10px' }}>Visual Action & Camera Detail</th>
                        <th style={{ padding: '8px 10px' }}>Spoken Voiceover</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.workflowStages?.creation?.output?.scriptScenes?.map((sc, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--primary)' }}>
                            {sc.time}
                          </td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-secondary)' }}>
                            {sc.framing}
                          </td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-primary)' }}>
                            {sc.action}
                          </td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            "{sc.voiceover}"
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Field 3: Main Caption Copy */}
              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    marginBottom: '6px'
                  }}
                >
                  <span>3. Main Caption & Call to Action</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(editableCaption, 'Caption')}
                    className="btn-ghost"
                    style={{ fontSize: '0.72rem', color: 'var(--primary)', padding: 0 }}
                  >
                    Copy Caption
                  </button>
                </label>
                <textarea
                  rows={4}
                  value={editableCaption}
                  onChange={(e) => setEditableCaption(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', lineHeight: 1.5 }}
                />
              </div>

              {/* Field 4: Hashtags */}
              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    marginBottom: '6px'
                  }}
                >
                  <span>4. Curated Hashtags</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(editableHashtags, 'Hashtags')}
                    className="btn-ghost"
                    style={{ fontSize: '0.72rem', color: 'var(--primary)', padding: 0 }}
                  >
                    Copy Hashtags
                  </button>
                </label>
                <input
                  type="text"
                  value={editableHashtags}
                  onChange={(e) => setEditableHashtags(e.target.value)}
                  style={{ width: '100%', height: '36px', padding: '0 12px' }}
                />
              </div>

              {/* Field 5: Visual Concept & AI Image Prompt */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    marginBottom: '6px'
                  }}
                >
                  5. Visual Direction & AI Image Generation Prompt
                </label>
                <textarea
                  rows={2}
                  value={editableImagePrompt}
                  onChange={(e) => setEditableImagePrompt(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'var(--bg-subtle)'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Tabbed Panel (Platform Preview / Evaluator Scorecard / Action Kit) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Tab Switcher */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-subtle)',
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <button
              onClick={() => setRightPanelTab('preview')}
              style={{
                flex: 1,
                padding: '6px 8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-xs)',
                backgroundColor: rightPanelTab === 'preview' ? '#ffffff' : 'transparent',
                color: rightPanelTab === 'preview' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: rightPanelTab === 'preview' ? 'var(--shadow-xs)' : 'none'
              }}
            >
              Mockup Preview
            </button>
            <button
              onClick={() => setRightPanelTab('evaluator')}
              style={{
                flex: 1,
                padding: '6px 8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-xs)',
                backgroundColor: rightPanelTab === 'evaluator' ? '#ffffff' : 'transparent',
                color: rightPanelTab === 'evaluator' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: rightPanelTab === 'evaluator' ? 'var(--shadow-xs)' : 'none'
              }}
            >
              Evaluator (94)
            </button>
            <button
              onClick={() => setRightPanelTab('actionkit')}
              style={{
                flex: 1,
                padding: '6px 8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-xs)',
                backgroundColor: rightPanelTab === 'actionkit' ? '#ffffff' : 'transparent',
                color: rightPanelTab === 'actionkit' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: rightPanelTab === 'actionkit' ? 'var(--shadow-xs)' : 'none'
              }}
            >
              Action Kit
            </button>
          </div>

          {/* TAB 1: Platform Mockup Preview */}
          {rightPanelTab === 'preview' && (
            <div className="card" style={{ padding: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={15} color="var(--primary)" />
                  <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                    {project.platform} Realistic Simulation
                  </span>
                </div>
                <span className="badge badge-draft" style={{ fontSize: '0.68rem' }}>
                  Representative Mockup
                </span>
              </div>

              {/* Realistic TikTok Phone Mockup */}
              {project.platform === 'TikTok' ? (
                <div
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    margin: '0 auto',
                    height: '460px',
                    backgroundColor: '#000000',
                    borderRadius: '24px',
                    border: '8px solid #1e293b',
                    position: 'relative',
                    overflow: 'hidden',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-xl)'
                  }}
                >
                  {/* Mock Background Culinary Video Visual */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'radial-gradient(circle at 50% 40%, #831843 0%, #000000 90%)',
                      opacity: 0.85
                    }}
                  />

                  {/* Top Bar on phone */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 10,
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '16px',
                      paddingTop: '16px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      opacity: 0.9
                    }}
                  >
                    <span style={{ opacity: 0.6 }}>Following</span>
                    <span style={{ borderBottom: '2px solid #ffffff', paddingBottom: '2px' }}>
                      For You
                    </span>
                  </div>

                  {/* Center Flame / Torched Salmon Visual Representation */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 10,
                      textAlign: 'center',
                      padding: '0 20px'
                    }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🍣🔥</div>
                    <div
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        backdropFilter: 'blur(4px)',
                        display: 'inline-block'
                      }}
                    >
                      {editableHook}
                    </div>
                  </div>

                  {/* Right Action Icons (Like, Comment, Save, Share) */}
                  <div
                    style={{
                      position: 'absolute',
                      right: '12px',
                      bottom: '90px',
                      zIndex: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Heart size={24} fill="#e11d48" color="#e11d48" />
                      <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>24.8K</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <MessageCircle size={24} />
                      <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>1.4K</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Bookmark size={24} />
                      <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>8.9K</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Share2 size={24} />
                      <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>3.2K</span>
                    </div>
                  </div>

                  {/* Bottom User Info & Caption */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 10,
                      padding: '16px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                      @sakurabistro.official
                    </div>
                    <p
                      style={{
                        fontSize: '0.74rem',
                        lineHeight: 1.35,
                        margin: 0,
                        color: '#f1f5f9',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {editableCaption}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.68rem',
                        marginTop: '8px',
                        opacity: 0.8
                      }}
                    >
                      <Music size={12} />
                      <span>Sakura Japanese Bistro • Original Sound</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Generic Platform Mockup */
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.84rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700
                      }}
                    >
                      C
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{project.brandName}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Promoted</div>
                    </div>
                  </div>
                  <p style={{ lineHeight: 1.5, marginBottom: '10px' }}>{editableCaption}</p>
                  <div style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 500 }}>
                    {editableHashtags}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Stage 4 Evaluator Quality Scorecard */}
          {rightPanelTab === 'evaluator' && (
            <div className="card" style={{ padding: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 600, margin: 0 }}>
                    Evaluator Quality Scorecard
                  </h4>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    7-Point Multi-Dimension AI Audit
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--success-text)',
                    backgroundColor: 'var(--success-subtle)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--success-border)'
                  }}
                >
                  94/100
                </div>
              </div>

              {/* 7 Checks List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {project.workflowStages?.evaluator?.output?.checks?.map((chk, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '8px 10px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {chk.criterion}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: 'var(--success-text)'
                        }}
                      >
                        {chk.score}%
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {chk.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Actionable Suggestions */}
              <div style={{ marginTop: '14px' }}>
                <span style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '6px' }}>
                  Actionable Recommendations:
                </span>
                <ul
                  style={{
                    paddingLeft: '16px',
                    margin: 0,
                    fontSize: '0.74rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4
                  }}
                >
                  {project.workflowStages?.evaluator?.output?.actionableSuggestions?.map((s, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: Stage 5 Action Kit & 1-Click Publish Assets */}
          {rightPanelTab === 'actionkit' && (
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 600, margin: 0 }}>
                  Turn-Key Creator Action Kit
                </h4>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Copy-and-paste assets for creator & social media manager
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* 1-Click Caption */}
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600 }}>Post Caption</span>
                    <button
                      onClick={() => copyToClipboard(editableCaption, 'Caption')}
                      className="btn-ghost"
                      style={{ fontSize: '0.7rem', color: 'var(--primary)', padding: 0 }}
                    >
                      {copiedSection === 'Caption' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      margin: 0,
                      maxHeight: '60px',
                      overflowY: 'auto'
                    }}
                  >
                    {editableCaption}
                  </p>
                </div>

                {/* 1-Click Hashtags */}
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600 }}>Hashtag Stack</span>
                    <button
                      onClick={() => copyToClipboard(editableHashtags, 'Hashtags')}
                      className="btn-ghost"
                      style={{ fontSize: '0.7rem', color: 'var(--primary)', padding: 0 }}
                    >
                      {copiedSection === 'Hashtags' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {editableHashtags}
                  </p>
                </div>

                {/* 1-Click Pinned Comment */}
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600 }}>First Pinned Comment</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          project.workflowStages?.finalizer?.output?.pinnedComment ||
                            'Which roll are you trying first?',
                          'Comment'
                        )
                      }
                      className="btn-ghost"
                      style={{ fontSize: '0.7rem', color: 'var(--primary)', padding: 0 }}
                    >
                      {copiedSection === 'Comment' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {project.workflowStages?.finalizer?.output?.pinnedComment ||
                      'Which roll are you trying first: Torched Salmon or Crispy Rice? Let us know below! 👇'}
                  </p>
                </div>

                {/* 30-Minute Post-Launch Protocol */}
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: 'var(--primary-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--primary-border)'
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      marginBottom: '6px'
                    }}
                  >
                    ⚡ 30-Minute Post-Launch Protocol:
                  </span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {project.workflowStages?.finalizer?.output?.actionKit?.launchProtocol?.map(
                      (pr, idx) => (
                        <div key={idx} style={{ marginBottom: '4px' }}>
                          ● {pr}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Final Actions */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button
                    onClick={() => {
                      setProjectStatus('Completed');
                      if (onToast) onToast('Project approved as final ready-to-publish content!');
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Check size={14} />
                    <span>Approve Final</span>
                  </button>
                  <button
                    onClick={() => {
                      runWorkflowSimulation();
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <RotateCcw size={14} />
                    <span>Revise</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
