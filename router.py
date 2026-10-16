import re
import logging
from models import ContentType, RouterDecision

logger = logging.getLogger("PlatformSelector")


def clean_topic_string(user_request: str) -> str:
    """Strips command boilerplate from request to extract the genuine topic."""
    cleaned = re.sub(
        r"^(i want to|can you|please|help me)?\s*(create|write|generate|make|give me|draft)\s+(an|a)?\s*(viral|aesthetic|engaging|quick|short)?\s*(\d+\s*sec(ond)?|\d+\s*min(ute)?)?\s*(tiktok|video|script|x post|tweet|thread|linkedin post|instagram post|ig post|insta post|carousel|blog|ad copy|post|content)?\s*(about|for|on)?\s*",
        "",
        user_request,
        flags=re.IGNORECASE,
    ).strip()
    return cleaned.capitalize() if cleaned else user_request


def choose_platform(user_request: str) -> ContentType:
    """Selects the target platform using simple if/else keyword matching.
    
    Zero token cost: No system prompts, no LLM calls.
    Only chooses the platform based on the user's prompt.
    """
    req = user_request.lower()

    # 1. TikTok Script
    if any(k in req for k in ["tiktok", "reel", "shorts", "script", "video hook", "camera"]):
        return ContentType.TIKTOK_SCRIPT

    # 2. Instagram Post
    elif any(k in req for k in ["instagram", "ig post", "ig", "insta", "carousel", "photo caption", "ig caption"]):
        return ContentType.INSTAGRAM_POST

    # 3. X (Twitter) Post
    elif any(k in req for k in ["x post", "tweet", "thread", "twitter", "280"]):
        return ContentType.X_POST

    # 4. LinkedIn Post
    elif any(k in req for k in ["linkedin", "career", "professional", "b2b", "leadership", "workplace"]):
        return ContentType.LINKEDIN_POST

    # 5. Ad Copy
    elif any(k in req for k in ["ad", "sale", "pitch", "promo", "sponsor", "landing page", "convert", "discount"]):
        return ContentType.AD_COPY

    # 6. Blog
    elif any(k in req for k in ["blog", "article", "guide", "tutorial", "deep dive", "essay", "in-depth"]):
        return ContentType.BLOG

    # Default fallback
    else:
        return ContentType.TIKTOK_SCRIPT


def route_user_request(user_request: str) -> RouterDecision:
    """Chooses platform and extracts topic via if/else rules (no system prompt, zero LLM tokens)."""
    platform = choose_platform(user_request)
    topic = clean_topic_string(user_request)

    return RouterDecision(
        content_type=platform,
        topic=topic,
        target_audience="Target audience",
        tone="Engaging",
        key_points=[f"Highlight key value of: {topic}"],
        reasoning=f"Selected {platform.value} via if/else keyword check (zero token cost).",
        confidence_score=1.0,
    )
