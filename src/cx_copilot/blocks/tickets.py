from __future__ import annotations

import asyncio
from typing import Dict, List, TypedDict

import discord
import hikari
import intercom.client
import zenpy
from discord.utils import find
from helpscout import HelpScout

DISCORD_BASE_URL = "https://discordapp.com/api/"


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


class DiscordMessage(TypedDict):
    content: str


def _discord_thread_to_common(message: DiscordMessage) -> Thread:
    return Thread(body=message["content"])


class DiscordConversationRepository(ConversationRepository):
    instance: hikari.RESTApp
    token: str

    def __init__(self, token: str):
        self.token = token

    def get_conversation_by_id(self, conversation_id: str) -> Conversation | None:
        import requests

        url = f"{DISCORD_BASE_URL}/channels/{conversation_id}/messages"

        payload = {}
        headers = {
            "Authorization": f"Bot {self.token}",
        }

        response = requests.request("GET", url, headers=headers, data=payload)

        parsed = response.json()
        mapped = list(map(_discord_thread_to_common, parsed))
        mapped.reverse()
        return Conversation(threads=mapped)
        # for guild in guilds:
        #     thread = guild.get_channel_or_thread(conversation_id)
        #     if thread.id == conversation_id:
        #         messages = asyncio.get_event_loop().run_until_complete(self._get_messages(thread))
        #         return Conversation(threads=list(map(_discord_thread_to_common, messages)))

        return None
