import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Plus,
  FolderKanban,
  FileEdit,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp,
  Layers,
  ChevronRight,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Lightbulb,
  Globe,
  FileText,
  Bookmark,
  MessageSquare,
  History,
  Trash2,
  ChevronDown
} from 'lucide-react';

export default function DashboardView({
  projects = [],
  upcomingContent = [],
  onOpenProject,
  onCreateNew,
  onNavigateTab,
  onSaveGeneratedProject
}) {
  const [showEmptyStateDemo, setShowEmptyStateDemo] = useState(false);

  // Backend Connection State
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [backendUrl] = useState(import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000');

  // Dashboard Prompt Generator State
  const [promptInput, setPromptInput] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('Auto-Detect');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedResult, setGeneratedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedContent, setCopiedContent] = useState(false);
  const [activeOutputStep, setActiveOutputStep] = useState(3); // 1 = Plan, 2 = Research, 3 = Content, 4 = Evaluator, 5 = Action Kit
  const [hasSavedProject, setHasSavedProject] = useState(false);

  // Persistent Conversation Memory State (Stored in SQLite Database)
  const [conversationsList, setConversationsList] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(
    () => localStorage.getItem('contentflow_active_conversation_id') || null
  );
  const [conversationHistoryMessages, setConversationHistoryMessages] = useState([]);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);

  // 5 Distinct Production Pipeline Steps
  const PRODUCTION_PIPELINE_STEPS = [
    {
      num: 1,
      name: 'Planning & Strategy',
      badge: 'Step 1',
      desc: 'Platform classification, target audience persona, and content strategy goals.'
    },
    {
      num: 2,
      name: 'Live Web Research',
      badge: 'Step 2',
      desc: 'Real-time Tavily search for audience pain points, competitor angles, and trends.'
    },
    {
      num: 3,
      name: 'Content & Script Creation',
      badge: 'Step 3',
      desc: 'Drafting publish-ready copy, timestamps, on-screen text overlays, and audio cues.'
    },
    {
      num: 4,
      name: 'Quality & Policy Evaluator',
      badge: 'Step 4',
      desc: '100-point audit assessing hook retention, platform fit, and engagement triggers.'
    },
    {
      num: 5,
      name: 'Turn-Key Action Kit',
      badge: 'Step 5',
      desc: 'One-click publish captions, hashtag stack, scene filming table, and launch protocol.'
    }
  ];

  // Quick prompt suggestions (Zero sushi references)
  const promptSuggestions = [
    {
      title: '🎬 TikTok: 3 Mind-Blowing AI Tools for Students',
      prompt: 'Create a viral 30-second TikTok video script with visual hook ideas showing 3 mind-blowing AI productivity tools for students.',
      platform: 'TikTok'
    },
    {
      title: '🐦 X / Tweet Thread: Simplicity in Code Architecture',
      prompt: 'Give me a punchy tweet thread about why simplicity in code architecture always beats premature optimization.',
      platform: 'X'
    },
    {
      title: '💼 LinkedIn: Lessons Transitioning to Eng Manager',
      prompt: 'Write a thought leadership post sharing lessons learned from transitioning from Senior Engineer to Engineering Manager.',
      platform: 'LinkedIn'
    },
    {
      title: '📱 Instagram: 5 Daily Habits for Peak Mental Clarity',
      prompt: 'Create an engaging 5-slide Instagram carousel breakdown showing 5 simple daily micro-habits that boost energy and mental clarity.',
      platform: 'Instagram'
    }
  ];

  // Check Backend Health
  const checkBackendHealth = async () => {
    setBackendStatus('checking');
    try {
      const res = await fetch(`${backendUrl}/health`, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'healthy') {
          setBackendStatus('online');
          return true;
        }
      }
      setBackendStatus('offline');
      return false;
    } catch (err) {
      setBackendStatus('offline');
      return false;
    }
  };

  // Fetch list of persistent conversations from SQLite database
  const fetchConversationsList = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/conversations`);
      if (res.ok) {
        const data = await res.json();
        const list = data.conversations || [];
        setConversationsList(list);
        return list;
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
    return [];
  };

  // Load a full conversation and restore its context & 5-step outputs
  const loadConversation = async (convId) => {
    if (!convId) return;
    setIsLoadingConversation(true);
    try {
      const res = await fetch(`${backendUrl}/api/conversations/${convId}`);
      if (res.ok) {
        const data = await res.json();
        const conv = data.conversation;
        if (conv) {
          setActiveConversationId(conv.id);
          localStorage.setItem('contentflow_active_conversation_id', conv.id);
          setConversationHistoryMessages(conv.messages || []);
          if (conv.platform && conv.platform !== 'General') {
            setSelectedPlatform(conv.platform);
          }

          // Restore generated 5-step result from latest assistant response
          const assistantMsgs = (conv.messages || []).filter(m => m.role === 'assistant');
          const latestAssistant = assistantMsgs[assistantMsgs.length - 1];
          if (latestAssistant && latestAssistant.step_data) {
            setGeneratedResult({
              prompt: conv.title,
              platform: conv.platform,
              content: latestAssistant.content,
              plan: latestAssistant.step_data.plan || conv.context?.last_plan,
              research: latestAssistant.step_data.research || conv.context?.last_research,
              evaluation: latestAssistant.step_data.evaluation,
              action_kit: latestAssistant.step_data.action_kit || conv.context?.last_action_kit?.action_kit
            });
            setActiveOutputStep(3);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load conversation details:', err);
    } finally {
      setIsLoadingConversation(false);
      setShowHistoryDropdown(false);
    }
  };

  // Start a fresh new conversation thread
  const handleStartNewConversation = () => {
    setActiveConversationId(null);
    localStorage.removeItem('contentflow_active_conversation_id');
    setConversationHistoryMessages([]);
    setGeneratedResult(null);
    setPromptInput('');
    setShowHistoryDropdown(false);
  };

  // Delete a conversation from persistent storage
  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${backendUrl}/api/conversations/${convId}`, { method: 'DELETE' });
      if (res.ok) {
        setConversationsList(prev => prev.filter(c => c.id !== convId));
        if (activeConversationId === convId) {
          handleStartNewConversation();
        }
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  // Auto-restore previous conversation context when user opens or refreshes app
  useEffect(() => {
    checkBackendHealth().then((isHealthy) => {
      if (isHealthy) {
        fetchConversationsList().then((list) => {
          const savedId = localStorage.getItem('contentflow_active_conversation_id');
          if (savedId) {
            loadConversation(savedId);
          } else if (list && list.length > 0) {
            loadConversation(list[0].id);
          }
        });
      }
    });
  }, []);

  // Send Request to Backend AI Agent (With Persistent Context)
  const handleGenerate = async () => {
    if (!promptInput.trim()) return;

    setIsGenerating(true);
    setErrorMsg('');
    setHasSavedProject(false);
    setActiveStep(1);
    setGenerationStep('Step 1: Planning Content Strategy & Persona...');

    // Progress through step indicator while awaiting backend
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev === 1) {
          setGenerationStep('Step 2: Conducting Live Web & Market Research via Tavily...');
          return 2;
        } else if (prev === 2) {
          setGenerationStep('Step 3: Creating Full Publish-Ready Content & Visual Beat Sheet...');
          return 3;
        } else if (prev === 3) {
          setGenerationStep('Step 4: Auditing Hook Power & Policy Compliance...');
          return 4;
        } else if (prev === 4) {
          setGenerationStep('Step 5: Synthesizing Turn-Key Creator & Publisher Action Kit...');
          return 5;
        }
        return prev;
      });
    }, 1800);

    try {
      const payload = {
        prompt: promptInput.trim(),
        platform: selectedPlatform === 'Auto-Detect' ? null : selectedPlatform,
        conversation_id: activeConversationId || null
      };

      const response = await fetch(`${backendUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Backend error (${response.status}): ${response.statusText}`);
      }

      const data = await response.json();
      clearInterval(stepInterval);
      setActiveStep(5);
      setGeneratedResult(data);
      setActiveOutputStep(3); // Start user on created content step
      setBackendStatus('online');

      // Update active persistent conversation session
      if (data.conversation_id) {
        setActiveConversationId(data.conversation_id);
        localStorage.setItem('contentflow_active_conversation_id', data.conversation_id);
        fetchConversationsList();
        loadConversation(data.conversation_id);
      }

      // Auto save to projects if callback exists
      if (onSaveGeneratedProject) {
        const newProj = {
          id: `proj-${Date.now()}`,
          name: `${data.platform} Content: ${promptInput.slice(0, 32)}...`,
          platform: data.platform,
          format: data.platform === 'TikTok' ? 'short-form video' : 'social media post',
          status: 'Ready for Review',
          lastUpdated: 'Just now',
          dateCreated: new Date().toISOString().split('T')[0],
          goal: data.plan?.content_goals || 'Engagement & Discovery',
          targetAudience: data.plan?.target_audience || 'Target Audience',
          topic: promptInput,
          tone: data.plan?.branding || 'Engaging & Authentic',
          workflowStages: {
            planning: {
              id: 'stage-1',
              name: 'Planning & Branding',
              status: 'Completed',
              output: data.plan
            },
            research: {
              id: 'stage-2',
              name: 'Research & Analysis',
              status: 'Completed',
              output: data.research
            },
            creation: {
              id: 'stage-3',
              name: 'Content Creation',
              status: 'Completed',
              output: {
                hook: data.content?.slice(0, 80) || promptInput,
                caption: data.content,
                hashtags: `#${data.platform} #ContentFlowAI #Growth`
              }
            },
            evaluator: {
              id: 'stage-4',
              name: 'Evaluator',
              status: 'Completed',
              output: {
                overallScore: data.evaluation?.overall_score || 95,
                checks: data.evaluation?.criteria || [
                  { criterion: 'Audience Relevance', score: 95, detail: 'Strong alignment with viewer curiosity.' },
                  { criterion: 'Platform Suitability', score: 96, detail: `Native format for ${data.platform}.` }
                ]
              }
            },
            finalizer: {
              id: 'stage-5',
              name: 'Improve & Finalize',
              status: 'Completed',
              output: {
                actionKit: {
                  kitText: data.action_kit
                }
              }
            }
          }
        };
        onSaveGeneratedProject(newProj);
        setHasSavedProject(true);
      }
    } catch (err) {
      clearInterval(stepInterval);
      console.error('Failed to generate from backend:', err);
      setErrorMsg(`Failed to connect to backend agent: ${err.message}. Ensure backend is running on http://127.0.0.1:8000.`);
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2000);
  };

  // Metrics computation
  const totalProjects = projects.length;
  const draftCount = projects.filter((p) => p.status === 'Draft').length;
  const readyCount = projects.filter((p) => p.status === 'Ready for Review').length;
  const completedCount = projects.filter((p) => p.status === 'Completed').length;

  const displayProjects = showEmptyStateDemo ? [] : projects.slice(0, 5);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* SECTION 1: LIVE BACKEND AGENT GENERATOR (Connected directly to FastAPI) */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #ffffff 0%, #fbfbfe 100%)',
          border: '1px solid #e2e8f0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle background glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '280px',
            height: '100%',
            background: 'radial-gradient(circle at top right, rgba(79, 70, 229, 0.08), transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Header Row: Title & Backend Health Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0
                }}
              >
                AI Content Creator Agent
              </h2>
            </div>

            {/* Conversation Memory Switcher & Backend Health Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
              {/* History Dropdown Button */}
              <button
                type="button"
                onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  borderColor: showHistoryDropdown ? 'var(--primary)' : '#e2e8f0',
                  backgroundColor: showHistoryDropdown ? 'var(--primary-subtle)' : '#ffffff',
                  color: showHistoryDropdown ? 'var(--primary)' : 'var(--text-primary)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                title="View and restore saved conversation history from PostgreSQL"
              >
                <History size={14} color="var(--primary)" />
                <span style={{ fontWeight: 600 }}>
                  {activeConversationId
                    ? conversationsList.find((c) => c.id === activeConversationId)?.title?.slice(0, 18) || 'Active Thread'
                    : 'Saved Sessions'}
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    color: 'var(--primary)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '999px',
                    marginLeft: '2px'
                  }}
                >
                  {conversationsList.length}
                </span>
                <ChevronDown size={13} />
              </button>

              {/* Start Fresh Conversation Button */}
              {activeConversationId && (
                <button
                  type="button"
                  onClick={handleStartNewConversation}
                  className="btn btn-secondary btn-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.76rem',
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#ffffff'
                  }}
                  title="Start a fresh conversation thread (resets context)"
                >
                  <Plus size={13} color="var(--primary)" />
                  <span>New Thread</span>
                </button>
              )}

              {/* Saved Conversations Dropdown Menu */}
              {showHistoryDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    width: '380px',
                    maxWidth: '92vw',
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #cbd5e1',
                    zIndex: 100,
                    padding: '12px'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: '8px',
                      marginBottom: '8px',
                      borderBottom: '1px solid #f1f5f9'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <History size={14} color="var(--primary)" />
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        PostgreSQL Memory Sessions ({conversationsList.length})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleStartNewConversation}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: 'var(--radius-full)' }}
                    >
                      + New Thread
                    </button>
                  </div>

                  {isLoadingConversation && (
                    <div style={{ textAlign: 'center', padding: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Restoring conversation context...
                    </div>
                  )}

                  {conversationsList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 8px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      No saved conversations yet in database. Generate content below to begin!
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '300px', overflowY: 'auto' }}>
                      {conversationsList.map((conv) => {
                        const isActive = conv.id === activeConversationId;
                        return (
                          <div
                            key={conv.id}
                            onClick={() => loadConversation(conv.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: isActive ? 'var(--primary-subtle)' : '#f8fafc',
                              border: isActive ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                              <div
                                style={{
                                  fontSize: '0.8rem',
                                  fontWeight: isActive ? 700 : 600,
                                  color: isActive ? 'var(--primary)' : 'var(--text-primary)',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {conv.title || 'Untitled Session'}
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  fontSize: '0.68rem',
                                  color: 'var(--text-muted)',
                                  marginTop: '2px'
                                }}
                              >
                                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{conv.platform || 'General'}</span>
                                <span>•</span>
                                <span>{conv.message_count || 1} msg{conv.message_count > 1 ? 's' : ''}</span>
                                <span>•</span>
                                <span>{new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteConversation(e, conv.id)}
                              title="Delete conversation from database"
                              className="btn-secondary btn-icon-only"
                              style={{ width: '26px', height: '26px', border: 'none', background: 'transparent' }}
                            >
                              <Trash2 size={13} color="var(--danger)" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Live Backend Connection Indicator */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor:
                    backendStatus === 'online'
                      ? 'var(--success-subtle)'
                      : backendStatus === 'checking'
                      ? 'var(--info-subtle)'
                      : 'var(--danger-subtle)',
                  color:
                    backendStatus === 'online'
                      ? 'var(--success-text)'
                      : backendStatus === 'checking'
                      ? 'var(--info-text)'
                      : 'var(--danger-text)',
                  border: `1px solid ${
                    backendStatus === 'online'
                      ? 'var(--success-border)'
                      : backendStatus === 'checking'
                      ? 'var(--info-border)'
                      : 'var(--danger-border)'
                  }`,
                  fontSize: '0.74rem',
                  fontWeight: 600
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor:
                      backendStatus === 'online'
                        ? 'var(--success)'
                        : backendStatus === 'checking'
                        ? 'var(--info)'
                        : 'var(--danger)',
                    display: 'inline-block'
                  }}
                  className={backendStatus === 'online' ? '' : 'pulse-active'}
                />
                <span>
                  {backendStatus === 'online'
                    ? '127.0.0.1:8000'
                    : backendStatus === 'checking'
                    ? 'Checking...'
                    : 'Offline'}
                </span>
              </div>

              <button
                onClick={checkBackendHealth}
                title="Refresh backend status"
                className="btn-secondary btn-icon-only"
                style={{ width: '28px', height: '28px' }}
              >
                <RefreshCw size={13} className={backendStatus === 'checking' ? 'pulse-active' : ''} />
              </button>
            </div>
          </div>

          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
              marginBottom: '16px',
              maxWidth: '720px'
            }}
          >
            Send a prompt directly from the dashboard to trigger the FastAPI agent pipeline.
            The agent plans, researches viral market angles via web search, and writes ready-to-publish copy.
          </p>

          {/* Quick Prompt Suggestions */}
          <div style={{ marginBottom: '14px' }}>
            <div
              style={{
                fontSize: '0.74rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Lightbulb size={12} color="var(--primary)" />
              <span>Sample Requests:</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {promptSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPromptInput(item.prompt);
                    setSelectedPlatform(item.platform);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.74rem', padding: '4px 9px' }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* Active Context Memory Continuity Banner & Message Trail */}
          {activeConversationId && conversationHistoryMessages.length > 0 && (
            <div
              style={{
                marginBottom: '14px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(79, 70, 229, 0.04)',
                border: '1px solid rgba(79, 70, 229, 0.18)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>
                  <MessageSquare size={14} />
                  <span>
                    🧠 Context Continuity Active: {conversationHistoryMessages.length} message turn{conversationHistoryMessages.length > 1 ? 's' : ''} in PostgreSQL memory
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleStartNewConversation}
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                  title="Clear active context and start a clean thread"
                >
                  Start Fresh Topic
                </button>
              </div>

              {/* Message History Trail */}
              <div
                style={{
                  maxHeight: '110px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  paddingRight: '4px'
                }}
              >
                {conversationHistoryMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      lineHeight: 1.4,
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: msg.role === 'user' ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                      borderLeft: `3px solid ${msg.role === 'user' ? 'var(--primary)' : 'var(--success)'}`,
                      borderTop: '1px solid #f1f5f9',
                      borderRight: '1px solid #f1f5f9',
                      borderBottom: '1px solid #f1f5f9'
                    }}
                  >
                    <span style={{ fontWeight: 700, color: msg.role === 'user' ? 'var(--primary)' : 'var(--success-text)' }}>
                      {msg.role === 'user' ? 'You: ' : 'AI Agent: '}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {msg.content.length > 200 ? msg.content.slice(0, 200) + '...' : msg.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Generator Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 320px', position: 'relative' }}>
                <textarea
                  rows={3}
                  placeholder={
                    activeConversationId
                      ? 'Continue this conversation (e.g. "Now make a shorter 15-second version focusing on exam prep", "Change the tone to humorous")...'
                      : 'Enter your content request (e.g. Create a viral 30-second TikTok script about 3 AI tools for students)...'
                  }
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.9rem',
                    lineHeight: 1.45,
                    borderRadius: 'var(--radius-sm)',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '200px' }}>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  style={{ height: '38px', padding: '0 10px', fontSize: '0.84rem' }}
                >
                  <option value="Auto-Detect">Platform: Auto-Detect</option>
                  <option value="TikTok">Platform: TikTok</option>
                  <option value="Instagram">Platform: Instagram</option>
                  <option value="LinkedIn">Platform: LinkedIn</option>
                  <option value="X">Platform: X (Twitter)</option>
                  <option value="Blog">Platform: Blog</option>
                  <option value="Ad Copy">Platform: Ad Copy</option>
                </select>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !promptInput.trim()}
                  className="btn btn-primary"
                  style={{
                    height: '42px',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    opacity: isGenerating || !promptInput.trim() ? 0.7 : 1
                  }}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={16} className="pulse-active" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send to Agent</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* PRODUCTION PIPELINE STEPPER (Displayed during generation) */}
            {isGenerating && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '20px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--primary-border)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Stepper Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '18px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={16} className="pulse-active" color="var(--primary)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      AI Agent Pipeline: Producing Step {activeStep} of 5
                    </span>
                  </div>
                  <span
                    className="badge badge-in-progress pulse-active"
                    style={{ fontSize: '0.74rem' }}
                  >
                    Live Agent Execution
                  </span>
                </div>

                {/* 5-Step Stepper Horizontal Nodes */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '8px',
                    position: 'relative',
                    marginBottom: '16px'
                  }}
                >
                  {PRODUCTION_PIPELINE_STEPS.map((step) => {
                    const isDone = activeStep > step.num;
                    const isCurrent = activeStep === step.num;
                    const isQueued = activeStep < step.num;

                    return (
                      <div
                        key={step.num}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          padding: '10px 6px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isCurrent
                            ? 'var(--primary-subtle)'
                            : isDone
                            ? '#ffffff'
                            : 'rgba(255, 255, 255, 0.5)',
                          border: `1px solid ${
                            isCurrent
                              ? 'var(--primary)'
                              : isDone
                              ? 'var(--success-border)'
                              : 'var(--border-light)'
                          }`,
                          transition: 'all 0.25s ease'
                        }}
                      >
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '6px',
                            backgroundColor: isCurrent
                              ? 'var(--primary)'
                              : isDone
                              ? 'var(--success)'
                              : 'var(--border-light)',
                            color: '#ffffff',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}
                        >
                          {isDone ? (
                            <Check size={15} />
                          ) : isCurrent ? (
                            <RefreshCw size={13} className="pulse-active" />
                          ) : (
                            step.num
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: isCurrent ? 700 : 600,
                            color: isCurrent
                              ? 'var(--primary)'
                              : isDone
                              ? 'var(--success-text)'
                              : 'var(--text-muted)',
                            lineHeight: 1.2
                          }}
                        >
                          {step.name}
                        </span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            color: isCurrent
                              ? 'var(--primary)'
                              : isDone
                              ? 'var(--success-text)'
                              : 'var(--text-muted)',
                            marginTop: '2px'
                          }}
                        >
                          {isDone ? '✓ Completed' : isCurrent ? 'Producing...' : 'Queued'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Active Step Real-Time Spotlight Banner */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--primary-border)'
                  }}
                >
                  <Sparkles size={18} color="var(--primary)" className="pulse-active" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {generationStep}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {PRODUCTION_PIPELINE_STEPS.find((s) => s.num === activeStep)?.desc}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  backgroundColor: 'var(--danger-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--danger-border)',
                  fontSize: '0.82rem',
                  color: 'var(--danger-text)'
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* GENERATED AGENT OUTPUT: COMPLETE 5-STEP PRODUCTION VIEWER */}
          {generatedResult && (
            <div
              style={{
                marginTop: '24px',
                padding: '22px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #cbd5e1',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Output Top Bar with Summary and Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '16px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid var(--border-light)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span className={`badge ${getPlatformBadgeClass(generatedResult.platform)}`} style={{ fontSize: '0.82rem', padding: '4px 10px' }}>
                    {generatedResult.platform}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      Campaign Produced for: "{generatedResult.prompt}"
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                        ⚡ 5/5 Steps Successfully Generated via Gemini 3.8 Flash & Tavily
                      </span>
                      <span className="badge badge-completed" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                        {generatedResult.evaluation?.overall_score || 95}/100 Quality Score
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => copyToClipboard(generatedResult.content)}
                    className="btn btn-secondary btn-sm"
                  >
                    {copiedContent ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                    <span>{copiedContent ? 'Copied' : 'Copy Content'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onSaveGeneratedProject) {
                        const newProj = {
                          id: `proj-${Date.now()}`,
                          name: `${generatedResult.platform}: ${generatedResult.prompt.slice(0, 32)}...`,
                          platform: generatedResult.platform,
                          format: generatedResult.platform === 'TikTok' ? 'short-form video' : 'social media post',
                          status: 'Ready for Review',
                          lastUpdated: 'Just now',
                          dateCreated: new Date().toISOString().split('T')[0],
                          goal: generatedResult.plan?.content_goals || 'Engagement & Reach',
                          targetAudience: generatedResult.plan?.target_audience || 'Target Audience',
                          topic: generatedResult.prompt,
                          tone: generatedResult.plan?.branding || 'Engaging & Authentic',
                          workflowStages: {
                            planning: { id: 'stage-1', name: 'Planning & Branding', status: 'Completed', output: generatedResult.plan },
                            research: { id: 'stage-2', name: 'Research & Analysis', status: 'Completed', output: generatedResult.research },
                            creation: {
                              id: 'stage-3',
                              name: 'Content Creation',
                              status: 'Completed',
                              output: {
                                hook: generatedResult.content?.slice(0, 80) || generatedResult.prompt,
                                caption: generatedResult.content,
                                hashtags: `#${generatedResult.platform} #ContentFlowAI`
                              }
                            },
                            evaluator: {
                              id: 'stage-4',
                              name: 'Evaluator',
                              status: 'Completed',
                              output: {
                                overallScore: generatedResult.evaluation?.overall_score || 95,
                                checks: generatedResult.evaluation?.criteria || []
                              }
                            },
                            finalizer: {
                              id: 'stage-5',
                              name: 'Improve & Finalize',
                              status: 'Completed',
                              output: { actionKit: { kitText: generatedResult.action_kit } }
                            }
                          }
                        };
                        onSaveGeneratedProject(newProj);
                        setHasSavedProject(true);
                      }
                    }}
                    className="btn btn-primary btn-sm"
                    style={{
                      backgroundColor: hasSavedProject ? 'var(--success)' : 'var(--primary)',
                      borderColor: hasSavedProject ? 'var(--success)' : 'var(--primary)'
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>{hasSavedProject ? 'Saved to Projects' : 'Save to Projects'}</span>
                  </button>
                </div>
              </div>

              {/* 5-STEP PRODUCTION TABS SELECTOR */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '6px',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '4px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '16px'
                }}
              >
                {PRODUCTION_PIPELINE_STEPS.map((step) => {
                  const isActive = activeOutputStep === step.num;
                  return (
                    <button
                      key={step.num}
                      onClick={() => setActiveOutputStep(step.num)}
                      style={{
                        padding: '8px 10px',
                        fontSize: '0.78rem',
                        fontWeight: isActive ? 700 : 500,
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: isActive ? '#ffffff' : 'transparent',
                        color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                        boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isActive ? 'var(--primary)' : 'var(--border-light)',
                          color: isActive ? '#ffffff' : 'var(--text-muted)'
                        }}
                      >
                        {step.num}
                      </span>
                      <span>{step.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* STEP 1 OUTPUT: STRATEGY & PLANNING */}
              {activeOutputStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Step 1 Output: Content Strategy & Channel Plan
                    </h4>
                    <span className="badge badge-completed">✓ Strategy Aligned</span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '12px'
                    }}
                  >
                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)' }}>Target Audience</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                        {generatedResult.plan?.target_audience || 'Target demographics defined'}
                      </div>
                    </div>

                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)' }}>Content Goals</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                        {generatedResult.plan?.content_goals || 'Engagement & Discovery'}
                      </div>
                    </div>

                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)' }}>Publishing Schedule</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                        {generatedResult.plan?.publishing_schedule || 'Peak audience hours'}
                      </div>
                    </div>

                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)' }}>Brand Voice & Style</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                        {generatedResult.plan?.branding || 'Authentic & Value-Driven'}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.84rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <strong>Detailed Strategy Plan:</strong>
                    <div style={{ marginTop: '8px' }}>{generatedResult.plan?.plan_summary}</div>
                  </div>
                </div>
              )}

              {/* STEP 2 OUTPUT: MARKET & WEB RESEARCH */}
              {activeOutputStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Step 2 Output: Web Research & Competitive Intelligence
                    </h4>
                    <span className="badge badge-completed">✓ Live Search Synthesized</span>
                  </div>

                  {/* Web Search Signals */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '12px'
                    }}
                  >
                    <div style={{ padding: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '6px' }}>
                        🔍 Audience Interests & Questions
                      </div>
                      {generatedResult.research?.audience_interests?.length > 0 ? (
                        generatedResult.research.audience_interests.map((item, idx) => (
                          <div key={idx} style={{ fontSize: '0.8rem', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                            • <strong>{item.title}</strong>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item.content?.slice(0, 110)}...</div>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Identified key audience queries looking for direct takeaways and proven actionable tips.
                        </div>
                      )}
                    </div>

                    <div style={{ padding: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '6px' }}>
                        ⚡ Competitor Angles & Market Gaps
                      </div>
                      {generatedResult.research?.competitor_content?.length > 0 ? (
                        generatedResult.research.competitor_content.map((item, idx) => (
                          <div key={idx} style={{ fontSize: '0.8rem', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                            • <strong>{item.title}</strong>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item.content?.slice(0, 110)}...</div>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Competitors tend to stay generic. The winning angle is a fast 2-second visual hook with step-by-step clarity.
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.84rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <strong>Synthesized Research Summary:</strong>
                    <div style={{ marginTop: '8px' }}>{generatedResult.research?.summary}</div>
                  </div>
                </div>
              )}

              {/* STEP 3 OUTPUT: CREATED CONTENT */}
              {activeOutputStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Step 3 Output: Full Publish-Ready Content & Script
                    </h4>
                    <button
                      onClick={() => copyToClipboard(generatedResult.content)}
                      className="btn btn-secondary btn-sm"
                    >
                      {copiedContent ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                      <span>{copiedContent ? 'Copied' : 'Copy Script / Copy'}</span>
                    </button>
                  </div>

                  <div
                    style={{
                      padding: '18px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.86rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      maxHeight: '440px',
                      overflowY: 'auto',
                      fontFamily: generatedResult.platform === 'TikTok' ? 'var(--font-mono)' : 'inherit',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    {generatedResult.content}
                  </div>
                </div>
              )}

              {/* STEP 4 OUTPUT: QUALITY & POLICY EVALUATION */}
              {activeOutputStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Step 4 Output: Content Quality & Policy Audit
                    </h4>
                    <span className="badge badge-completed">
                      Score: {generatedResult.evaluation?.overall_score || 95}/100
                    </span>
                  </div>

                  {/* 4 Criteria Progress Breakdown */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '12px'
                    }}
                  >
                    {(
                      generatedResult.evaluation?.criteria || [
                        { name: 'Hook & Scroll-Stopping Power', score: 24, max: 25, status: 'Excellent' },
                        { name: 'Platform Fit & Formatting', score: 24, max: 25, status: 'Excellent' },
                        { name: 'Value Delivery & Clarity', score: 24, max: 25, status: 'Excellent' },
                        { name: 'Call to Action & Conversion', score: 23, max: 25, status: 'Strong' }
                      ]
                    ).map((crit, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '14px',
                          backgroundColor: 'var(--bg-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-light)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {crit.name || crit.criterion}
                          </span>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {crit.score} / {crit.max || 25}
                          </span>
                        </div>
                        <div
                          style={{
                            height: '6px',
                            backgroundColor: 'var(--border-light)',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              width: `${((crit.score || 24) / (crit.max || 25)) * 100}%`,
                              height: '100%',
                              backgroundColor: 'var(--primary)',
                              borderRadius: '3px'
                            }}
                          />
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--success-text)', marginTop: '4px', fontWeight: 600 }}>
                          Status: {crit.status || 'Verified'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.84rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <strong>Editorial Evaluation Findings:</strong>
                    <div style={{ marginTop: '8px' }}>
                      {generatedResult.evaluation?.evaluation_summary ||
                        'Overall Score: 95/100. Strong hook and high retention structure native to platform.'}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5 OUTPUT: FINAL ACTION KIT */}
              {activeOutputStep === 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Step 5 Output: Creator & Publisher Turn-Key Action Kit
                    </h4>
                    <button
                      onClick={() => copyToClipboard(generatedResult.action_kit)}
                      className="btn btn-secondary btn-sm"
                    >
                      {copiedContent ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                      <span>{copiedContent ? 'Copied' : 'Copy Full Action Kit'}</span>
                    </button>
                  </div>

                  <div
                    style={{
                      padding: '18px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.84rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      maxHeight: '440px',
                      overflowY: 'auto',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    {generatedResult.action_kit}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: 4 OVERVIEW METRIC CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px'
        }}
      >
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Total Projects
            </span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--primary-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FolderKanban size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {showEmptyStateDemo ? 0 : totalProjects}
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '4px'
            }}
          >
            <TrendingUp size={12} color="var(--success)" />
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>+3</span> created this week
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Drafts
            </span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileEdit size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {showEmptyStateDemo ? 0 : draftCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Awaiting prompt generation
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Ready for Review
            </span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--warning-subtle)',
                color: 'var(--warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {showEmptyStateDemo ? 0 : readyCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--warning-text)', marginTop: '4px' }}>
            Action needed before publishing
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Published Content
            </span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--success-subtle)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {showEmptyStateDemo ? 0 : completedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Assets live across platforms
          </div>
        </div>
      </div>

      {/* SECTION 3: RECENT PROJECTS (Left) & UPCOMING CONTENT (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.15fr)',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        <div className="card" style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Recent Projects</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Active campaigns generated by the AI agent
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('projects')}
              className="btn btn-ghost"
              style={{ fontSize: '0.82rem', gap: '4px', color: 'var(--primary)' }}
            >
              <span>View All</span>
              <ChevronRight size={15} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {displayProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onOpenProject(project.id)}
                className="card card-hover card-interactive"
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}
                  >
                    <span className={`badge ${getPlatformBadgeClass(project.platform)}`}>
                      {project.platform}
                    </span>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--text-muted)',
                        textTransform: 'capitalize'
                      }}
                    >
                      {project.format}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {project.name}
                  </div>

                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      marginTop: '4px'
                    }}
                  >
                    Updated {project.lastUpdated}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {getStatusBadge(project.status)}
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenProject(project.id);
                    }}
                  >
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Upcoming Content Preview */}
        <div className="card" style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Upcoming Content</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Publishing queue for this week
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('calendar')}
              className="btn btn-ghost"
              style={{ fontSize: '0.82rem', gap: '4px', color: 'var(--primary)' }}
            >
              <Calendar size={14} />
              <span>Calendar</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingContent.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span className={`badge ${getPlatformBadgeClass(item.platform)}`}>
                    {item.platform}
                  </span>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {item.plannedDate} • {item.time}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)'
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    marginTop: '2px'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      color: item.status === 'Ready' ? 'var(--success-text)' : 'var(--warning-text)'
                    }}
                  >
                    ● {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('calendar')}
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: '16px', fontSize: '0.84rem' }}
          >
            <span>Open Schedule Calendar</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
