import sys
import os
from typing import Optional, Dict, Any
from pydantic import BaseModel

# Ensure UTF-8 output on Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Ensure Backend directory is first in sys.path to prevent collisions with parent main.py
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

import database
import workflow

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="ContentFlow AI - Backend API",
    description="Backend API powering the ContentFlow AI Content Creation Studio with Persistent Memory",
    version="1.1.0"
)

# Enable CORS for the React frontend (running on localhost:5173 or any origin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerateRequest(BaseModel):
    prompt: str
    platform: Optional[str] = None
    conversation_id: Optional[str] = None


class CreateConversationRequest(BaseModel):
    title: str
    platform: Optional[str] = "General"


@app.get("/")
def home():
    return {
        "message": "Hello, FastAPI!",
        "status": "online",
        "service": "ContentFlow AI Backend with Persistent Conversation Memory",
        "endpoints": {
            "health": "/health",
            "generate": "/api/generate",
            "conversations": "/api/conversations"
        }
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "agent_ready": True,
        "database_connected": True
    }


# =====================================================================
# PERSISTENT CONVERSATION MEMORY ENDPOINTS
# =====================================================================
@app.get("/api/conversations")
def list_conversations():
    """Lists all stored persistent conversations with summary metadata."""
    return {
        "success": True,
        "conversations": database.list_conversations()
    }


@app.post("/api/conversations")
def create_new_conversation(req: CreateConversationRequest):
    """Creates a new persistent conversation session."""
    conv = database.create_conversation(title=req.title, platform=req.platform or "General")
    return {
        "success": True,
        "conversation": conv
    }


@app.get("/api/conversations/{conversation_id}")
def get_conversation_details(conversation_id: str):
    """Retrieves full conversation history, previous messages, and context."""
    conv = database.get_conversation(conversation_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    return {
        "success": True,
        "conversation": conv
    }


@app.delete("/api/conversations/{conversation_id}")
def delete_conversation_endpoint(conversation_id: str):
    """Deletes a conversation and its messages from persistent storage."""
    deleted = database.delete_conversation(conversation_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    return {
        "success": True,
        "deleted": True
    }


# =====================================================================
# AGENT GENERATION WITH CONTEXT CONTINUITY
# =====================================================================
@app.post("/api/generate")
def generate_content(req: GenerateRequest) -> Dict[str, Any]:
    """Executes the AI Agent workflow pipeline with Persistent Conversation Memory."""
    user_prompt = req.prompt.strip()
    if not user_prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    # 1. Social Media Classification (if/else rule or user selection)
    if req.platform and req.platform.lower() not in ["auto", "auto-detect", ""]:
        selected_platform = req.platform
    else:
        selected_platform = workflow.classify_social_media(user_prompt)

    # 2. Retrieve or establish Persistent Conversation Memory Session
    conv_id = req.conversation_id
    conversation_history = ""

    if conv_id:
        existing_conv = database.get_conversation(conv_id)
        if existing_conv:
            conversation_history = database.get_conversation_history_for_agent(conv_id)
        else:
            # Create if ID was provided but record doesn't exist yet
            database.create_conversation(
                title=user_prompt[:48] + "...",
                platform=selected_platform,
                conversation_id=conv_id
            )
    else:
        new_conv = database.create_conversation(
            title=user_prompt[:48] + "...",
            platform=selected_platform
        )
        conv_id = new_conv["id"]

    # 3. Step 2: Planning with Conversation History
    plan = workflow.plan_content(
        user_prompt,
        selected_platform,
        conversation_history=conversation_history
    )

    # 4. Step 3: Research & Analysis with Memory
    research_results = workflow.research_and_analysis(
        plan,
        conversation_history=conversation_history
    )

    # 5. Step 4: Create Content with Context Continuity
    created_content = workflow.create_content(
        plan,
        research_results,
        conversation_history=conversation_history
    )

    # 6. Step 4b: Quality Evaluator Audit
    evaluation = workflow.evaluate_content(plan, research_results, created_content)

    # 7. Step 5: Final Action Kit
    final_output = workflow.generate_final_output(
        plan,
        research_results,
        created_content,
        save_to_file=False
    )

    # 8. PERSIST TO DATABASE: Save user prompt, assistant response, and 5-step metadata
    database.add_message(conv_id, "user", user_prompt)

    step_metadata = {
        "plan": plan,
        "research": {
            "summary": research_results.get("research_summary", ""),
            "audience_interests": research_results.get("audience_interests", []),
            "competitor_content": research_results.get("competitor_content", []),
            "current_trends": research_results.get("current_trends", []),
        },
        "content": created_content.get("content", ""),
        "evaluation": evaluation,
        "action_kit": final_output.get("action_kit", ""),
    }

    database.add_message(
        conv_id,
        "assistant",
        created_content.get("content", ""),
        step_data=step_metadata
    )

    # Update rolling conversation memory context
    database.update_conversation_context(
        conversation_id=conv_id,
        summary=f"Latest topic: {user_prompt}. Strategy: {plan.get('content_goals', '')}",
        target_audience=plan.get("target_audience", ""),
        brand_guidelines=plan.get("branding", ""),
        last_plan=plan,
        last_research=research_results,
        last_content=created_content,
        last_action_kit=final_output
    )

    return {
        "success": True,
        "conversation_id": conv_id,
        "prompt": user_prompt,
        "platform": selected_platform,
        "plan": plan,
        "research": {
            "summary": research_results.get("research_summary", ""),
            "audience_interests": research_results.get("audience_interests", []),
            "competitor_content": research_results.get("competitor_content", []),
            "current_trends": research_results.get("current_trends", []),
        },
        "content": created_content.get("content", ""),
        "evaluation": evaluation,
        "action_kit": final_output.get("action_kit", ""),
        "status": "Completed"
    }


if __name__ == "__main__":
    # Pass app instance directly so uvicorn never misidentifies the parent main.py
    uvicorn.run(app, host="127.0.0.1", port=8000)
