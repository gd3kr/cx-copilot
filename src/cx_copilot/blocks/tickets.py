from __future__ import annotations

from typing import List, Dict, TypedDict

import intercom.client
import zenpy
from helpscout import HelpScout


class Thread:
    body: str

    def __init__(self, body: str):
        self.body = body

    def __repr__(self):
        return f"{self.body}"


class Conversation:
    threads: List[Thread]

    def __init__(self, threads: List[Thread]):
        self.threads = threads


class ConversationRepository:
    def get_conversation_by_id(self, conversation_id: str) -> Conversation | None:
        raise NotImplementedError


def _helpscout_thread_to_common(thread: Dict) -> Thread:
    body = None
    if hasattr(thread, "body"):
        body = thread.body
    return Thread(body=body)


class HelpscoutConversationRepository(ConversationRepository):
    helpscout: HelpScout

    def __init__(self, app_id: str, app_secret: str):
        self.helpscout = HelpScout(app_id=app_id, app_secret=app_secret)

    def get_conversation_by_id(self, conversation_id: str) -> Conversation | None:
        threads = self.helpscout.conversations[conversation_id].threads.get()
        mapped = list(map(_helpscout_thread_to_common, threads))
        return Conversation(threads=mapped)


class IntercomConversationPart:
    body: str


class IntercomConversation:
    conversation_parts: List[IntercomConversationPart]


def _intercom_thread_to_common(thread: IntercomConversationPart) -> Thread:
    body = None
    if hasattr(thread, "body"):
        body = thread.body
    return Thread(body=body)


def _zendesk_thread_to_common(thread: zenpy) -> Thread:
    return Thread(body=thread.body)


class IntercomConversationRepository(ConversationRepository):
    instance: intercom.client.Client

    def __init__(self, personal_access_token):
        self.instance = intercom.client.Client(personal_access_token=personal_access_token)

    def get_conversation_by_id(self, conversation_id: str) -> Conversation | None:
        thread: IntercomConversation = self.instance.conversations.find(id=conversation_id)
        mapped = list(map(_intercom_thread_to_common, thread.conversation_parts))
        mapped.append(Thread(body=thread.source.body))
        return Conversation(threads=mapped)


class ZendeskConversationRepository(ConversationRepository):
    instance: zenpy.Zenpy

    def __init__(self, subdomain: str, email: str, token: str):
        self.instance = zenpy.Zenpy(subdomain=subdomain, email=email, token=token)

    def get_conversation_by_id(self, conversation_id: str) -> Conversation | None:
        comments = self.instance.tickets.comments(ticket=conversation_id)
        mapped = list(map(_zendesk_thread_to_common, comments))
        return Conversation(threads=mapped)
