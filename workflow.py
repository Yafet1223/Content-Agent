"""Content Creation AI Agent
Step 1: Social Media Classification (if/else logic)
Step 2: Planning (Prompt Chaining - input to Research and Analysis)
"""

import os
import sys
import re
from typing import Dict, Any

# Ensure UTF-8 output on Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from config import GEMINI_API_KEY, GEMINI_MODEL


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
# Execution / Test Block
# =====================================================================
if __name__ == "__main__":
    sample_request = "Create an Instagram carousel and caption about coffee brewing tips"

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
