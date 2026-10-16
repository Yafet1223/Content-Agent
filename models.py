from enum import Enum
from typing import List, Optional, Dict, Any
from typing_extensions import TypedDict
from pydantic import BaseModel, Field


class ContentType(str, Enum):
    TIKTOK_SCRIPT = "TikTok Script"
    X_POST = "X Post"
    LINKEDIN_POST = "LinkedIn Post"
    INSTAGRAM_POST = "Instagram Post"
    BLOG = "Blog"
    AD_COPY = "Ad Copy"


class RouterDecision(BaseModel):
    """Structured decision output from the Prompt Router."""
    content_type: ContentType = Field(
        description="The selected content type: 'TikTok Script', 'X Post', 'LinkedIn Post', 'Blog', or 'Ad Copy'."
    )
    topic: str = Field(
        description="The extracted core topic or subject matter of the request."
    )
    target_audience: str = Field(
        description="The primary audience for this piece of content."
    )
    tone: str = Field(
        description="The recommended tone of voice (e.g., energetic, conversational, professional, persuasive, informative)."
    )
    key_points: List[str] = Field(
        default_factory=list,
        description="Key angles or bullets that must be covered in the content."
    )
    reasoning: str = Field(
        description="Brief explanation of why this specific content type and strategy was chosen."
    )
    confidence_score: float = Field(
        default=1.0,
        ge=0.0,
        le=1.0,
        description="Confidence score in this routing decision (0.0 to 1.0)."
    )


class AgentState(TypedDict):
    """The shared state passed through the LangGraph workflow."""
    user_request: str
    content_type: Optional[str]
    topic: Optional[str]
    target_audience: Optional[str]
    tone: Optional[str]
    key_points: Optional[List[str]]
    reasoning: Optional[str]
    confidence_score: Optional[float]
    router_decision: Optional[Dict[str, Any]]
    format_guidelines: Optional[str]
    
    # Prompt Chain Outputs
    research_ideas: Optional[str]
    outline: Optional[str]
    draft: Optional[str]
    review_notes: Optional[str]
    final_content: Optional[str]
    
    current_step: Optional[str]
    status: Optional[str]
