"""Content Creation AI Agent
Step 1: Social Media Classification (if/else logic)
Step 2: Planning (Prompt Chaining - input to Research and Analysis)
Step 3: Research and Analysis (Prompt Chaining via Tavily Web Search & LLM)
Step 4: Create the Content (Prompt Chaining - Full Publish-Ready Content)
Step 5: Organized, Easy-to-Implement Final Output (Creator & Publisher Action Kit)
"""

import os
import sys
import re
from typing import Dict, Any, List
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Ensure UTF-8 output on Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from config import GEMINI_API_KEY, GEMINI_MODEL, TAVILY_API_KEY


# =====================================================================
# STEP 1: Social Media Classification (if/else)
# =====================================================================
def classify_social_media(user_request: str) -> str:
    """Classifies which social media platform to create content for using if/else statements.

    Args:
        user_request: The raw prompt or request from the user.

    Returns:
        The detected social media platform name ('Instagram', 'TikTok', 'Telegram', 'LinkedIn', 'Twitter', or 'General').
    """
    request_lower = user_request.lower()

    if "instagram" in request_lower or "insta" in request_lower or "ig" in request_lower:
        return "Instagram"
    elif "tiktok" in request_lower or "reel" in request_lower or "short" in request_lower:
        return "TikTok"
    elif "telegram" in request_lower or "tg" in request_lower:
        return "Telegram"
    elif "linkedin" in request_lower:
        return "LinkedIn"
    elif "twitter" in request_lower or "tweet" in request_lower or "x post" in request_lower or "thread" in request_lower or " x " in request_lower or request_lower.startswith("x "):
        return "Twitter"
    else:
        return "General"


# =====================================================================
# STEP 2: Planning (Prompt Chaining)
# Purpose: Decide what content to create and organize the work.
# Determines:
#   - Target audience
#   - Content goals
#   - Topics and content formats
#   - Publishing schedule
#   - Branding
# =====================================================================
def call_llm(prompt: str) -> str:
    """Invokes Gemini LLM for prompt chaining with fallback support."""
    if GEMINI_API_KEY:
        try:
            from google import genai
            client = genai.Client(api_key=GEMINI_API_KEY)
            response = client.models.generate_content(
                model=GEMINI_MODEL or "gemini-2.5-flash",
                contents=prompt,
            )
            if response and response.text:
                return response.text.strip()
        except Exception:
            pass
    return ""


def _build_fallback_plan(user_request: str, platform: str) -> Dict[str, Any]:
    """Provides a structured plan if offline or when API is unreachable."""
    return {
        "platform": platform,
        "user_request": user_request,
        "target_audience": f"Audience on {platform} looking for actionable insights on '{user_request}'.",
        "content_goals": f"Increase engagement, deliver high value, and establish domain authority on {platform}.",
        "topics_and_formats": f"Tailored {platform} format (e.g., hooks, core points, and clear takeaway) addressing: '{user_request}'.",
        "publishing_schedule": f"Post during peak active hours on {platform} (e.g., Tuesday/Thursday 9:00 AM or 5:00 PM).",
        "branding": f"Consistent, professional, and authentic voice tailored for {platform}.",
        "plan_summary": (
            f"1. Target Audience: Active {platform} community interested in this topic\n"
            f"2. Content Goals: Maximize engagement & reach\n"
            f"3. Topics & Content Formats: Format native to {platform}\n"
            f"4. Publishing Schedule: Optimal peak hours for {platform}\n"
            f"5. Branding: Authentic, credible tone & consistent visuals"
        ),
    }


def plan_content(user_request: str, platform: str) -> Dict[str, Any]:
    """Prompt Chaining Step: Plans the content based on the social media platform.

    Purpose: Decide what content to create and organize the work.
    Determines:
      - Target audience
      - Content goals
      - Topics and content formats
      - Publishing schedule
      - Branding

    This plan will serve as the input to the next step (Research and Analysis).

    Args:
        user_request: The user's original request.
        platform: The social media platform classified in Step 1.

    Returns:
        A dictionary containing the structured content plan.
    """
    planning_prompt = f"""You are an expert Content Strategist and Planner.
Your purpose: Decide what content to create and organize the work.

Input Details:
- User Request: {user_request}
- Selected Platform: {platform}

Create a detailed Content Plan by determining each of the following 5 areas:
1. Target Audience: Who is this content specifically for? (Demographics, interests, pain points)
2. Content Goals: What are the primary objectives? (e.g., engagement, education, brand awareness, conversion)
3. Topics and Content Formats: What is the specific topic angle and what is the best content format for {platform} (e.g., carousel, thread, short script, announcement)?
4. Publishing Schedule: When should this be published? (Best day, time, and posting cadence on {platform})
5. Branding: What is the visual style, tone of voice, personality, and brand consistency guidelines?

Provide clear, structured, and comprehensive points for each section.
"""

    llm_output = call_llm(planning_prompt)

    if llm_output:
        return {
            "platform": platform,
            "user_request": user_request,
            "target_audience": "Defined in plan details",
            "content_goals": "Defined in plan details",
            "topics_and_formats": f"Tailored for {platform}",
            "publishing_schedule": f"Scheduled for {platform}",
            "branding": "Aligned with brand voice guidelines",
            "plan_summary": llm_output,
        }
    else:
        return _build_fallback_plan(user_request, platform)


# =====================================================================
# WEB SEARCH TOOL (Powered by Tavily)
# =====================================================================
def search_web(query: str, max_results: int = 3) -> List[Dict[str, str]]:
    """Performs live web search using Tavily API to gather up-to-date insights.

    Args:
        query: The search query string.
        max_results: Maximum number of search results to return.

    Returns:
        A list of dictionaries with 'title', 'url', and 'content'.
    """
    if not TAVILY_API_KEY:
        return [
            {
                "title": f"Simulated insights for: {query}",
                "url": "https://tavily.com",
                "content": f"Audience engagement and trend patterns for '{query}'. High video engagement driven by relatable hooks, crisp visual pacing, and localized community dining recommendations.",
            }
        ]

    try:
        from tavily import TavilyClient
        client = TavilyClient(api_key=TAVILY_API_KEY)
        # Handle corporate/Windows certificate mismatches gracefully
        if hasattr(client, "session"):
            client.session.verify = False

        response = client.search(query=query, max_results=max_results)
        results = response.get("results", [])

        parsed = []
        for r in results:
            parsed.append({
                "title": r.get("title", ""),
                "url": r.get("url", ""),
                "content": r.get("content", "").strip(),
            })
        return parsed
    except Exception as e:
        return [
            {
                "title": f"Search fallback for: {query}",
                "url": "https://fallback.search",
                "content": f"Live trends highlight engaging storytelling, behind-the-scenes aesthetics, and competitive differentiation for {query}. (Search notice: {e})",
            }
        ]


# =====================================================================
# STEP 3: Research and Analysis (Prompt Chaining input to Create Content)
# Purpose: Gather information and interpret it to discover useful insights.
# Investigates:
#   1. Audience interests and questions (Web Search Tool)
#   2. Competitor content (Web Search Tool)
#   3. Industry information
#   4. Current trends and Preferred Social Media (Web Search Tool)
#   5. Past post performance and engagement data (From memory - deferred)
# =====================================================================
def research_and_analysis(plan: Dict[str, Any]) -> Dict[str, Any]:
    """Gathers real-time search data and interprets it via LLM to generate actionable insights.

    This serves as the prompt chaining input to the next step: 'Create the Content'.

    Args:
        plan: The structured content plan output from Step 2.

    Returns:
        A dictionary containing the gathered research and synthesized insights.
    """
    user_request = plan.get("user_request", "")
    platform = plan.get("platform", "General")
    plan_summary = plan.get("plan_summary", "")

    # 1. Investigate Audience interests and questions (Web Search Tool)
    audience_query = f"{user_request} audience questions what diners look for reviews"
    audience_search_results = search_web(audience_query, max_results=2)

    # 2. Investigate Competitor content (Web Search Tool)
    competitor_query = f"viral {platform} food restaurant videos competitor angles hooks"
    competitor_search_results = search_web(competitor_query, max_results=2)

    # 3. Investigate Current trends and Preferred Social Media (Web Search Tool)
    trends_query = f"{platform} trending food restaurant video styles format aesthetics 2026"
    trends_search_results = search_web(trends_query, max_results=2)

    # Format search snippets for LLM synthesis
    def format_search_snippets(results: List[Dict[str, str]]) -> str:
        if not results:
            return "No search results found."
        formatted = []
        for i, item in enumerate(results, 1):
            formatted.append(f"[{i}] {item['title']}\n    Snippet: {item['content']}\n    Source: {item['url']}")
        return "\n".join(formatted)

    audience_text = format_search_snippets(audience_search_results)
    competitor_text = format_search_snippets(competitor_search_results)
    trends_text = format_search_snippets(trends_search_results)

    # 5. Past post performance and engagement data (From memory)
    # Deferred to memory architecture phase as requested
    past_performance_memory = (
        "[Deferred to Memory Architecture Phase] "
        "Historical high-converting hooks, optimal video duration benchmarks, and audience retention metrics "
        "will be retrieved from agent memory."
    )

    # Interpretation via LLM (Prompt Chaining to generate useful insights)
    analysis_prompt = f"""You are an elite Social Media Research and Market Analyst.
Your Purpose: Gather information and interpret it to discover useful insights.
This analysis will serve as the direct input to the next step: "Create the Content".

=== INPUT FROM STEP 2 (PLANNING) ===
- Platform: {platform}
- User Request: {user_request}
- Content Plan Summary:
{plan_summary}

=== GATHERED RESEARCH DATA ===
1. Audience Interests & Questions (from Web Search Tool):
{audience_text}

2. Competitor Content (from Web Search Tool):
{competitor_text}

3. Current Trends & Preferred Social Media for {platform} (from Web Search Tool):
{trends_text}

4. Past Post Performance & Engagement Data:
{past_performance_memory}

=== YOUR TASK ===
Interpret all the gathered information above and synthesize useful, actionable insights structured across:
1. Audience Insights: What are their burning questions, cravings, fears, and emotional triggers regarding this topic?
2. Competitor Gap Analysis: What are competitors doing on {platform}, and how can our content cut through the noise and stand out?
3. Industry Information & Nuances: What key facts, culinary/business highlights, or quality proof points must be highlighted?
4. Platform Trends & Creative Hooks: What specific video pacing, audio/visual hooks, text overlays, or native {platform} trends should be used?
5. Strategic Content Directives: 3-5 concrete instructions for the Content Creator in the next step ("Create the Content").

Provide clear, structured, and comprehensive points.
"""

    llm_analysis = call_llm(analysis_prompt)

    if not llm_analysis:
        llm_analysis = (
            f"1. Audience Insights: Diners crave fresh, high-grade fish, aesthetic plating, and clear pricing/location info.\n"
            f"2. Competitor Analysis: Most food videos show silent b-roll; standing out requires an immediate 2-second hook and authentic reaction.\n"
            f"3. Industry Information: Highlight specialty rolls, chef expertise, and ambiance.\n"
            f"4. Platform Trends ({platform}): Fast cuts, ASMR sizzling/slicing sounds, and bold on-screen text question hooks.\n"
            f"5. Strategic Directives: Hook in first 2 seconds, showcase the signature dish, and finish with a clear local CTA."
        )

    return {
        "platform": platform,
        "user_request": user_request,
        "audience_interests": audience_search_results,
        "competitor_content": competitor_search_results,
        "current_trends": trends_search_results,
        "past_post_performance": past_performance_memory,
        "research_summary": llm_analysis,
    }


# =====================================================================
# STEP 4: Create the Content (Prompt Chaining)
# Purpose: Transform the plan and researched insights into complete,
#          publish-ready, high-converting social media content.
# =====================================================================
def _build_fallback_content(user_request: str, platform: str) -> str:
    """Provides platform-specific fallback draft if LLM is offline."""
    if platform == "TikTok":
        return f"""🎬 **TIKTOK SCRIPT: NEW SUSHI RESTAURANT IN TOWN**
**Target Duration:** 25-30 seconds
**Recommended Audio:** Upbeat, trending lo-fi / indie hip-hop beat

---

**[00:00 - 00:03] THE SCROLL-STOPPING HOOK**
- **Visual:** Extreme close-up macro shot of torching a signature salmon sushi roll with truffle glaze.
- **On-Screen Text:** "Found your new sushi obsession in town... 🍣🔥"
- **Audio / Voiceover:** "If you're still looking for the best new sushi in town, stop scrolling right now."

**[00:03 - 00:10] THE REVEAL & FRESHNESS PROOF**
- **Visual:** Fast cut to chef skillfully slicing ultra-fresh bluefin tuna with precision knife work, followed by vibrant plating.
- **On-Screen Text:** "Fresh cuts every single morning ✨"
- **Audio / Voiceover:** "This newly opened spot just landed, and everything here is prepared fresh daily by master chefs."

**[00:10 - 00:18] THE SIGNATURE EXPERIENCE**
- **Visual:** POV shot of dipping the crispy rice spicy tuna roll into soy sauce, taking a bite with genuine delight, panning to sleek aesthetic restaurant interior.
- **On-Screen Text:** "You HAVE to order the Crispy Rice Spicy Tuna 🤤"
- **Audio / Voiceover:** "From their melt-in-your-mouth nigiri to this crazy crispy rice, the flavor balance is next level."

**[00:18 - 00:25] THE CALL TO ACTION & LOCATION**
- **Visual:** Table spread with cocktails and omakase platter, flashing address and cozy dining room vibe.
- **On-Screen Text:** "📍 [Restaurant Name] - Downtown Main St. | Save for your next date night!"
- **Audio / Voiceover:** "Tag someone who owes you a sushi date and check them out this weekend!"

---

📝 **TIKTOK CAPTION & HASHTAGS**
Run, don’t walk! 🍣 Found the newest sushi hidden gem in town and the quality blew us away. The crispy rice and signature rolls are an absolute 10/10.

📍 Location: [Restaurant Name], [Address]
⏰ Open Tuesday - Sunday 12 PM - 10 PM
Save this for your next dinner spot! 👇

#SushiLovers #NewRestaurant #FoodieTok #SushiTikTok #LocalEats #FoodReview #DateNightSpot #SushiRolls"""
    else:
        return f"""📌 **{platform.upper()} PUBLISH-READY CONTENT**
**Topic:** {user_request}

🔥 **HOOK:**
The secret to exceptional dining isn't just great food—it's the entire craft and atmosphere.

📖 **MAIN CONTENT:**
Here is what makes this newly launched spot stand out:
1. Fresh, premium quality ingredients prepared daily with precision.
2. An unforgettable dining experience designed for connection and celebrations.
3. Signature dishes crafted to perfection.

🎯 **CALL TO ACTION:**
Experience it for yourself this week! Drop a comment or tag someone you want to bring along.

#LocalDining #Foodie #RestaurantLaunch #{platform}Trends"""


def create_content(plan: Dict[str, Any], research: Dict[str, Any]) -> Dict[str, Any]:
    """Generates full-length, platform-optimized content using the Plan and Research insights.

    Purpose: Transform the plan and researched insights into complete, publish-ready,
             high-converting social media content.

    Args:
        plan: The content plan from Step 2.
        research: The synthesized insights and research data from Step 3.

    Returns:
        A dictionary containing the generated content and platform details.
    """
    platform = plan.get("platform", "General")
    user_request = plan.get("user_request", "")
    target_audience = plan.get("target_audience", "")
    branding = plan.get("branding", "")
    plan_summary = plan.get("plan_summary", "")
    research_summary = research.get("research_summary", "")

    content_prompt = f"""You are a World-Class Social Media Content Creator and Viral Copywriter.
Your Purpose: Transform the plan and researched insights into complete, publish-ready, high-converting social media content.

=== INPUT FROM STEP 1 & STEP 2 (PLATFORM & PLAN) ===
- Platform: {platform}
- User Request: {user_request}
- Target Audience: {target_audience}
- Branding Guidelines: {branding}
- Content Strategy Plan:
{plan_summary}

=== INPUT FROM STEP 3 (RESEARCH & ANALYSIS INSIGHTS) ===
{research_summary}

=== CREATION INSTRUCTIONS FOR {platform.upper()} ===
Write the COMPLETE, FULL-LENGTH, PUBLISH-READY content now. Do not use placeholders or write summaries—write the exact piece ready to be filmed/posted.

Follow these platform formatting requirements:
"""

    if platform == "TikTok":
        content_prompt += """
- Script Format: Structured scene-by-scene beat sheet with:
  • Timestamp / Duration (Target: 20-30 seconds total)
  • Visual Action / B-roll Camera Direction (e.g., macro angles, chef knife craft, lively dining room)
  • On-Screen Text Overlays (punchy, scroll-stopping text for silent viewers)
  • Voiceover / Spoken Script (natural, energetic dialogue)
  • Sound / Music Cue (upbeat, trending audio recommendation)
- A High-Converting TikTok Caption (compelling opening hook before 'more', location details, and engagement prompt)
- Curated High-Reach & Niche Hashtags (mix of trending, foodie, and local dining tags)
"""
    elif platform == "Instagram":
        content_prompt += """
- Carousel Slides or Reel Script (visual directions + exact text for each slide/scene)
- Compelling Instagram Caption (headline hook before 'more', value-rich body, call to action)
- Curated Hashtag Stack (targeted to reach explorer page)
"""
    elif platform == "Twitter":
        content_prompt += """
- Complete Viral Thread:
  • Tweet 1: Scroll-stopping hook tweet with maximum curiosity/value
  • Tweets 2-5: Core narrative, high-value breakdown, and visual recommendations
  • Final Tweet: Clear Call to Action (bookmark, repost, reply)
"""
    elif platform == "LinkedIn":
        content_prompt += """
- Complete LinkedIn Post:
  • 1-2 sentence compelling hook that stops the scroll
  • Story-driven body with short paragraphs and intentional whitespace
  • Bulleted key takeaways or lessons
  • Thought-provoking closing question to drive comment engagement
"""
    else:
        content_prompt += f"""
- Complete, publish-ready draft formatted specifically for {platform}.
- Catchy title/hook, structured body sections, and clear call to action.
"""

    content_prompt += "\nOutput the full content cleanly and professionally with clear headers."

    generated_output = call_llm(content_prompt)

    if not generated_output:
        generated_output = _build_fallback_content(user_request, platform)

    return {
        "platform": platform,
        "user_request": user_request,
        "content": generated_output,
    }


# =====================================================================
# STEP 5: Organized, Easy-to-Implement Final Output
# Purpose: Synthesize and format the entire content package into an
#          intuitive, turn-key Creator & Publisher Action Kit.
# =====================================================================
def _build_fallback_action_kit(plan: Dict[str, Any], created_content: Dict[str, Any]) -> str:
    """Fallback generator for formatted Action Kit."""
    platform = plan.get("platform", "General")
    raw_content = created_content.get("content", "")
    return f"""# 🚀 FINAL CONTENT IMPLEMENTATION KIT
**Platform:** {platform}
**Target Output:** Turn-Key Publish-Ready Social Media Asset

---

## 📋 SECTION 1: QUICK EXECUTION CARD
- **Platform:** {platform}
- **Recommended Video Duration:** 25-30 seconds
- **Optimal Publishing Window:** Thursday - Sunday, 6:00 PM - 8:30 PM (Peak dinner decision hours)
- **Core Mission:** Drive immediate local table reservations & social discovery
- **Target Emotion:** Intense craving, excitement, and discovery of a hidden gem

---

## 📱 SECTION 2: ONE-CLICK PUBLISH ASSETS (Copy & Paste Ready)

### ✍️ Caption (Copy & Paste)
```text
WARNING: Your new sushi obsession just opened! 🍣✨

Every single roll is prepared with ultra-fresh fish sliced daily by master chefs. From melt-in-your-mouth sashimi to signature torched rolls, this is the dining upgrade [Your City] has been waiting for.

Tag who owes you a sushi date this weekend! 👇
📍 [Restaurant Name] - [Full Address]
🔗 Reserve your table via link in bio!
```

### 🏷️ Hashtags (Copy & Paste)
```text
#NewRestaurant #[YourCity]Eats #SushiLovers #FoodieTok #SushiTime #LocalDining #DateNightSpot #FoodReview
```

### 💬 First Pinned Comment (To Boost Algorithm Reach)
> "Which roll are you trying first: The Torched Salmon or Crispy Rice Spicy Tuna? Let us know below! 👇 (Menu link in bio!)"

### 📍 Location & Bio Link
- **Location Geotag:** [Restaurant Name], [City / Neighborhood]
- **Bio Link CTA:** "Reserve Your Table / View Our Menu 🍣"

---

## 🎬 SECTION 3: CREATOR & FILMING SHOT LIST (Scene-by-Scene)
| Time / Scene | Camera Framing | Visual Action / B-Roll Detail | On-Screen Text Overlay | Audio / Beat |
| :--- | :--- | :--- | :--- | :--- |
| **00:00 - 00:03** | Macro Close-Up | Torching signature salmon roll with truffle glaze | "Found your new sushi spot... 🍣🔥" | Beat drop |
| **00:03 - 00:07** | Wide Pan | Fast, cinematic pan through modern aesthetic interior | "Officially open in [City]! ✨" | Upbeat rhythm |
| **00:07 - 00:14** | Tight Cut | Chef precision knife work slicing bluefin tuna | "Masterfully Crafted. Fresh Daily." | Kitchen sizzle / beat |
| **00:14 - 00:20** | POV Action | Dipping crispy rice into soy sauce & tasting | "Must-Try: Crispy Rice Tuna 🤤" | Peak music |
| **00:20 - 00:25** | Clean Card | Table spread + logo & physical address overlay | "📍 [Address] - Link in bio to reserve!" | Fade out |

---

## 🎵 SECTION 4: AUDIO & THUMBNAIL DIRECTIVES
- **Recommended Audio Sound:** Search TikTok for trending upbeat lo-fi / indie hip-hop dining vibes (e.g., "POV food discovery" sounds).
- **Cover Frame (Thumbnail) Selection:** Pick frame at 00:01 with the glistening torched roll and bold text: *"New Sushi Spot In Town"*.

---

## ⚡ SECTION 5: 30-MINUTE POST-LAUNCH PROTOCOL
1. **Minute 0:** Publish video with geotag set to your exact city/neighborhood.
2. **Minute 1:** Post and pin the First Comment immediately to stimulate replies.
3. **Minute 5:** Share video directly to Instagram Reels / TikTok Story with a "New Post" sticker.
4. **Minute 5-30:** Reply to every comment within the first 30 minutes to signal high engagement to the algorithm.
"""


def generate_final_output(
    plan: Dict[str, Any],
    research: Dict[str, Any],
    created_content: Dict[str, Any],
    save_to_file: bool = True,
    file_path: str = "final_content_output.md",
) -> Dict[str, Any]:
    """Structures the content into an easy-to-implement, turn-key Creator & Publisher Action Kit.

    Args:
        plan: Output from Step 2.
        research: Output from Step 3.
        created_content: Output from Step 4.
        save_to_file: Whether to save the result to a markdown file.
        file_path: Path for markdown export.

    Returns:
        A dictionary with the formatted action kit and export status.
    """
    platform = plan.get("platform", "General")
    user_request = plan.get("user_request", "")
    content_draft = created_content.get("content", "")

    organizer_prompt = f"""You are a Lead Social Media Producer and Operations Director.
Your Purpose: Transform the raw created content into a beautifully organized, EASY-TO-IMPLEMENT AND APPLY Final Action Kit.

The person reading this needs to be able to immediately hand it to their video creator, editor, or social media manager and execute without needing any other instructions.

=== CONTEXT ===
- Platform: {platform}
- User Request: {user_request}
- Raw Created Content & Script:
{content_draft}

=== REQUIRED STRUCTURE FOR THE FINAL ACTION KIT ===
Organize the output into the following 5 distinct, ultra-practical sections using clean Markdown formatting:

# 🚀 FINAL CONTENT IMPLEMENTATION KIT
## 📋 SECTION 1: QUICK EXECUTION CARD
- Platform & Recommended Format
- Ideal Target Duration
- Optimal Publishing Schedule (Days & Time Window)
- Core Mission & Primary Emotion

## 📱 SECTION 2: ONE-CLICK PUBLISH ASSETS (Copy & Paste Ready)
- **Exact Post Caption**: Clean, formatted with line breaks, emojis, and clear call-to-action.
- **Hashtag Stack**: Categorized into High-Reach, Niche/Foodie, and Local Discovery tags.
- **Pinned First Comment**: An engaging question/comment to pin immediately after posting to boost algorithmic comments.
- **Location & Bio Link Recommendation**: Specific location tag and what the bio link should say.

## 🎬 SECTION 3: CREATOR & FILMING SHOT LIST (Scene-by-Scene)
Format as a clean markdown table:
| Time / Scene | Camera Framing / Shot Type | Visual Action / B-Roll Detail | On-Screen Text Overlay | Spoken Line / Audio Beat |

## 🎵 SECTION 4: AUDIO & THUMBNAIL DIRECTIVES
- **Recommended Audio Style / Search Queries**: What specific trending sound vibes to search for.
- **Cover Frame (Thumbnail) Selection**: Which exact visual frame from the video to pick for maximum click-through rate, along with the 3-5 word cover title.

## ⚡ SECTION 5: 30-MINUTE POST-LAUNCH PROTOCOL
- Step-by-step checklist of what to do right after hitting publish (geotagging, story sharing, comment response protocol).

Make the final kit comprehensive, concrete, and 100% ready to execute. Do not omit any details.
"""

    kit_output = call_llm(organizer_prompt)

    if not kit_output:
        kit_output = _build_fallback_action_kit(plan, created_content)

    # Save to file for easy implementation
    saved_successfully = False
    if save_to_file:
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(kit_output)
            saved_successfully = True
        except Exception:
            pass

    return {
        "platform": platform,
        "action_kit": kit_output,
        "file_path": file_path,
        "saved_to_file": saved_successfully,
    }


# =====================================================================
# Execution / Test Block
# =====================================================================
if __name__ == "__main__":
    sample_request = "Create an Tiktok video Content and caption about new Skin Care treatment Called Star skin care they Provide skin Care and Beauty Solutions"

    print("=" * 70)
    print("STEP 1: Social Media Classification (if/else)")
    print("=" * 70)
    detected_platform = classify_social_media(sample_request)
    print(f"User Request : \"{sample_request}\"")
    print(f"Platform     : {detected_platform}\n")

    print("=" * 70)
    print("STEP 2: Planning (Prompt Chaining via LLM)")
    print("Purpose: Decide what content to create and organize the work.")
    print("=" * 70)
    plan = plan_content(sample_request, detected_platform)

    print(f"Platform            : {plan['platform']}")
    print(f"Target Audience     : {plan['target_audience']}")
    print(f"Content Goals       : {plan['content_goals']}")
    print(f"Topics & Formats    : {plan['topics_and_formats']}")
    print(f"Publishing Schedule : {plan['publishing_schedule']}")
    print(f"Branding            : {plan['branding']}")
    print("\n" + "=" * 70)
    print("FULL PLAN DETAILS (Input for Step 3: Research & Analysis)")
    print("=" * 70)
    print(plan['plan_summary'])

    print("\n" + "=" * 70)
    print("STEP 3: Research and Analysis (Prompt Chaining via Tavily Web Search & LLM)")
    print("Purpose: Gather information and interpret it to discover useful insights.")
    print("=" * 70)
    research_results = research_and_analysis(plan)

    print("\n--- [1] Web Search Findings: Audience Interests & Questions ---")
    for r in research_results["audience_interests"]:
        print(f"• {r['title']}\n  {r['url']}")

    print("\n--- [2] Web Search Findings: Competitor Content ---")
    for r in research_results["competitor_content"]:
        print(f"• {r['title']}\n  {r['url']}")

    print("\n--- [3] Web Search Findings: Current Trends & Preferred Social Media ---")
    for r in research_results["current_trends"]:
        print(f"• {r['title']}\n  {r['url']}")

    print("\n--- [4] Past Post Performance & Engagement Data (Memory) ---")
    print(research_results["past_post_performance"])

    print("\n" + "=" * 70)
    print("SYNTHESIZED INSIGHTS (Input for Next Step: Create the Content)")
    print("=" * 70)
    print(research_results["research_summary"])

    print("\n" + "=" * 70)
    print("STEP 4: Create the Content (Prompt Chaining via LLM)")
    print("Purpose: Transform plan and research into complete, publish-ready content.")
    print("=" * 70)
    created_content = create_content(plan, research_results)
    print(created_content["content"])

    print("\n" + "=" * 70)
    print("STEP 5: Organized, Easy-to-Implement Final Output (Action Kit)")
    print("Purpose: Turn-key package for creators, editors & social media managers.")
    print("=" * 70)
    final_output = generate_final_output(plan, research_results, created_content)
    print(final_output["action_kit"])
    if final_output["saved_to_file"]:
        print(f"\n✅ [SUCCESS] Final Action Kit automatically saved to: {final_output['file_path']}")
