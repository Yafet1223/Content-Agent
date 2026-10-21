import os
import sys

# Ensure parent directory of Content-Agent (which contains Database/) is in sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))

if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from Database.db import (
    init_db,
    create_conversation,
    get_conversation,
    list_conversations,
    add_message,
    update_conversation_context,
    get_conversation_history_for_agent,
    delete_conversation,
    DB_PATH
)

__all__ = [
    "init_db",
    "create_conversation",
    "get_conversation",
    "list_conversations",
    "add_message",
    "update_conversation_context",
    "get_conversation_history_for_agent",
    "delete_conversation",
    "DB_PATH"
]
