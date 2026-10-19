import React, { useState } from 'react';
import {
  Key,
  Cpu,
  Globe,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Save,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

export default function SettingsView() {
  const [geminiKey, setGeminiKey] = useState('AIzaSyD-•••••••••••••••••••••••••••••••••');
  const [tavilyKey, setTavilyKey] = useState('tvly-•••••••••••••••••••••••••••••••••');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [offlineFallback, setOfflineFallback] = useState(true);
  const [autoEvaluate, setAutoEvaluate] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div style={{ maxWidth: '840px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {savedSuccess && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 18px',
            backgroundColor: 'var(--success-subtle)',
            border: '1px solid var(--success-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--success-text)',
            fontSize: '0.88rem',
            animation: 'slideIn 0.2s ease'
          }}
        >
          <CheckCircle2 size={18} />
          <span>Studio settings and agent API keys saved successfully!</span>
        </div>
      )}

      {/* AI Agent Engine Settings */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
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
          <h3 style={{ fontSize: '1.08rem', fontWeight: 600, margin: 0 }}>
            AI Agent Engine & LLM Configuration
          </h3>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Connect your Google Gemini and Tavily search credentials to empower live agent chaining
        </p>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}
            >
              Google Gemini API Key
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                style={{ width: '100%', height: '38px', padding: '0 12px' }}
              />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Used for Planning, Creative Copywriting, Quality Evaluation, and Refinement.
            </span>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}
            >
              Tavily Web Search API Key (Real-Time Research)
            </label>
            <input
              type="password"
              value={tavilyKey}
              onChange={(e) => setTavilyKey(e.target.value)}
              style={{ width: '100%', height: '38px', padding: '0 12px' }}
            />
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Powers Step 2 Research & Analysis to gather real-time audience questions & competitor trends.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '6px'
                }}
              >
                Default Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                style={{ width: '100%', height: '38px', padding: '0 10px' }}
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Fastest)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Reasoning)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '6px'
                }}
              >
                Workflow Execution Mode
              </label>
              <select style={{ width: '100%', height: '38px', padding: '0 10px' }}>
                <option value="streaming">Live Prompt Chaining (Streaming)</option>
                <option value="batch">Sequential Batch Processing</option>
              </select>
            </div>
          </div>

          {/* Toggle Switches */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '6px'
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '0.84rem',
                fontWeight: 500
              }}
            >
              <input
                type="checkbox"
                checked={offlineFallback}
                onChange={(e) => setOfflineFallback(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              <span>Enable Offline Fallback Mode when external APIs are unreachable</span>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '0.84rem',
                fontWeight: 500
              }}
            >
              <input
                type="checkbox"
                checked={autoEvaluate}
                onChange={(e) => setAutoEvaluate(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              <span>Automatically trigger Stage 4 Quality Evaluator after content generation</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
