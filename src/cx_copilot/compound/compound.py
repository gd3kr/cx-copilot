from __future__ import annotations

from typing import Dict, Optional

import redis
from envyaml import EnvYAML

from ..blocks.cache import Cache, RedisCache
from ..blocks.cleaner import clean_ticket
from ..blocks.completion import CompletionBlock, GPTCompletionBlock
from ..blocks.embedding import EmbeddingBlock, OpenAIEmbeddingBlock
from ..blocks.tickets import (
    ConversationRepository,
    DiscordConversationRepository,
    HelpscoutConversationRepository,
    IntercomConversationRepository,
    ZendeskConversationRepository,
)
from ..blocks.vectordb import PineconeVectorDBBlock, VectorDBBlock

_DEFAULT_PROMPT = (
    "You are a customer support agent. "
    "You are tasked with accurately answering the following ticket. "
    "You have answered similar questions in the past. \n"
    "Q1: {matches[0].metadata[question]}\n A1: {matches[0].metadata[value]} \n"
    "-----------------------------------\n"
    "Q2:{matches[1].metadata[question]} "
    "\n A2:{matches[1].metadata[value]}"
    "Q3: {ticket_body} \n"
    "A3: "
)


class CXCopilot:
    cache_block: Cache
    ticket_repo: ConversationRepository
    vector_db: VectorDBBlock
    embedding: EmbeddingBlock
    completion: CompletionBlock

    def __init_cache__(self, yaml: EnvYAML):
        cache_config: dict | None = yaml.get("cache")
        if cache_config is None:
            return

        if cache_config["type"] == "redis":
            host = cache_config["host"]
            port = cache_config["port"]
            db = cache_config["db"]
            self.cache_block = RedisCache(host=host, port=port, db=db)

    def __init_ticket_repo__(self, yaml: EnvYAML):
        ticket_config: dict | None = yaml.get("ticketing")
        if ticket_config is None:
            return

        if ticket_config["type"] == "helpscout":
            app_id = ticket_config["app_id"]
            secret = ticket_config["secret"]
            self.ticket_repo = HelpscoutConversationRepository(app_id=app_id, app_secret=secret)

        elif ticket_config["type"] == "intercom":
            token = ticket_config["personal_access_token"]
            self.ticket_repo = IntercomConversationRepository(personal_access_token=token)

        elif ticket_config["type"] == "zendesk":
            token = ticket_config["token"]
            subdomain = ticket_config["subdomain"]
            email = ticket_config["email"]
            self.ticket_repo = ZendeskConversationRepository(subdomain=subdomain, email=email, token=token)

        elif ticket_config["type"] == "discord":
            token = ticket_config["token"]
            self.ticket_repo = DiscordConversationRepository(token=token)

    def __init_vector_db__(self, yaml: EnvYAML):
        vector_config: dict | None = yaml.get("vectordb")
        if vector_config is None:
            return

        if vector_config["type"] == "pinecone":
            key = vector_config["key"]
            env = vector_config["environment"]
            self.vector_db = PineconeVectorDBBlock(key=key, environment=env)

    def __init_completion__(self, yaml: EnvYAML):
        completion_config: dict | None = yaml.get("completion")
        if completion_config is None:
            return

        if completion_config["type"] == "openai":
            key = completion_config["key"]
            self.completion = GPTCompletionBlock(open_ai_key=key)

    def __init_embedding__(self, yaml: EnvYAML):
        embedding_config: dict | None = yaml.get("embedding")
        if embedding_config is None:
            return

        if embedding_config["type"] == "openai":
            key = embedding_config["key"]
            self.embedding = OpenAIEmbeddingBlock(open_ai_key=key)

    def get_ticket_response(self, ticket_id: str, use_cached=True, cache_response=True, max_tokens=2000):
        content = self.ticket_repo.get_conversation_by_id(conversation_id=ticket_id)
        cleaned = clean_ticket(content.threads[-1].body, self.ticket_repo)
        embedded_content = self.embedding.embed_text(cleaned)
        similar_tickets = self.vector_db.lookup(embedded_content, "readwise")
        prompt = _DEFAULT_PROMPT.format(matches=similar_tickets.ClosestEmbeddings, ticket_body=cleaned)
        completion = self.completion.get_completion(
            prompt=prompt,
            max_tokens=max_tokens,
            temperature=0.7,
        )
        return completion

    def __init__(self, path="copilot_config.yml"):
        env = EnvYAML(path)
        self.__init_cache__(env)
        self.__init_ticket_repo__(env)
        self.__init_vector_db__(env)
        self.__init_completion__(env)
        self.__init_embedding__(env)
