"""Persistent Conversation Memory Database Module
Stores conversations, message history, agent workflow step outputs,
and rolling context using PostgreSQL (with native JSONB) and SQLite fallback.
"""

import os
import json
import uuid
import sqlite3
from datetime import datetime
from typing import Dict, Any, List, Optional
from pathlib import Path
from dotenv import load_dotenv

# Load environment configuration
env_paths = [
    Path(__file__).resolve().parent.parent / "Content-Agent" / ".env",
    Path(__file__).resolve().parent.parent / ".env",
    Path(__file__).resolve().parent / ".env"
]
for ep in env_paths:
    if ep.exists():
        load_dotenv(dotenv_path=ep)
        break

# Database Configuration (PostgreSQL with SQLite fallback)
DB_TYPE = os.getenv("DB_TYPE", "postgresql").lower()
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Yafetgetachew@1234")
DB_NAME = os.getenv("DB_NAME", "contentflow_db")

# SQLite fallback path
DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "content_memory.db")


DATABASE_URL = os.getenv("DATABASE_URL")


def get_db_connection():
    """Returns a connection tuple (conn, is_postgres).
    Tries PostgreSQL first (via DATABASE_URL or host credentials);
    if unavailable, falls back to SQLite.
    """
    if DB_TYPE == "postgresql" or DATABASE_URL:
        try:
            import psycopg2
            from psycopg2.extras import RealDictCursor

            db_url = os.getenv("DATABASE_URL")
            if db_url:
                # Compatibility for Render/Supabase/Heroku postgres:// URLs
                if db_url.startswith("postgres://"):
                    db_url = db_url.replace("postgres://", "postgresql://", 1)
                conn = psycopg2.connect(db_url)
                return conn, True
            else:
                conn = psycopg2.connect(
                    host=DB_HOST,
                    port=DB_PORT,
                    user=DB_USER,
                    password=DB_PASSWORD,
                    dbname=DB_NAME
                )
                return conn, True
        except Exception as e:
            print(f"[Database] PostgreSQL connection failed ({e}), falling back to SQLite.")

    # SQLite Fallback
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL;")
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn, False


def init_db() -> None:
    """Initializes the database schema for both PostgreSQL and SQLite,
    and automatically migrates existing SQLite records to PostgreSQL if needed.
    """
    conn, is_postgres = get_db_connection()

    if is_postgres:
        try:
            with conn:
                with conn.cursor() as cur:
                    # 1. Conversations table
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS conversations (
                            id VARCHAR(64) PRIMARY KEY,
                            title TEXT NOT NULL,
                            platform VARCHAR(64) NOT NULL DEFAULT 'General',
                            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                        );
                    """)

                    # 2. Messages table with native JSONB
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS messages (
                            id VARCHAR(64) PRIMARY KEY,
                            conversation_id VARCHAR(64) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
                            role VARCHAR(20) NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
                            content TEXT NOT NULL,
                            step_data JSONB,
                            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                        );
                    """)

                    # 3. Context table with native JSONB
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS conversation_context (
                            conversation_id VARCHAR(64) PRIMARY KEY REFERENCES conversations(id) ON DELETE CASCADE,
                            summary TEXT DEFAULT '',
                            target_audience TEXT DEFAULT '',
                            brand_guidelines TEXT DEFAULT '',
                            last_plan JSONB,
                            last_research JSONB,
                            last_content JSONB,
                            last_action_kit JSONB,
                            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                        );
                    """)

                    # 4. Indexes
                    cur.execute("""
                        CREATE INDEX IF NOT EXISTS idx_messages_conversation_id 
                        ON messages(conversation_id, created_at);
                    """)
                    cur.execute("""
                        CREATE INDEX IF NOT EXISTS idx_conversations_updated_at 
                        ON conversations(updated_at DESC);
                    """)

            # Automatically migrate SQLite records if Postgres is empty and SQLite exists
            migrate_sqlite_to_postgres(conn)
        finally:
            conn.close()
    else:
        # SQLite schema
        with conn:
            cur = conn.cursor()
            cur.execute("""
                CREATE TABLE IF NOT EXISTS conversations (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    platform TEXT NOT NULL DEFAULT 'General',
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
            """)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS messages (
                    id TEXT PRIMARY KEY,
                    conversation_id TEXT NOT NULL,
                    role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
                    content TEXT NOT NULL,
                    step_data TEXT,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
                );
            """)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS conversation_context (
                    conversation_id TEXT PRIMARY KEY,
                    summary TEXT DEFAULT '',
                    target_audience TEXT DEFAULT '',
                    brand_guidelines TEXT DEFAULT '',
                    last_plan TEXT DEFAULT '{}',
                    last_research TEXT DEFAULT '{}',
                    last_content TEXT DEFAULT '{}',
                    last_action_kit TEXT DEFAULT '{}',
                    updated_at TEXT NOT NULL,
                    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
                );
            """)
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_messages_conversation_id 
                ON messages(conversation_id, created_at);
            """)
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_conversations_updated_at 
                ON conversations(updated_at DESC);
            """)
        conn.close()


def migrate_sqlite_to_postgres(pg_conn) -> None:
    """Migrates any existing conversations and messages from SQLite to PostgreSQL."""
    if not os.path.exists(DB_PATH):
        return

    try:
        from psycopg2.extras import Json
        with pg_conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM conversations;")
            pg_count = cur.fetchone()[0]
            if pg_count > 0:
                return  # PostgreSQL already has data, no migration needed

            sq_conn = sqlite3.connect(DB_PATH)
            sq_conn.row_factory = sqlite3.Row
            sq_cur = sq_conn.cursor()

            sq_cur.execute("SELECT * FROM conversations")
            convs = sq_cur.fetchall()
            for c in convs:
                cur.execute("""
                    INSERT INTO conversations (id, title, platform, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO NOTHING
                """, (c["id"], c["title"], c["platform"], c["created_at"], c["updated_at"]))

            sq_cur.execute("SELECT * FROM messages")
            msgs = sq_cur.fetchall()
            for m in msgs:
                step_data = None
                if m["step_data"]:
                    try:
                        step_data = Json(json.loads(m["step_data"]))
                    except Exception:
                        step_data = None
                cur.execute("""
                    INSERT INTO messages (id, conversation_id, role, content, step_data, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO NOTHING
                """, (m["id"], m["conversation_id"], m["role"], m["content"], step_data, m["created_at"]))

            sq_cur.execute("SELECT * FROM conversation_context")
            contexts = sq_cur.fetchall()
            for ctx in contexts:
                def to_json(val):
                    if not val:
                        return None
                    try:
                        return Json(json.loads(val))
                    except Exception:
                        return None

                cur.execute("""
                    INSERT INTO conversation_context (
                        conversation_id, summary, target_audience, brand_guidelines,
                        last_plan, last_research, last_content, last_action_kit, updated_at
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (conversation_id) DO NOTHING
                """, (
                    ctx["conversation_id"], ctx["summary"], ctx["target_audience"], ctx["brand_guidelines"],
                    to_json(ctx["last_plan"]), to_json(ctx["last_research"]),
                    to_json(ctx["last_content"]), to_json(ctx["last_action_kit"]),
                    ctx["updated_at"]
                ))

            pg_conn.commit()
            sq_conn.close()
            print(f"[Database] Migrated {len(convs)} conversations from SQLite to PostgreSQL.")
    except Exception as e:
        print(f"[Database] Notice: SQLite migration check completed: {e}")


def create_conversation(
    title: str,
    platform: str = "General",
    conversation_id: Optional[str] = None
) -> Dict[str, Any]:
    """Creates a new conversation record in PostgreSQL or SQLite."""
    conv_id = conversation_id or f"conv_{uuid.uuid4().hex[:12]}"
    now = datetime.utcnow().isoformat()

    conn, is_postgres = get_db_connection()
    try:
        if is_postgres:
            with conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        INSERT INTO conversations (id, title, platform, created_at, updated_at)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (conv_id, title, platform, now, now))
                    cur.execute("""
                        INSERT INTO conversation_context (conversation_id, summary, updated_at)
                        VALUES (%s, %s, %s)
                        ON CONFLICT (conversation_id) DO UPDATE SET updated_at = EXCLUDED.updated_at
                    """, (conv_id, f"Conversation started for topic: {title} on {platform}", now))
        else:
            with conn:
                cur = conn.cursor()
                cur.execute("""
                    INSERT INTO conversations (id, title, platform, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?)
                """, (conv_id, title, platform, now, now))
                cur.execute("""
                    INSERT OR REPLACE INTO conversation_context (conversation_id, summary, updated_at)
                    VALUES (?, ?, ?)
                """, (conv_id, f"Conversation started for topic: {title} on {platform}", now))
    finally:
        conn.close()

    return {
        "id": conv_id,
        "title": title,
        "platform": platform,
        "created_at": now,
        "updated_at": now
    }


def get_conversation(conversation_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves conversation details along with all message history and context."""
    conn, is_postgres = get_db_connection()
    try:
        if is_postgres:
            from psycopg2.extras import RealDictCursor
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT * FROM conversations WHERE id = %s", (conversation_id,))
                conv = cur.fetchone()
                if not conv:
                    return None

                cur.execute("SELECT * FROM messages WHERE conversation_id = %s ORDER BY created_at ASC", (conversation_id,))
                msg_rows = cur.fetchall()

                messages = []
                for m in msg_rows:
                    step_data = m["step_data"]
                    if isinstance(step_data, str):
                        try:
                            step_data = json.loads(step_data)
                        except Exception:
                            pass
                    messages.append({
                        "id": m["id"],
                        "role": m["role"],
                        "content": m["content"],
                        "step_data": step_data,
                        "created_at": m["created_at"].isoformat() if hasattr(m["created_at"], "isoformat") else str(m["created_at"])
                    })

                cur.execute("SELECT * FROM conversation_context WHERE conversation_id = %s", (conversation_id,))
                ctx_row = cur.fetchone()
                context = {}
                if ctx_row:
                    context = {
                        "summary": ctx_row["summary"] or "",
                        "target_audience": ctx_row["target_audience"] or "",
                        "brand_guidelines": ctx_row["brand_guidelines"] or "",
                        "last_plan": ctx_row["last_plan"] or {},
                        "last_research": ctx_row["last_research"] or {},
                        "last_content": ctx_row["last_content"] or {},
                        "last_action_kit": ctx_row["last_action_kit"] or {},
                        "updated_at": ctx_row["updated_at"].isoformat() if hasattr(ctx_row["updated_at"], "isoformat") else str(ctx_row["updated_at"])
                    }

                return {
                    "id": conv["id"],
                    "title": conv["title"],
                    "platform": conv["platform"],
                    "created_at": conv["created_at"].isoformat() if hasattr(conv["created_at"], "isoformat") else str(conv["created_at"]),
                    "updated_at": conv["updated_at"].isoformat() if hasattr(conv["updated_at"], "isoformat") else str(conv["updated_at"]),
                    "messages": messages,
                    "context": context
                }
        else:
            with conn:
                cur = conn.cursor()
                cur.execute("SELECT * FROM conversations WHERE id = ?", (conversation_id,))
                conv_row = cur.fetchone()
                if not conv_row:
                    return None

                cur.execute("SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC", (conversation_id,))
                msg_rows = cur.fetchall()
                messages = []
                for row in msg_rows:
                    step_data = None
                    if row["step_data"]:
                        try:
                            step_data = json.loads(row["step_data"])
                        except Exception:
                            pass
                    messages.append({
                        "id": row["id"],
                        "role": row["role"],
                        "content": row["content"],
                        "step_data": step_data,
                        "created_at": str(row["created_at"])
                    })

                cur.execute("SELECT * FROM conversation_context WHERE conversation_id = ?", (conversation_id,))
                context_row = cur.fetchone()
                context = {}
                if context_row:
                    context = {
                        "summary": context_row["summary"] or "",
                        "target_audience": context_row["target_audience"] or "",
                        "brand_guidelines": context_row["brand_guidelines"] or "",
                        "last_plan": json.loads(context_row["last_plan"] or "{}"),
                        "last_research": json.loads(context_row["last_research"] or "{}"),
                        "last_content": json.loads(context_row["last_content"] or "{}"),
                        "last_action_kit": json.loads(context_row["last_action_kit"] or "{}"),
                        "updated_at": str(context_row["updated_at"])
                    }

                return {
                    "id": conv_row["id"],
                    "title": conv_row["title"],
                    "platform": conv_row["platform"],
                    "created_at": str(conv_row["created_at"]),
                    "updated_at": str(conv_row["updated_at"]),
                    "messages": messages,
                    "context": context
                }
    finally:
        conn.close()


def list_conversations(limit: int = 50) -> List[Dict[str, Any]]:
    """Lists conversations ordered by most recently active."""
    conn, is_postgres = get_db_connection()
    try:
        if is_postgres:
            from psycopg2.extras import RealDictCursor
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT c.id, c.title, c.platform, c.created_at, c.updated_at,
                           COUNT(m.id) as message_count,
                           (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
                    FROM conversations c
                    LEFT JOIN messages m ON c.id = m.conversation_id
                    GROUP BY c.id
                    ORDER BY c.updated_at DESC
                    LIMIT %s
                """, (limit,))
                rows = cur.fetchall()
                results = []
                for r in rows:
                    results.append({
                        "id": r["id"],
                        "title": r["title"],
                        "platform": r["platform"],
                        "created_at": r["created_at"].isoformat() if hasattr(r["created_at"], "isoformat") else str(r["created_at"]),
                        "updated_at": r["updated_at"].isoformat() if hasattr(r["updated_at"], "isoformat") else str(r["updated_at"]),
                        "message_count": int(r["message_count"] or 0),
                        "last_message": r["last_message"] or ""
                    })
                return results
        else:
            with conn:
                cur = conn.cursor()
                cur.execute("""
                    SELECT c.*, 
                           COUNT(m.id) as message_count,
                           (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
                    FROM conversations c
                    LEFT JOIN messages m ON c.id = m.conversation_id
                    GROUP BY c.id
                    ORDER BY c.updated_at DESC
                    LIMIT ?
                """, (limit,))
                rows = cur.fetchall()
                results = []
                for r in rows:
                    results.append({
                        "id": r["id"],
                        "title": r["title"],
                        "platform": r["platform"],
                        "created_at": str(r["created_at"]),
                        "updated_at": str(r["updated_at"]),
                        "message_count": int(r["message_count"] or 0),
                        "last_message": r["last_message"] or ""
                    })
                return results
    finally:
        conn.close()


def add_message(
    conversation_id: str,
    role: str,
    content: str,
    step_data: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Adds a new message to the conversation and updates updated_at."""
    msg_id = f"msg_{uuid.uuid4().hex[:12]}"
    now = datetime.utcnow().isoformat()

    conn, is_postgres = get_db_connection()
    try:
        if is_postgres:
            from psycopg2.extras import Json
            with conn:
                with conn.cursor() as cur:
                    json_step_data = Json(step_data) if step_data else None
                    cur.execute("""
                        INSERT INTO messages (id, conversation_id, role, content, step_data, created_at)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, (msg_id, conversation_id, role, content, json_step_data, now))

                    cur.execute("""
                        UPDATE conversations SET updated_at = %s WHERE id = %s
                    """, (now, conversation_id))
        else:
            step_data_json = json.dumps(step_data, ensure_ascii=False) if step_data else None
            with conn:
                cur = conn.cursor()
                cur.execute("""
                    INSERT INTO messages (id, conversation_id, role, content, step_data, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (msg_id, conversation_id, role, content, step_data_json, now))
                cur.execute("""
                    UPDATE conversations SET updated_at = ? WHERE id = ?
                """, (now, conversation_id))
    finally:
        conn.close()

    return {
        "id": msg_id,
        "conversation_id": conversation_id,
        "role": role,
        "content": content,
        "step_data": step_data,
        "created_at": now
    }


def update_conversation_context(
    conversation_id: str,
    summary: Optional[str] = None,
    target_audience: Optional[str] = None,
    brand_guidelines: Optional[str] = None,
    last_plan: Optional[Dict[str, Any]] = None,
    last_research: Optional[Dict[str, Any]] = None,
    last_content: Optional[Dict[str, Any]] = None,
    last_action_kit: Optional[Dict[str, Any]] = None
) -> None:
    """Updates the persistent context summary and latest artifacts."""
    now = datetime.utcnow().isoformat()
    conn, is_postgres = get_db_connection()

    try:
        if is_postgres:
            from psycopg2.extras import Json
            with conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT * FROM conversation_context WHERE conversation_id = %s", (conversation_id,))
                    existing = cur.fetchone()

                    if existing:
                        cur.execute("""
                            UPDATE conversation_context
                            SET summary = COALESCE(%s, summary),
                                target_audience = COALESCE(%s, target_audience),
                                brand_guidelines = COALESCE(%s, brand_guidelines),
                                last_plan = CASE WHEN %s::jsonb IS NOT NULL THEN %s::jsonb ELSE last_plan END,
                                last_research = CASE WHEN %s::jsonb IS NOT NULL THEN %s::jsonb ELSE last_research END,
                                last_content = CASE WHEN %s::jsonb IS NOT NULL THEN %s::jsonb ELSE last_content END,
                                last_action_kit = CASE WHEN %s::jsonb IS NOT NULL THEN %s::jsonb ELSE last_action_kit END,
                                updated_at = %s
                            WHERE conversation_id = %s
                        """, (
                            summary, target_audience, brand_guidelines,
                            json.dumps(last_plan) if last_plan is not None else None,
                            json.dumps(last_plan) if last_plan is not None else None,
                            json.dumps(last_research) if last_research is not None else None,
                            json.dumps(last_research) if last_research is not None else None,
                            json.dumps(last_content) if last_content is not None else None,
                            json.dumps(last_content) if last_content is not None else None,
                            json.dumps(last_action_kit) if last_action_kit is not None else None,
                            json.dumps(last_action_kit) if last_action_kit is not None else None,
                            now, conversation_id
                        ))
                    else:
                        cur.execute("""
                            INSERT INTO conversation_context (
                                conversation_id, summary, target_audience, brand_guidelines,
                                last_plan, last_research, last_content, last_action_kit, updated_at
                            )
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """, (
                            conversation_id,
                            summary or "",
                            target_audience or "",
                            brand_guidelines or "",
                            Json(last_plan or {}),
                            Json(last_research or {}),
                            Json(last_content or {}),
                            Json(last_action_kit or {}),
                            now
                        ))

                    cur.execute("UPDATE conversations SET updated_at = %s WHERE id = %s", (now, conversation_id))
        else:
            with conn:
                cur = conn.cursor()
                cur.execute("SELECT * FROM conversation_context WHERE conversation_id = ?", (conversation_id,))
                existing = cur.fetchone()

                if existing:
                    new_summary = summary if summary is not None else existing["summary"]
                    new_audience = target_audience if target_audience is not None else existing["target_audience"]
                    new_brand = brand_guidelines if brand_guidelines is not None else existing["brand_guidelines"]
                    new_plan = json.dumps(last_plan, ensure_ascii=False) if last_plan is not None else existing["last_plan"]
                    new_res = json.dumps(last_research, ensure_ascii=False) if last_research is not None else existing["last_research"]
                    new_cont = json.dumps(last_content, ensure_ascii=False) if last_content is not None else existing["last_content"]
                    new_kit = json.dumps(last_action_kit, ensure_ascii=False) if last_action_kit is not None else existing["last_action_kit"]

                    cur.execute("""
                        UPDATE conversation_context
                        SET summary = ?, target_audience = ?, brand_guidelines = ?,
                            last_plan = ?, last_research = ?, last_content = ?,
                            last_action_kit = ?, updated_at = ?
                        WHERE conversation_id = ?
                    """, (new_summary, new_audience, new_brand, new_plan, new_res, new_cont, new_kit, now, conversation_id))
                else:
                    cur.execute("""
                        INSERT INTO conversation_context (
                            conversation_id, summary, target_audience, brand_guidelines,
                            last_plan, last_research, last_content, last_action_kit, updated_at
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        conversation_id,
                        summary or "",
                        target_audience or "",
                        brand_guidelines or "",
                        json.dumps(last_plan or {}, ensure_ascii=False),
                        json.dumps(last_research or {}, ensure_ascii=False),
                        json.dumps(last_content or {}, ensure_ascii=False),
                        json.dumps(last_action_kit or {}, ensure_ascii=False),
                        now
                    ))
                cur.execute("UPDATE conversations SET updated_at = ? WHERE id = ?", (now, conversation_id))
    finally:
        conn.close()


def get_conversation_history_for_agent(conversation_id: str, max_turns: int = 5) -> str:
    """Formats recent conversation turns and context for prompt chaining in workflow.py."""
    if not conversation_id:
        return ""

    conn, is_postgres = get_db_connection()
    try:
        rows = []
        if is_postgres:
            from psycopg2.extras import RealDictCursor
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT role, content 
                    FROM messages 
                    WHERE conversation_id = %s 
                    ORDER BY created_at DESC 
                    LIMIT %s
                """, (conversation_id, max_turns * 2))
                rows = cur.fetchall()
        else:
            with conn:
                cur = conn.cursor()
                cur.execute("""
                    SELECT role, content 
                    FROM messages 
                    WHERE conversation_id = ? 
                    ORDER BY created_at DESC 
                    LIMIT ?
                """, (conversation_id, max_turns * 2))
                rows = cur.fetchall()

        if not rows:
            return ""

        chronological = list(reversed(rows))
        formatted = []
        for r in chronological:
            speaker = "User" if r["role"] == "user" else "AI Content Agent"
            snippet = r["content"][:400] + ("..." if len(r["content"]) > 400 else "")
            formatted.append(f"{speaker}: {snippet}")

        return "\n".join(formatted)
    finally:
        conn.close()


def delete_conversation(conversation_id: str) -> bool:
    """Deletes a conversation and its messages/context via foreign key cascade."""
    conn, is_postgres = get_db_connection()
    try:
        if is_postgres:
            with conn:
                with conn.cursor() as cur:
                    cur.execute("DELETE FROM conversations WHERE id = %s", (conversation_id,))
                    return cur.rowcount > 0
        else:
            with conn:
                cur = conn.cursor()
                cur.execute("DELETE FROM conversations WHERE id = ?", (conversation_id,))
                return cur.rowcount > 0
    finally:
        conn.close()


# Automatically initialize schema and check migration on startup
try:
    init_db()
except Exception as _e:
    print(f"[Database] Notice during init_db: {_e}")
