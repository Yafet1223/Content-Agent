# Content Creator AI Agent 🚀

A modular, multi-format AI Agent designed to turn raw ideas into tailored, high-converting content across platforms using **LangGraph** and **Google Gemini**.

---

## 📐 End-to-End Workflow Architecture

```
                       User Request
                            ↓
                [ Phase 1: Prompt Router ] 
                            ↓
                   Choose Content Type
       ┌─────────────┬─────────────┬─────────────┬─────────────┐
       ↓             ↓             ↓             ↓             ↓
 TikTok Script    X Post     LinkedIn Post     Blog         Ad Copy
  Guidelines    Guidelines    Guidelines    Guidelines    Guidelines
       └─────────────┴─────────────┴─────────────┴─────────────┘
                            ↓
           ===========================================
           [ Phase 2: Unified Dynamic Prompt Chain ]
           ===========================================
           1. Research / Idea Generation
              • Audience psychology & emotional triggers
              • Core value proposition & proof points
              • 3 distinctive hook angles
                    ↓
           2. Outline Blueprint
              • Platform-tailored structure
              • Beat-sheet / Thread arc / PAS Framework
                    ↓
           3. Full Draft Generation
              • Complete, formatted, publish-ready draft
                    ↓
           4. Review & Polish
              • Hook variations for A/B testing
              • Formatting & flow optimization
              • High-reach hashtags & optimized CTAs
           ===========================================
                            ↓
                     [ Final Output ]
```

---

## 🗂️ Project Structure

```
Content-Agent/
├── .env                  # API keys (GEMINI_API_KEY)
├── .env.example          # Environment variables template
├── config.py             # Configuration & model loader (Gemini 2.5/2.0 Flash)
├── models.py             # Pydantic schemas (RouterDecision, ContentType, AgentState)
├── router.py             # Prompt Router with structured output & rule fallback
├── chain.py              # Prompt Chain (Research/Idea -> Outline -> Draft -> Review & Polish)
├── workflow.py           # LangGraph StateGraph connecting Router to Prompt Chain
├── main.py               # Interactive CLI runner & test suite with Rich formatting
└── README.md
```

---

## ⚡ Setup & Quickstart

### 1. Configure Your Gemini API Key
In [.env](file:///c:/Users/Yafet/Downloads/Content-agent/Content-Agent/.env):
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

*(Note: The agent also includes a resilient heuristic fallback generator so you can test and run workflows immediately even before entering an API key).*

### 2. Run the Workflow
Execute the suite:
```bash
python main.py
```

### 3. Test Any Custom Request
Pass any prompt directly in quotes:
```bash
python main.py "Create a 30s TikTok video hook about 3 crazy AI tools for students"
python main.py "Write a punchy X thread on why clean code beats premature optimization"
python main.py "Write a thought leadership post about engineering culture for LinkedIn"
python main.py "Create an aesthetic Instagram carousel post for my restaurant business"
python main.py "In-depth guide on deploying autonomous AI agents with LangGraph"
python main.py "Write high converting sales copy for my SaaS product launch"
```
