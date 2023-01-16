"""Python Package Template"""
from __future__ import annotations
from .blocks.embedding import OpenAIEmbeddingBlock
from .blocks.vectordb import PineconeVectorDBBlock
from .blocks.completion import GPTCompletionBlock
from .blocks.cache import RedisCache
from .compound.compound import CXCopilot

__version__ = "0.0.3"
