# ContentFlow AI — Production Deployment Guide

This guide walks you through deploying **ContentFlow AI** across your production stack:

| Component | Platform | Service Type | Role |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** | Static React SPA | Dashboard, Projects, Content Library |
| **Backend & AI Agent** | **Render** | Python Web Service | FastAPI, Agent Workflow (Gemini + Tavily) |
| **Database** | **Render / Managed PostgreSQL** | PostgreSQL 16+ | Persistent Conversations, Messages & Context |

---

## Architecture Diagram

```mermaid
flowchart TD
    User["End User (Browser)"]
    Vercel["Frontend on Vercel\n(https://contentflow-ai.vercel.app)"]
    Render["Backend & AI Agent on Render\n(https://contentflow-backend.onrender.com)"]
    Postgres[("Managed PostgreSQL Database\n(Render / Supabase / Neon)")]
    LLM["Google Gemini 2.5 Flash"]
    Search["Tavily AI Search"]

    User -->|"Visits App"| Vercel
    Vercel -->|"API requests via VITE_BACKEND_URL"| Render
    Render -->|"Read / Write conversation turns (JSONB)"| Postgres
    Render -->|"Prompt Chaining & Planning"| LLM
    Render -->|"Live Web Trends & Market Research"| Search
```

---

## Step 1: Deploy Database & Backend on Render

You can deploy both the database and backend in 1 click using the included [`render.yaml`](file:///c:/Users/Yafet/Downloads/Content-agent/Content-Agent/render.yaml) Blueprint!

### Option A: 1-Click Render Blueprint (Recommended)
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository: `https://github.com/Yafet1223/Content-Agent`.
4. Render will automatically parse `render.yaml` and create:
   - **`contentflow-db`**: Managed PostgreSQL database.
   - **`contentflow-backend`**: FastAPI web service with environment variables pre-linked.
5. In the prompt for secret environment variables, enter:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `TAVILY_API_KEY`: Your Tavily Search API Key.
6. Click **Apply**.
7. Once deployed, copy your backend URL (e.g. `https://contentflow-backend.onrender.com`).

---

### Option B: Manual Setup on Render

#### 1. Create Managed PostgreSQL Database
1. In Render, click **New +** > **PostgreSQL**.
2. Name: `contentflow-db`
3. Database: `contentflow_db`
4. User: `postgres`
5. Plan: **Free** (or Starter)
6. Click **Create Database**.
7. Once provisioned, copy the **Internal Database URL** (e.g. `postgres://postgres:password@dpg-xxx:5432/contentflow_db`).

#### 2. Create Backend Web Service
1. In Render, click **New +** > **Web Service**.
2. Connect your repository: `https://github.com/Yafet1223/Content-Agent`.
3. Configure settings:
   - **Name:** `contentflow-backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install --upgrade pip && pip install -r Backend/requirements.txt`
   - **Start Command:** `python Backend/main.py`
4. Under **Environment Variables**, add:
   - `PYTHONPATH`: `.`
   - `PORT`: `10000`
   - `DB_TYPE`: `postgresql`
   - `DATABASE_URL`: *(Paste your Internal Database URL from Step 1)*
   - `GEMINI_API_KEY`: *(Your Gemini API key)*
   - `GEMINI_MODEL`: `gemini-2.5-flash`
   - `TAVILY_API_KEY`: *(Your Tavily API key)*
5. Click **Create Web Service**.
6. When deployment finishes, test it by opening `https://<your-render-app>.onrender.com/health` in your browser. You should see:
   ```json
   {"status":"healthy","agent_ready":true,"database_connected":true}
   ```

---

## Step 2: Deploy Frontend on Vercel

1. Log in to [Vercel](https://vercel.com/) and click **Add New...** > **Project**.
2. Import your GitHub repository: `https://github.com/Yafet1223/Content-Agent`.
3. In the project configuration:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click *Edit* and select **`Frontend/my-react-app`** (or leave as root if using root `vercel.json`).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Expand **Environment Variables** and add:
   - **Key:** `VITE_BACKEND_URL`
   - **Value:** `https://<your-render-app>.onrender.com` *(Your Render backend URL without trailing slash)*
5. Click **Deploy**.
6. Vercel will build and assign you a production domain (e.g. `https://contentflow-ai.vercel.app`).

---

## Step 3: Verification

1. Open your Vercel URL in your browser.
2. In the top-right of the dashboard generator, the status pill will show:
   `🟢 <your-render-app>.onrender.com` (connected).
3. Generate content or send a prompt to verify that:
   - The 5-stage agent pipeline executes on Render.
   - The conversation and all output metadata are persisted directly in your Managed PostgreSQL database.
   - Refreshing the page immediately restores the conversation context!
