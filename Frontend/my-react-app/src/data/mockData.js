export const INITIAL_BRANDS = [
  {
    id: "brand-1",
    name: "Sakura Japanese Bistro",
    tagline: "Artisanal Omakase & Modern Japanese Gastronomy",
    description: "Upscale modern Japanese dining specializing in artisanal omakase, torched rolls, and craft cocktails.",
    targetAudience: "Foodies, young professionals (22-45), date-night couples, and culinary enthusiasts seeking authentic, high-grade dining experiences.",
    voiceAndTone: "Warm, aesthetic, passionate, sensory-rich, and refined without being pretentious.",
    coreMessaging: "Master craftsmanship meets fresh daily bluefin tuna, immersive dining, and unforgettable date night memories.",
    preferredTerminology: [
      "Artisanal cuts",
      "Fresh daily",
      "Craft culinary experience",
      "Omakase",
      "Signature torched roll",
      "Local hidden gem"
    ],
    phrasesToAvoid: [
      "Cheap eats",
      "Fast food",
      "Discount sushi",
      "All you can eat",
      "Basic dinner"
    ],
    brandColors: ["#e11d48", "#1e1b4b", "#fde047", "#f8fafc"],
    logo: "🍣",
    contentGuidelines: "Focus on macro textures, sizzling torches, chef knife technique, vibrant ambient dining lighting, and authentic visitor reactions.",
    preferredPlatforms: ["TikTok", "Instagram"]
  },
  {
    id: "brand-2",
    name: "Star Skin Care",
    tagline: "Clinical Beauty & Skin Barrier Solutions",
    description: "Dermatologist-formulated, clean clinical beauty solutions designed for radiant, glass-skin transformation.",
    targetAudience: "Skincare conscious individuals (18-40) dealing with barrier repair, deep hydration, and dull or uneven texture.",
    voiceAndTone: "Scientific yet conversational, encouraging, transparent, and empowering.",
    coreMessaging: "Clean science, proven dermatological ingredients, cruelty-free barrier protection.",
    preferredTerminology: [
      "Barrier support",
      "Glass skin",
      "Ceramide complex",
      "Clinical efficacy",
      "Glow ritual"
    ],
    phrasesToAvoid: [
      "Miracle cure",
      "Overnight perfection",
      "Harsh chemicals",
      "Quick fix"
    ],
    brandColors: ["#7c3aed", "#ec4899", "#f3e8ff", "#0f172a"],
    logo: "✨",
    contentGuidelines: "Side-by-side texture swatches, ingredient breakdowns, morning/night routines, dermatologist endorsements.",
    preferredPlatforms: ["TikTok", "Instagram", "Blog"]
  },
  {
    id: "brand-3",
    name: "Apex Cloud AI",
    tagline: "Autonomous Agent Orchestration & Compute",
    description: "Enterprise AI infrastructure and intelligent autonomous agent orchestration platform.",
    targetAudience: "CTOs, VP of Engineering, tech leads, Senior Architects, and innovative SaaS builders.",
    voiceAndTone: "Authoritative, insightful, data-driven, practical, engineering-first.",
    coreMessaging: "Zero-latency orchestration, deterministic reliability, cutting compute overhead by 40%.",
    preferredTerminology: [
      "Deterministic agents",
      "Prompt chaining",
      "State machines",
      "Latency benchmarks",
      "Enterprise security"
    ],
    phrasesToAvoid: [
      "Magic AI",
      "Robot replacement",
      "Hype without substance"
    ],
    brandColors: ["#2563eb", "#06b6d4", "#0f172a", "#f1f5f9"],
    logo: "⚡",
    contentGuidelines: "System architecture diagrams, code walkthroughs, benchmark tables, engineering lessons.",
    preferredPlatforms: ["LinkedIn", "X", "Blog"]
  }
];

export const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    name: "Sakura Bistro: Torched Salmon & Crispy Rice Viral Launch",
    brandId: "brand-1",
    brandName: "Sakura Japanese Bistro",
    platform: "TikTok",
    format: "short-form video",
    status: "Ready for Review",
    lastUpdated: "12 mins ago",
    dateCreated: "2026-10-17",
    goal: "Brand Awareness & Table Bookings",
    targetAudience: "Young foodies (21-38) looking for aesthetic dining spots in downtown",
    topic: "New sushi restaurant opening featuring signature torched salmon roll and crispy rice spicy tuna",
    tone: "Energetic, Sensory & Craving-Inducing",
    workflowStages: {
      planning: {
        id: "stage-1",
        name: "Planning & Branding",
        status: "Completed",
        timestamp: "Today at 10:14 AM",
        output: {
          targetAudience: "Active TikTok food enthusiasts, couples looking for date night spots, and sushi lovers within 15 miles of Downtown.",
          contentGoals: "Drive immediate viral local discovery, generate cravings through visual hooks, and direct viewers to bio reservation link.",
          topicsAndFormats: "High-energy 25-second vertical video script with visual beat sheet, macro food shots, and punchy text overlays.",
          publishingSchedule: "Thursday or Friday between 5:30 PM - 7:30 PM (peak dinner planning window).",
          brandingGuidelines: "Sophisticated yet approachable tone. Highlight master knife skills and fresh bluefin tuna sliced daily."
        }
      },
      research: {
        id: "stage-2",
        name: "Research & Analysis",
        status: "Completed",
        timestamp: "Today at 10:15 AM",
        output: {
          audienceInsights: "Diners frequently complain about frozen fish quality and overcrowded noisy rooms. They crave authentic craft preparation and visually aesthetic plating.",
          competitorGap: "Competitor restaurant videos are mostly static food photos with generic trending songs. Our angle: showcase the intense chef torching action in the first 2 seconds with crisp sound design.",
          industryTrends: "Short-form food content in 2026 thrives on 'Show, Don't Tell', ASMR torching/slicing audio, and immediate location tagging in the first 3 seconds.",
          sources: [
            {
              title: "Tavily Search: Top Viral Food Angles on TikTok 2026",
              url: "https://insights.tavily.com/reports/food-trends",
              isLiveSource: true,
              snippet: "Close-up macro b-roll torching glazes drives a 3.4x higher video completion rate over wide shot dining rooms."
            },
            {
              title: "Local Dining Habits & Date Night Trends Report",
              url: "https://foodiesurvey.internal/2026/date-nights",
              isLiveSource: true,
              snippet: "82% of diners under 35 pick weekend dinner spots directly from TikTok bookmarks and saved Reels."
            },
            {
              title: "AI Agent Market Synthesis",
              url: "agent://internal-synthesis",
              isLiveSource: false,
              snippet: "AI recommendation: Emphasize the crispy rice texture contrast and limited daily omakase seat availability."
            }
          ]
        }
      },
      creation: {
        id: "stage-3",
        name: "Content Creation",
        status: "Completed",
        timestamp: "Today at 10:16 AM",
        output: {
          hook: "Found your new sushi obsession in town... 🍣🔥",
          videoDuration: "25-30 seconds",
          audioRecommendation: "Trending upbeat lo-fi / indie hip-hop dining vibe",
          scriptScenes: [
            {
              time: "00:00 - 00:03",
              framing: "Macro Close-Up",
              action: "Extreme close-up macro shot of chef torching signature salmon sushi roll with truffle glaze bubbling.",
              textOverlay: "Found your new sushi obsession in town... 🍣🔥",
              voiceover: "If you're still looking for the best new sushi in town, stop scrolling right now."
            },
            {
              time: "00:03 - 00:09",
              framing: "Chef Action Cut",
              action: "Fast cut to master chef slicing ultra-fresh bluefin tuna with precision knife work, panning to sleek bar.",
              textOverlay: "Fresh cuts sliced daily ✨",
              voiceover: "This newly opened spot just landed, and everything is prepared fresh daily by master chefs."
            },
            {
              time: "00:09 - 00:18",
              framing: "POV Tasting",
              action: "POV shot dipping the signature Crispy Rice Spicy Tuna into artisanal soy glaze, taking a bite with audible crunch.",
              textOverlay: "You HAVE to order the Crispy Rice Tuna 🤤",
              voiceover: "From their melt-in-your-mouth sashimi to this crispy rice, the flavor balance is next level."
            },
            {
              time: "00:18 - 00:25",
              framing: "Wide Table Spread",
              action: "Cozy candle-lit table spread with signature cocktails, flashing address and warm aesthetic interior.",
              textOverlay: "📍 Sakura Bistro - 412 Main St | Save for your next date night!",
              voiceover: "Tag someone who owes you a sushi date and check them out this weekend!"
            }
          ],
          caption: "Run, don't walk! 🍣 Found the newest sushi hidden gem in town and the quality blew us away. The torched salmon and crispy rice are an absolute 10/10.\n\n📍 Location: Sakura Japanese Bistro, 412 Downtown Main St.\n⏰ Open Tuesday - Sunday 12 PM - 10 PM\nSave this for your next dinner spot! 👇",
          hashtags: "#SushiLovers #NewRestaurant #FoodieTok #SushiTikTok #LocalEats #FoodReview #DateNightSpot #SakuraBistro",
          visualConcept: "High-contrast culinary cinematography with warm amber lighting, macro food steam, and crisp handheld camera movement.",
          imagePrompt: "Photorealistic macro close-up of a torched salmon sushi roll with glistening truffle glaze and microgreens, sizzling torch flame in background, cinematic shallow depth of field, warm restaurant lighting, 8k resolution."
        }
      },
      evaluator: {
        id: "stage-4",
        name: "Evaluator",
        status: "Completed",
        timestamp: "Today at 10:17 AM",
        output: {
          overallScore: 94,
          assessmentSummary: "Excellent high-converting script with strong emotional hook, authentic brand alignment, and clear local call-to-action.",
          checks: [
            {
              criterion: "Brand Consistency",
              passed: true,
              score: 96,
              detail: "Voice reflects refined craftsmanship, sensory delight, and avoids prohibited terms like 'cheap eats'."
            },
            {
              criterion: "Audience Relevance",
              passed: true,
              score: 95,
              detail: "Targets foodie cravings directly with visual crunch, date-night ambiance, and local relevance."
            },
            {
              criterion: "Clarity & Readability",
              passed: true,
              score: 98,
              detail: "Concise scene pacing (25 seconds total). Script lines are natural, engaging, and easy to record."
            },
            {
              criterion: "Goal Alignment",
              passed: true,
              score: 92,
              detail: "Successfully drives curiosity and directs viewers to the bio link for table reservations."
            },
            {
              criterion: "Factual Accuracy & Source Support",
              passed: true,
              score: 90,
              detail: "Verified address, operating hours, and dish names against Sakura brand profile specifications."
            },
            {
              criterion: "Platform Suitability",
              passed: true,
              score: 95,
              detail: "Vertical 9:16 framing, on-screen text for sound-off viewers, and trending audio suggestions tailored for TikTok."
            },
            {
              criterion: "Call to Action Completeness",
              passed: true,
              score: 91,
              detail: "Dual CTA present: tag a date in comments + save post for weekend planning."
            }
          ],
          actionableSuggestions: [
            "Add a pinned comment immediately after posting asking viewers to vote between torched salmon vs crispy rice.",
            "Ensure the first 1.5 seconds starts directly on the flame torching to prevent scroll-aways."
          ]
        }
      },
      finalizer: {
        id: "stage-5",
        name: "Improve & Finalize",
        status: "Needs Review",
        timestamp: "Today at 10:18 AM",
        output: {
          improvementSummary: "Polished hook pacing by 0.5s for faster algorithm capture, enhanced hashtag stack with 3 high-volume local geo-tags, and generated full Creator Action Kit.",
          revisedHook: "Found your new sushi obsession in town... 🍣🔥 (Watch till end!)",
          pinnedComment: "Which roll are you trying first: The Torched Salmon or Crispy Rice Spicy Tuna? Let us know below! 👇 (Table reservation link in bio!)",
          actionKit: {
            launchProtocol: [
              "Minute 0: Publish video with geotag set to Sakura Japanese Bistro Downtown.",
              "Minute 1: Post and pin the First Comment immediately to trigger discussion.",
              "Minute 5: Share video directly to Instagram Reels / TikTok Story with 'New Reel' sticker.",
              "Minute 5-30: Reply to every comment within the first 30 minutes to boost algorithmic reach."
            ]
          }
        }
      }
    }
  },
  {
    id: "proj-2",
    name: "Star Skin Care: The 3-Step Glass Skin Glow Ritual",
    brandId: "brand-2",
    brandName: "Star Skin Care",
    platform: "Instagram",
    format: "carousel",
    status: "In Progress",
    lastUpdated: "2 hours ago",
    dateCreated: "2026-10-17",
    goal: "Product Education & Conversions",
    targetAudience: "Women and men 20-35 seeking clinical barrier hydration without irritation",
    topic: "Educational carousel breaking down 3 dermatologist-approved steps for lasting glass skin",
    tone: "Scientific, Conversational & Reassuring",
    workflowStages: {
      planning: {
        id: "stage-1",
        name: "Planning & Branding",
        status: "Completed",
        timestamp: "Today at 08:30 AM",
        output: {
          targetAudience: "Individuals looking for gentle, science-backed barrier restoration.",
          contentGoals: "Educate audience on skin barrier science and introduce the Star Barrier Ceramide Serum.",
          topicsAndFormats: "7-slide Instagram aesthetic carousel with step-by-step visual swatches.",
          publishingSchedule: "Wednesday at 11:00 AM EST.",
          brandingGuidelines: "Lavender and pink palette, clinical elegance, clean typography."
        }
      },
      research: {
        id: "stage-2",
        name: "Research & Analysis",
        status: "Completed",
        timestamp: "Today at 08:32 AM",
        output: {
          audienceInsights: "High user frustration with 10-step skincare routines causing breakout flares. Craving simple, potent, 3-step routines.",
          competitorGap: "Competitors push unrealistic instant results. We differentiate with clinical barrier science and dermatological testing proof.",
          industryTrends: "Minimalist skincare ('skin-streaming') is dominating beauty discussions.",
          sources: [
            {
              title: "Dermatology Review: Barrier Repair Formulations",
              url: "https://clinicalskin.org/research/ceramides",
              isLiveSource: true,
              snippet: "Ceramides combined with hyaluronic acid restore lipid bilayer integrity within 72 hours."
            }
          ]
        }
      },
      creation: {
        id: "stage-3",
        name: "Content Creation",
        status: "Running",
        timestamp: "Today at 08:34 AM",
        output: {
          hook: "Why your 10-step skincare routine is actually damaging your skin barrier 🧴❌",
          caption: "More products ≠ better skin. Here is how to achieve healthy, radiant glass skin in just 3 clinical steps...",
          hashtags: "#GlassSkin #SkinBarrier #DermApproved #CleanBeauty #Ceramides #StarSkinCare",
          visualConcept: "Minimalist clean pastel background with dewy droplet textures and clear slide numbering."
        }
      },
      evaluator: {
        id: "stage-4",
        name: "Evaluator",
        status: "Pending",
        output: null
      },
      finalizer: {
        id: "stage-5",
        name: "Improve & Finalize",
        status: "Pending",
        output: null
      }
    }
  },
  {
    id: "proj-3",
    name: "Transitioning from Senior Engineer to Engineering Manager",
    brandId: "brand-3",
    brandName: "Apex Cloud AI",
    platform: "LinkedIn",
    format: "social media post",
    status: "Completed",
    lastUpdated: "Yesterday",
    dateCreated: "2026-10-16",
    goal: "Thought Leadership & Talent Brand",
    targetAudience: "Senior software developers, tech leads, and new engineering managers",
    topic: "Vulnerable personal reflections on switching from writing code to building teams",
    tone: "Authoritative, Story-Driven & Practical",
    workflowStages: {
      planning: { id: "stage-1", name: "Planning & Branding", status: "Completed" },
      research: { id: "stage-2", name: "Research & Analysis", status: "Completed" },
      creation: { id: "stage-3", name: "Content Creation", status: "Completed" },
      evaluator: { id: "stage-4", name: "Evaluator", status: "Completed" },
      finalizer: { id: "stage-5", name: "Improve & Finalize", status: "Completed" }
    }
  },
  {
    id: "proj-4",
    name: "Premature Optimization vs Simplicity in Architecture",
    brandId: "brand-3",
    brandName: "Apex Cloud AI",
    platform: "X",
    format: "social media post",
    status: "Completed",
    lastUpdated: "3 days ago",
    dateCreated: "2026-10-14",
    goal: "Community Engagement & Viral Discussion",
    targetAudience: "Fullstack developers, distributed systems engineers, founders",
    topic: "Why 90% of microservices should have been clean modular monoliths",
    tone: "Punchy, Direct & Provocative",
    workflowStages: {
      planning: { id: "stage-1", name: "Planning & Branding", status: "Completed" },
      research: { id: "stage-2", name: "Research & Analysis", status: "Completed" },
      creation: { id: "stage-3", name: "Content Creation", status: "Completed" },
      evaluator: { id: "stage-4", name: "Evaluator", status: "Completed" },
      finalizer: { id: "stage-5", name: "Improve & Finalize", status: "Completed" }
    }
  },
  {
    id: "proj-5",
    name: "Apex Ergonomic Mechanical Keyboard 20% Launch Promo",
    brandId: "brand-3",
    brandName: "Apex Cloud AI",
    platform: "Facebook",
    format: "advertisement",
    status: "Draft",
    lastUpdated: "4 days ago",
    dateCreated: "2026-10-13",
    goal: "Direct Response Sales",
    targetAudience: "Remote software workers, desk enthusiasts, ergonomics seekers",
    topic: "Launch announcement with limited-time 20% discount code",
    tone: "Persuasive, Crisp & High-Converting",
    workflowStages: {
      planning: { id: "stage-1", name: "Planning & Branding", status: "Completed" },
      research: { id: "stage-2", name: "Research & Analysis", status: "Pending" },
      creation: { id: "stage-3", name: "Content Creation", status: "Pending" },
      evaluator: { id: "stage-4", name: "Evaluator", status: "Pending" },
      finalizer: { id: "stage-5", name: "Improve & Finalize", status: "Pending" }
    }
  },
  {
    id: "proj-6",
    name: "Building Autonomous AI Agents with LangGraph in 2026",
    brandId: "brand-3",
    brandName: "Apex Cloud AI",
    platform: "Blog",
    format: "blog article",
    status: "Ready for Review",
    lastUpdated: "5 days ago",
    dateCreated: "2026-10-12",
    goal: "Organic SEO & Developer Adoption",
    targetAudience: "AI engineers, Python developers, product teams",
    topic: "Comprehensive architectural guide to state machines, cyclic graphs, and human-in-the-loop workflows",
    tone: "Deep Technical, Educational & Thorough",
    workflowStages: {
      planning: { id: "stage-1", name: "Planning & Branding", status: "Completed" },
      research: { id: "stage-2", name: "Research & Analysis", status: "Completed" },
      creation: { id: "stage-3", name: "Content Creation", status: "Completed" },
      evaluator: { id: "stage-4", name: "Evaluator", status: "Completed" },
      finalizer: { id: "stage-5", name: "Improve & Finalize", status: "Completed" }
    }
  }
];

export const UPCOMING_SCHEDULE = [
  {
    id: "sched-1",
    title: "Sakura Bistro: Torched Salmon TikTok Reel",
    platform: "TikTok",
    brandName: "Sakura Japanese Bistro",
    plannedDate: "Oct 20, 2026",
    time: "6:30 PM",
    status: "Ready"
  },
  {
    id: "sched-2",
    title: "Star Skin Care: Barrier Routine Carousel",
    platform: "Instagram",
    brandName: "Star Skin Care",
    plannedDate: "Oct 21, 2026",
    time: "11:00 AM",
    status: "In Review"
  },
  {
    id: "sched-3",
    title: "Apex Cloud: Senior to EM Transition Lessons",
    platform: "LinkedIn",
    brandName: "Apex Cloud AI",
    plannedDate: "Oct 22, 2026",
    time: "8:45 AM",
    status: "Scheduled"
  },
  {
    id: "sched-4",
    title: "Simplicity in Software Architecture Thread",
    platform: "X",
    brandName: "Apex Cloud AI",
    plannedDate: "Oct 24, 2026",
    time: "2:00 PM",
    status: "Scheduled"
  }
];

export const CONTENT_LIBRARY = [
  {
    id: "lib-1",
    title: "Viral TikTok Foodie Hook: Torched Truffle Glaze",
    snippet: "If you're still looking for the best new sushi in town, stop scrolling right now... Fresh cuts prepared daily by master chefs.",
    platform: "TikTok",
    format: "short-form video",
    brandName: "Sakura Japanese Bistro",
    date: "Oct 17, 2026",
    status: "Approved",
    wordCount: 184
  },
  {
    id: "lib-2",
    title: "3-Step Glass Skin Clinical Routine Guide",
    snippet: "Why your 10-step skincare routine is damaging your barrier. Step 1: Gentle hydrator. Step 2: Ceramide complex. Step 3: Lipid seal.",
    platform: "Instagram",
    format: "carousel",
    brandName: "Star Skin Care",
    date: "Oct 17, 2026",
    status: "Draft",
    wordCount: 420
  },
  {
    id: "lib-3",
    title: "Senior Engineer to Engineering Manager Checklist",
    snippet: "Your output is no longer lines of code committed. Your output is the clarity, autonomy, and velocity of the team you build.",
    platform: "LinkedIn",
    format: "social media post",
    brandName: "Apex Cloud AI",
    date: "Oct 16, 2026",
    status: "Published",
    wordCount: 310
  },
  {
    id: "lib-4",
    title: "Why Modular Monoliths Win 90% of the Time",
    snippet: "Before you spin up 14 Kubernetes clusters, ask yourself: does your team have the distributed tracing maturity to debug a cascading timeout?",
    platform: "X",
    format: "social media post",
    brandName: "Apex Cloud AI",
    date: "Oct 14, 2026",
    status: "Published",
    wordCount: 220
  },
  {
    id: "lib-5",
    title: "Comprehensive LangGraph & AI Agents Tutorial",
    snippet: "Learn how cyclic graphs and multi-step state machines enable resilient, long-running agentic workflows that self-correct.",
    platform: "Blog",
    format: "blog article",
    brandName: "Apex Cloud AI",
    date: "Oct 12, 2026",
    status: "Approved",
    wordCount: 1450
  }
];

export const ANALYTICS_METRICS = {
  overview: {
    totalReach: "482.5K",
    reachTrend: "+18.4% vs last month",
    impressions: "1.28M",
    impressionsTrend: "+24.1% vs last month",
    avgEngagementRate: "5.82%",
    engagementTrend: "+0.9% vs benchmark",
    totalShares: "18.4K",
    sharesTrend: "+31.2% vs last month"
  },
  bestPerforming: [
    {
      title: "Torched Salmon Roll Hook (TikTok)",
      reach: "184.2K",
      engagement: "9.4%",
      conversions: "342 bookings",
      platform: "TikTok",
      brand: "Sakura Japanese Bistro"
    },
    {
      title: "Clean Barrier Ceramide Routine (IG)",
      reach: "98.1K",
      engagement: "6.8%",
      conversions: "188 orders",
      platform: "Instagram",
      brand: "Star Skin Care"
    },
    {
      title: "Senior to EM Leadership Lessons (LinkedIn)",
      reach: "76.4K",
      engagement: "7.2%",
      conversions: "89 inquiries",
      platform: "LinkedIn",
      brand: "Apex Cloud AI"
    }
  ],
  platformBreakdown: [
    { platform: "TikTok", share: 44, color: "#000000" },
    { platform: "Instagram", share: 29, color: "#e11d48" },
    { platform: "LinkedIn", share: 17, color: "#0077b5" },
    { platform: "X", share: 10, color: "#0f172a" }
  ]
};
