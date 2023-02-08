"""Python Package Template"""
from __future__ import annotations

from .blocks.cache import RedisCache
from .blocks.completion import GPTCompletionBlock
from .blocks.embedding import OpenAIEmbeddingBlock
from .blocks.tickets import FrontConversationRepository
from .blocks.vectordb import PineconeVectorDBBlock
from .compound.compound import CXCopilot

__version__ = "0.0.8"
