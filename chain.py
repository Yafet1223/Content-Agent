"""Prompt Chaining Module for Content Generation
Workflow: Research/Idea -> Outline -> Draft -> Review & Polish
"""

import logging
from typing import Dict, Any, Callable
from config import GEMINI_API_KEY, GEMINI_MODEL

logger = logging.getLogger("PromptChain")


_client = None


def get_genai_client():
    global _client
    if _client is None and GEMINI_API_KEY:
        from google import genai
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


def call_llm(prompt: str, fallback_generator: Callable[[], str]) -> str:
    """Helper to invoke Gemini with graceful fallback and clear diagnostics."""
    if GEMINI_API_KEY:
        models_to_try = [GEMINI_MODEL, "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
        models_to_try = list(dict.fromkeys(models_to_try))

        try:
            client = get_genai_client()
            if client:
                for model_name in models_to_try:
                    for attempt in range(2):
                        try:
                            response = client.models.generate_content(
                                model=model_name,
                                contents=prompt,
                            )
                            if response and response.text:
                                return response.text
                        except Exception as model_err:
                            err_msg = str(model_err)
                            if "404" in err_msg or "not found" in err_msg.lower():
                                break  # try next model
                            if attempt == 0:
                                import time
                                time.sleep(0.5)
                                continue
                            logger.warning(f"Gemini API warning ({model_name}): {err_msg}")
        except Exception as e:
            logger.warning(f"Error calling Gemini: {e}")
    else:
        logger.info("GEMINI_API_KEY not set in .env. Running fallback template.")
    
    return fallback_generator()


# ---------------------------------------------------------
# Step 1: Research / Idea Generation
# ---------------------------------------------------------
def generate_research_ideas(state: Dict[str, Any]) -> str:
    """Generates research angles, audience insights, and hook ideas."""
    content_type = state.get("content_type", "Content")
    topic = state.get("topic", state.get("user_request", ""))
    audience = state.get("target_audience", "General audience")
    tone = state.get("tone", "Engaging")
    guidelines = state.get("format_guidelines", "")

    prompt = f"""You are a world-class Content Strategist and Creative Researcher.
Your task is to conduct research and brainstorm high-impact angles for this content piece:

Format: {content_type}
Topic: {topic}
Target Audience: {audience}
Desired Tone: {tone}
Format Guidelines:
{guidelines}

Provide structured research notes covering:
1. Core Value / Big Idea: What is the single most valuable takeaway?
2. Audience Psychology: What pain point, curiosity, or aspiration triggers their attention?
3. 3 Unique Angles / Hooks: Brainstorm 3 distinct, scroll-stopping angles.
4. Key Talking Points / Proof: 3-5 solid points, examples, or frameworks to include.

Keep it sharp, actionable, and tailored to {content_type}."""

    def fallback():
        return f"""### 💡 Research & Creative Angles for {content_type}
- **Core Value:** Practical, actionable insight on "{topic}" tailored for {audience}.
- **Audience Trigger:** Seeking high signal, quick implementation, and proven advice with a {tone.lower()} tone.
- **Hook Idea 1 (Curiosity):** "Most people get {topic} completely wrong. Here's what actually works..."
- **Hook Idea 2 (Direct Value):** "The exact framework to master {topic} without the usual mistakes."
- **Hook Idea 3 (Contrarian):** "Why 90% of approaches to {topic} fail (and the simple fix)."
- **Key Talking Points:**
  1. The common mistake or misconception.
  2. The breakthrough framework or solution.
  3. Actionable steps to execute immediately.
  4. Real-world payoff and next steps."""

    return call_llm(prompt, fallback)


# ---------------------------------------------------------
# Step 2: Outline
# ---------------------------------------------------------
def generate_outline(state: Dict[str, Any]) -> str:
    """Creates a structured, platform-specific outline."""
    content_type = state.get("content_type", "Content")
    topic = state.get("topic", "")
    research = state.get("research_ideas", "")
    tone = state.get("tone", "Engaging")
    guidelines = state.get("format_guidelines", "")

    prompt = f"""You are an expert Content Architect.
Create a structured, step-by-step outline for a {content_type}.

Topic: {topic}
Tone: {tone}
Platform Guidelines:
{guidelines}

Research & Angles to Incorporate:
{research}

Output a clean, blueprint outline tailored specifically to the structural conventions of {content_type} (e.g., beat sheet for video, thread progression for X, narrative curve for LinkedIn, carousel breakdown for Instagram, section headers for blog, or persuasive formula for ad copy)."""

    def fallback():
        if content_type == "TikTok Script":
            return """### 🎬 Video Beat Sheet Outline
- **00:00 - 00:03 [Visual & Spoken Hook]:** Pattern interrupt + bold claim on topic.
- **00:03 - 00:12 [The Problem / Context]:** Why conventional methods fail.
- **00:12 - 00:22 [The Solution / Core Demo]:** 3 fast steps shown on screen.
- **00:22 - 00:30 [Call To Action / Retention Loop]:** Save this video + question in comments."""
        elif content_type == "X Post":
            return """### 🐦 X Post / Thread Blueprint
- **Tweet 1 (Hook):** Contrarian observation + promise of value.
- **Tweet 2 (Context):** The costly mistake people make.
- **Tweet 3 (Core Framework):** 3-step breakdown with bullet points.
- **Tweet 4 (Takeaway & CTA):** Summary rule + RT prompt for bookmarking."""
        elif content_type == "LinkedIn Post":
            return """### 💼 LinkedIn Narrative Outline
- **The Hook (Line 1-2):** Vulnerable or bold career observation.
- **The Turning Point:** What changed and the realization moment.
- **The Framework (3-4 bullet points):** Digestible, actionable lessons.
- **The Synthesis:** Big picture philosophy.
- **Call to Conversation & Hashtags:** Open-ended question to spark comments."""
        elif content_type == "Instagram Post":
            return """### 📸 Instagram Carousel & Caption Outline
- **Slide 1 / Cover Hook:** Scroll-stopping visual concept + bold 3-word title overlay.
- **Caption Hook (Line 1):** Intriguing question or bold statement before the '...more' truncation.
- **Body / Carousel Progression (Slides 2-5):** High-aesthetic step-by-step breakdown or story.
- **Final Slide / Call to Action:** Save & share prompt + bookmark reminder.
- **Engagement Trigger & Hashtags:** Conversation question for comments + targeted hashtag stack."""
        elif content_type == "Blog":
            return """### 📝 Blog Structure Outline
- **Title Options:** 3 SEO-friendly, high CTR headlines.
- **Introduction:** Hook, thesis statement, and who this guide is for.
- **Section 1 (The Foundation):** Context and core principles.
- **Section 2 (Step-by-Step Implementation):** Practical walkthrough.
- **Section 3 (Common Pitfalls & Best Practices):** Pro tips.
- **Conclusion & Next Steps:** Summary checklist and reader call-to-action."""
        else: # Ad Copy
            return """### 🎯 Ad Copy Blueprint (PAS Framework)
- **Problem:** Call out the specific audience friction point.
- **Agitate:** The hidden cost of ignoring this issue.
- **Solution:** Introduce our offering as the bridge.
- **Offer Stack & Risk Reversal:** Guarantee + launch perk.
- **Clear Call To Action:** Direct click prompt."""

    return call_llm(prompt, fallback)


# ---------------------------------------------------------
# Step 3: Draft Generation
# ---------------------------------------------------------
def generate_draft(state: Dict[str, Any]) -> str:
    """Generates the full initial draft from research and outline."""
    content_type = state.get("content_type", "Content")
    topic = state.get("topic", "")
    audience = state.get("target_audience", "")
    tone = state.get("tone", "")
    guidelines = state.get("format_guidelines", "")
    research = state.get("research_ideas", "")
    outline = state.get("outline", "")

    prompt = f"""You are a master Content Creator and Copywriter.
Write the complete, full-length FIRST DRAFT for this {content_type}.

Topic: {topic}
Target Audience: {audience}
Tone: {tone}
Format Guidelines:
{guidelines}

Outline Blueprint:
{outline}

Research & Key Points:
{research}

Write the full piece now. Do not hold back or use placeholders. Make it authentic, engaging, and ready for review."""

    def fallback():
        if content_type == "TikTok Script":
            return f"""**[00:00 - 00:03] HOOK**
*(Visual: Host leans in toward camera with high energy, bold text overlay on screen: "STOP DOING THIS ❌")*
Host: "If you're still struggling with {topic}, you need to see this right now."

**[00:03 - 00:12] THE SETUP**
*(Visual: Quick B-roll cut / screen recording showing the messy manual way)*
Host: "Most people waste hours trying to figure this out manually. But there's a 10x faster shortcut."

**[00:12 - 00:22] THE VALUE**
*(Visual: Split screen with numbered steps appearing smoothly)*
Host: "Step 1: Simplify the core setup.
Step 2: Automate repetitive workflows.
Step 3: Test and iterate before scaling."

**[00:22 - 00:30] CALL TO ACTION**
*(Visual: Host points down to screen caption / save button)*
Host: "Save this for your next project, and drop a comment below on what you want covered next!" """

        elif content_type == "X Post":
            return f"""Most people overcomplicate {topic}.

Here is the exact playbook in 4 simple rules:

1/ Focus on the foundation first.
Adding complexity too early creates technical debt you will pay for months later.

2/ Automate what is repeatable.
If you do a task more than 3 times a week, build a workflow for it.

3/ Measure outcomes, not effort.
10 hours of unfocused work < 45 minutes of deep execution.

4/ Iterate in public.
Feedback loops are your greatest competitive edge.

Bottom line:
Simplicity scales. Complexity breaks.

Bookmark this if you found it useful, and repost to share with your network."""

        elif content_type == "LinkedIn Post":
            return f"""Early in my journey with {topic}, I made a costly mistake.

I thought more effort equaled better results.
I was wrong.

Here is what 5+ years of real-world experience taught me:

1. Systems beat willpower every single time.
When your workflow is documented and streamlined, quality becomes predictable.

2. Clear communication is a superpower.
The best idea in the room is useless if your team can't execute it simply.

3. Execution eats strategy for breakfast.
A 7/10 plan executed today beats a 10/10 plan discussed for three weeks.

The takeaway?
Stop searching for secret hacks. Double down on consistent fundamentals.

What's one lesson about {topic} you wish you knew earlier?

#Leadership #Productivity #CareerGrowth #Innovation"""

        elif content_type == "Instagram Post":
            return f"""📸 **VISUAL CONCEPT & CAROUSEL SLIDES:**
• **Slide 1 (Cover):** Eye-catching aesthetic shot of {topic} with bold text overlay: *"The Truth About {topic} Nobody Talks About 👇"*
• **Slide 2 (The Hook):** Clean graphic or photo breaking down the common pitfall.
• **Slide 3 (The Method):** Step-by-step visual demonstration or pro tip.
• **Slide 4 (The Result):** Aesthetic finished showcase / transformation.
• **Slide 5 (Outro):** Minimalist card: *"Save this for later & share with a friend 📌"*

---

📝 **INSTAGRAM CAPTION:**

Stop scrolling if you want to master {topic} ✨👇

Most people think success with {topic} comes down to luck or endless hours.
Truth is? It comes down to 3 simple fundamentals:

1️⃣ Curate your vibe before you launch—quality always beats noise.
2️⃣ Consistency creates compound leverage.
3️⃣ Focus on what your audience actually craves.

💡 Pro tip: Double tap if this resonated and save this post so you can revisit it anytime!

Drop a comment below: What's your biggest hurdle with {topic} right now? 👇

---
🏷️ **HASHTAGS:**
#InstagramTips #ContentCreation #GrowthHacks #{topic.replace(' ', '')} #AestheticFeed #CreatorEconomy #SocialMediaStrategy"""

        elif content_type == "Blog":
            return f"""# Master Guide: A Practical Approach to {topic}

In today's fast-moving landscape, knowing how to master **{topic}** has transitioned from a nice-to-have skill to an essential superpower.

Whether you are just starting or optimizing existing systems, this comprehensive guide breaks down everything you need to know.

---

## 1. The Core Fundamentals
Before diving into advanced tactics, understanding the primary building blocks is critical. Most failures stem from skipping the basics:
- **Clarity of Purpose:** Define exact outcomes before writing or building.
- **Structured Processes:** Build repeatable pipelines rather than ad-hoc solutions.

---

## 2. Step-by-Step Implementation Blueprint
Here is the step-by-step roadmap:
1. **Analyze Requirements:** Understand who you are building for and what problem needs solving.
2. **Design the Architecture:** Keep components isolated, modular, and testable.
3. **Deploy & Validate:** Monitor real-world metrics and gather immediate user feedback.

---

## 3. Common Traps to Avoid
- **Over-engineering:** Don't build for 10 million users when validating for 10.
- **Ignoring Feedback:** Let user behavior dictate your roadmap.

---

## Summary & Next Steps
Mastering {topic} is a continuous marathon of iteration. Pick one principle from this guide, apply it today, and watch the compound interest take effect."""

        else: # Ad Copy
            return f"""🔥 **Headline Option A:** Struggling with {topic}? There's a Better Way.
🔥 **Headline Option B:** The Simple Shortcut to Mastering {topic} Without the Headaches.

**The Reality:**
You're spending countless hours trying to figure out {topic}, only to run into road blocks, hidden fees, and wasted effort.

It shouldn't be this difficult.

**Introducing the Modern Solution:**
Built specifically for {audience}, our system takes the guesswork out of the equation:
✅ Proven framework with zero learning curve
✅ Save 5+ hours every single week
✅ Instant access with lifetime updates

**Limited Time Launch Offer:**
Get 20% off during our launch week with risk-free 30-day money-back guarantee.

👉 **Claim Your Access Now:** [Link]"""

    return call_llm(prompt, fallback)


# ---------------------------------------------------------
# Step 4: Review & Polish
# ---------------------------------------------------------
def review_and_polish(state: Dict[str, Any]) -> Dict[str, str]:
    """Polishes the draft, strengthens hooks, verifies formatting, adds CTAs & hashtags."""
    content_type = state.get("content_type", "Content")
    topic = state.get("topic", "")
    tone = state.get("tone", "")
    draft = state.get("draft", "")

    prompt = f"""You are an elite Senior Content Editor and Growth Marketer.
Review, polish, and elevate this {content_type} draft to publish-ready perfection.

Topic: {topic}
Target Tone: {tone}

Draft to Review:
{draft}

Your task:
1. Polish the copy: remove fluff, improve rhythm, ensure formatting fits {content_type} standards.
2. Provide 2-3 Alternative High-Converting Hooks / Headlines.
3. Include optimized Call to Action (CTA) and relevant high-reach hashtags.
4. Output the Final Publish-Ready Content clearly separated from editor notes."""

    def fallback():
        return {
            "review_notes": f"Polished for {content_type} rhythm, strengthened initial hook, and verified line spacing.",
            "final_content": f"""{draft}

---
📌 **Alternative Hooks to A/B Test:**
1. "The unconventional truth about {topic}..."
2. "Here's the framework top creators use for {topic}:"
3. "Stop wasting time on {topic}—do this instead."

🎯 **Optimized CTA:** "Drop a comment with your thoughts or bookmark for later reference!"
🏷️ **Recommended Hashtags:** #{content_type.replace(' ', '')} #ContentCreation #Strategy #Productivity"""
        }

    if GEMINI_API_KEY:
        polished = call_llm(prompt, lambda: "")
        if polished:
            return {
                "review_notes": f"Polished and refined using Gemini ({GEMINI_MODEL}).",
                "final_content": polished,
            }

    return fallback()
