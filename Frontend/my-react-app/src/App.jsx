import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardView from './components/dashboard/DashboardView';
import ProjectsView from './components/projects/ProjectsView';
import CalendarView from './components/calendar/CalendarView';
import LibraryView from './components/library/LibraryView';
import AnalyticsView from './components/analytics/AnalyticsView';
import SettingsView from './components/settings/SettingsView';
import ProjectWorkspace from './components/workspace/ProjectWorkspace';
import CreateContentModal from './components/create/CreateContentModal';

import {
  INITIAL_BRANDS,
  INITIAL_PROJECTS,
  UPCOMING_SCHEDULE,
  CONTENT_LIBRARY,
  ANALYTICS_METRICS
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Core Data State
  const [brands, setBrands] = useState(INITIAL_BRANDS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [upcomingSchedule, setUpcomingSchedule] = useState(UPCOMING_SCHEDULE);
  const [contentLibrary, setContentLibrary] = useState(CONTENT_LIBRARY);
  const [analyticsData, setAnalyticsData] = useState(ANALYTICS_METRICS);

  // Active Project for Workspace
  const [currentProjectId, setCurrentProjectId] = useState('proj-1');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast System
  const [toasts, setToasts] = useState([]);

  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Open a project in workspace
  const handleOpenProject = (projectId) => {
    setCurrentProjectId(projectId);
    setActiveTab('workspace');
  };

  // Create new project
  const handleCreateProject = (newProject, actionType) => {
    // If user clicked "Generate Content with AI", seed realistic 5-stage data
    const fullProject = {
      ...newProject,
      workflowStages: {
        planning: {
          id: 'stage-1',
          name: 'Planning & Branding',
          status: 'Completed',
          timestamp: 'Just now',
          output: {
            targetAudience: newProject.targetAudience,
            contentGoals: newProject.goal,
            topicsAndFormats: `Tailored ${newProject.platform} content for: "${newProject.topic}"`,
            publishingSchedule: 'Optimal peak algorithm window (Wednesday or Thursday 6:00 PM)',
            brandingGuidelines: `Aligned with ${newProject.brandName} voice and core values.`
          }
        },
        research: {
          id: 'stage-2',
          name: 'Research & Analysis',
          status: actionType === 'generate' ? 'Completed' : 'Pending',
          timestamp: 'Just now',
          output: {
            audienceInsights: `Audience search queries indicate high engagement for authentic, behind-the-scenes perspectives regarding ${newProject.topic}.`,
            competitorGap: `Competitors focus on static announcements. Standing out requires an immediate emotional hook in the opening seconds.`,
            sources: [
              {
                title: `Tavily Search: Live Market Trends for ${newProject.platform}`,
                url: 'https://tavily.com/results',
                isLiveSource: true,
                snippet: `Engagement surges 3.2x when direct questions and localized geotags are utilized.`
              }
            ]
          }
        },
        creation: {
          id: 'stage-3',
          name: 'Content Creation',
          status: actionType === 'generate' ? 'Completed' : 'Draft',
          timestamp: 'Just now',
          output: {
            hook: `Stop scrolling if you need the ultimate solution for ${newProject.topic.split(' ')[0]}... 🚀`,
            caption: `${newProject.topic}\n\nHere is how we deliver exceptional results:\n1. Precision craftsmanship & care\n2. Proven satisfaction\n\nDrop a comment or check the link in our bio! 👇`,
            hashtags: `#${newProject.brandName.replace(/\s+/g, '')} #${newProject.platform}Marketing #Trending #Growth`,
            visualConcept: 'Crisp cinematic lighting with macro focal point and clean typography overlays.',
            imagePrompt: `High-resolution commercial promotional visual representing ${newProject.topic}, clean aesthetic, studio lighting.`,
            scriptScenes: [
              {
                time: '00:00 - 00:03',
                framing: 'Macro Close-Up',
                action: 'Intriguing visual reveal',
                textOverlay: 'Wait until you see this... 👀',
                voiceover: 'If you want better results, pay attention right now.'
              },
              {
                time: '00:03 - 00:15',
                framing: 'Dynamic Action',
                action: 'Demonstration of the core product/service in action',
                textOverlay: 'The game changer ✨',
                voiceover: 'Here is what makes this stand out from everything else.'
              },
              {
                time: '00:15 - 00:25',
                framing: 'Call to Action Card',
                action: 'Showcase brand logo and link in bio pointer',
                textOverlay: 'Link in bio to learn more!',
                voiceover: 'Tag a friend who needs this and follow for more!'
              }
            ]
          }
        },
        evaluator: {
          id: 'stage-4',
          name: 'Evaluator',
          status: actionType === 'generate' ? 'Completed' : 'Pending',
          output: {
            overallScore: 92,
            assessmentSummary: 'Strong brand tone alignment, compelling hook, and clear platform-native call-to-action.',
            checks: [
              { criterion: 'Brand Consistency', passed: true, score: 95, detail: 'Matches designated tone perfectly.' },
              { criterion: 'Audience Relevance', passed: true, score: 92, detail: 'Directly addresses target pain points.' },
              { criterion: 'Clarity & Readability', passed: true, score: 94, detail: 'Clear, concise script pacing.' },
              { criterion: 'Goal Alignment', passed: true, score: 90, detail: 'Clear next step for the viewer.' },
              { criterion: 'Platform Suitability', passed: true, score: 96, detail: `Native format for ${newProject.platform}.` }
            ],
            actionableSuggestions: [
              'Pin an engaging conversation starter in the first comment immediately after posting.'
            ]
          }
        },
        finalizer: {
          id: 'stage-5',
          name: 'Improve & Finalize',
          status: actionType === 'generate' ? 'Completed' : 'Pending',
          output: {
            pinnedComment: 'What do you think? Let us know below! 👇',
            actionKit: {
              launchProtocol: [
                'Minute 0: Publish video with geotagged location.',
                'Minute 1: Post and pin the First Comment immediately.',
                'Minute 5-30: Reply to all initial comments.'
              ]
            }
          }
        }
      }
    };

    setProjects([fullProject, ...projects]);
    setCurrentProjectId(fullProject.id);
    setActiveTab('workspace');
    showToast(
      actionType === 'generate'
        ? 'Generated content project with AI agent!'
        : 'Saved project as draft.'
    );
  };

  // Duplicate Project
  const handleDuplicateProject = (projectId) => {
    const orig = projects.find((p) => p.id === projectId);
    if (!orig) return;
    const dup = {
      ...orig,
      id: `proj-${Date.now()}`,
      name: `${orig.name} (Copy)`,
      lastUpdated: 'Just now'
    };
    setProjects([dup, ...projects]);
    showToast(`Duplicated project: ${dup.name}`);
  };

  // Delete Project
  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter((p) => p.id !== projectId));
    showToast('Project deleted.');
  };

  // Rename Project
  const handleRenameProject = (projectId, newName) => {
    setProjects(
      projects.map((p) => (p.id === projectId ? { ...p, name: newName, lastUpdated: 'Just now' } : p))
    );
    showToast('Project renamed.');
  };

  // Save Brand Profile
  const handleSaveBrand = (updatedBrand) => {
    const exists = brands.some((b) => b.id === updatedBrand.id);
    if (exists) {
      setBrands(brands.map((b) => (b.id === updatedBrand.id ? updatedBrand : b)));
      showToast(`Updated brand: ${updatedBrand.name}`);
    } else {
      setBrands([...brands, updatedBrand]);
      showToast(`Created new brand: ${updatedBrand.name}`);
    }
  };

  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  return (
    <div className="app-container">
      {/* Persistent Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onCreateNew={() => setIsCreateModalOpen(true)}
        projectCount={projects.length}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          currentProjectTitle={currentProject?.name}
          onCreateNew={() => setIsCreateModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenProject={handleOpenProject}
        />

        {/* Dynamic Page Views */}
        <main className="content-area">
          {activeTab === 'dashboard' && (
            <DashboardView
              projects={projects}
              upcomingContent={upcomingSchedule}
              onOpenProject={handleOpenProject}
              onCreateNew={() => setIsCreateModalOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSaveGeneratedProject={(newProj) => {
                setProjects([newProj, ...projects]);
                showToast(`Saved new ${newProj.platform} content project!`);
              }}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              brands={brands}
              onOpenProject={handleOpenProject}
              onCreateNew={() => setIsCreateModalOpen(true)}
              onDuplicateProject={handleDuplicateProject}
              onDeleteProject={handleDeleteProject}
              onRenameProject={handleRenameProject}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              scheduleItems={upcomingSchedule}
              brands={brands}
              onCreateNew={() => setIsCreateModalOpen(true)}
              onOpenProject={handleOpenProject}
            />
          )}

          {activeTab === 'library' && (
            <LibraryView
              libraryItems={contentLibrary}
              onOpenProject={handleOpenProject}
              onCopyContent={(title) => showToast(`Copied content from: ${title}`)}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsView analyticsData={analyticsData} />}

          {activeTab === 'settings' && <SettingsView />}

          {activeTab === 'workspace' && (
            <ProjectWorkspace
              project={currentProject}
              onBack={() => setActiveTab('projects')}
              onUpdateProject={(updated) => {
                setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
              }}
              onToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Create New Content Modal Form */}
      <CreateContentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        brands={brands}
        onSubmit={handleCreateProject}
      />

      {/* Global Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <span>●</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
