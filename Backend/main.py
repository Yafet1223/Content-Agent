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

import workflow

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="ContentFlow AI - Backend API",
    description="Backend API powering the ContentFlow AI Content Creation Studio",
    version="1.0.0"
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


@app.get("/")
def home():
    return {
        "message": "Hello, FastAPI!",
        "status": "online",
        "service": "ContentFlow AI Backend",
        "endpoints": {
            "health": "/health",
            "generate": "/api/generate"
        }
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "agent_ready": True
    }


@app.post("/api/generate")
def generate_content(req: GenerateRequest) -> Dict[str, Any]:
    """Executes the AI Agent workflow pipeline for the given user prompt."""
    user_prompt = req.prompt.strip()
    if not user_prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    # 1. Social Media Classification (if/else rule or user selection)
    if req.platform and req.platform.lower() not in ["auto", "auto-detect", ""]:
        selected_platform = req.platform
    else:
        selected_platform = workflow.classify_social_media(user_prompt)

    # 2. Planning (Prompt Chaining)
    plan = workflow.plan_content(user_prompt, selected_platform)

    # 3. Research & Analysis (Tavily search & LLM interpretation)
    research_results = workflow.research_and_analysis(plan)

    # 4. Create the Content (Full publish-ready copy)
    created_content = workflow.create_content(plan, research_results)

    # 4b. Quality Evaluator Audit (Score & Criteria Breakdown)
    evaluation = workflow.evaluate_content(plan, research_results, created_content)

    # 5. Final Action Kit
    final_output = workflow.generate_final_output(
        plan,
        research_results,
        created_content,
        save_to_file=False
    )

    return {
        "success": True,
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
