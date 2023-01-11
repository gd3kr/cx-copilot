from __future__ import annotations

from typing import List, Dict
from helpscout import HelpScout


class Thread:
    body: str

    def __init__(self, body: str):
        self.body = body


class Conversation:
    threads: List[Thread]

    def __init__(self, threads: List[Thread]):
        self.threads = threads


class ConversationRepository:
    def get_conversation_by_id(self, conversation_id: str) -> Conversation | None:
        raise NotImplementedError


def _helpscout_thread_to_common(thread: Dict) -> Thread:
    return Thread(body=thread['body'])


class HelpscoutConversationRepository(ConversationRepository):
    helpscout: HelpScout

    def __init__(self, app_id: str, app_secret: str):
        self.helpscout = HelpScout(app_id=app_id, app_secret=app_secret)

    def get_conversation_by_id(self, conversation_id: str) -> Conversation | None:
        threads = self.helpscout.conversations[conversation_id].threads.get()
        mapped = map(_helpscout_thread_to_common, threads)
        return Conversation(threads=mapped)
