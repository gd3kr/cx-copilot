from __future__ import annotations

import asyncio
from typing import Dict, List, TypedDict

import discord
import intercom.client
import zenpy
from discord.utils import find
from helpscout import HelpScout


class Thread:
    body: str

    def __init__(self, body: str):
        self.body = body

    def __repr__(self):
        return f"{self.body}"


class Conversation:
    threads: list[Thread]

    def __init__(self, threads: list[Thread]):
        self.threads = threads


class ConversationRepository:
    def get_conversation_by_id(self, conversation_id: str) -> Conversation | None:
        raise NotImplementedError


def _helpscout_thread_to_common(thread: dict) -> Thread:
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
    conversation_parts: list[IntercomConversationPart]


def _intercom_thread_to_common(thread: IntercomConversationPart) -> Thread:
    body = None
    if hasattr(thread, "body"):
        body = thread.body
    return Thread(body=body)


def _zendesk_thread_to_common(thread: zenpy) -> Thread:
    return Thread(body=thread.body)


def _discord_thread_to_common(message: discord.Message) -> Thread:
    return Thread(body=message.content)


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


class DiscordConversationRepository(ConversationRepository):
    instance: discord.Client

    def __init__(self, token: str):
        intents = discord.Intents.none()
        self.instance = discord.Client(intents)
        self.instance.login(token=token)

    async def _get_messages(self, thread: discord.Thread):
        return [message async for message in thread.history(limit=50)]

    def get_conversation_by_id(self, conversation_id: str) -> Conversation | None:
        guilds = self.instance.guilds
        for guild in guilds:
            thread = guild.get_channel_or_thread(conversation_id)
            if thread.id == conversation_id:
                messages = asyncio.get_event_loop().run_until_complete(self._get_messages(thread))
                return Conversation(threads=list(map(_discord_thread_to_common, messages)))

        return None
