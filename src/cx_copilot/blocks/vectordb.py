from __future__ import annotations

from typing import List, Optional, Dict

import pinecone

from ..exceptions.exceptions import MissingAPIKeyException


class ClosestEmbeddingT:
    score: float
    metadata: Dict

    def __init__(self, score: float, metadata: Dict):
        self.score = score
        self.metadata = metadata


class EmbeddingsResponseT:
    ClosestEmbeddings: List[ClosestEmbeddingT]

    def __init__(self, embeddings):
        self.ClosestEmbeddings = embeddings


class VectorDBBlock:
    def lookup(self, vector: List[int], index_name: str, top_k: int = 3) -> ClosestEmbeddingT:
        pass


def check_key_decorator(func):
    def wrapper(*args):
        if args[0].api_key is None:
            raise MissingAPIKeyException('OpenAI API key is required for embeddings')
        return func(*args)

    return wrapper


def _pinecone_match_to_common(pinecone_match) -> ClosestEmbeddingT:
    return ClosestEmbeddingT(score=pinecone_match['score'], metadata=pinecone_match['metadata'])


class PineconeVectorDBBlock(VectorDBBlock):
    api_key: Optional[str] = None
    environment: Optional[str] = None

    def __init__(self, key: str, environment: str) -> None:
        self.api_key = key
        self.environment = environment
        pinecone.init(api_key=key, environment=environment)

    @check_key_decorator
    def lookup(self, vector: List[int], index_name: str, top_k: int = 3) -> EmbeddingsResponseT | None:
        response = pinecone.Index(index_name).query(
            vector=vector,
            top_k=top_k,
            include_metadata=True,
        )
        if response is None or 'matches' not in response:
            return None

        closest = list(map(_pinecone_match_to_common, response['matches']))
        return EmbeddingsResponseT(embeddings=closest)
