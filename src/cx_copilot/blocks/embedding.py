from typing import List, Optional

import requests as requests

from ..exceptions.exceptions import MissingAPIKeyException


class EmbeddingBlock:
    def embed_text(self, text: str) -> List[int]:
        pass


def check_key_decorator(func):
    def wrapper(*args, **kwargs):
        if args[0].open_ai_key is None:
            raise MissingAPIKeyException("OpenAI API key is required for embeddings")
        return func(*args, **kwargs)

    return wrapper


class OpenAIEmbeddingBlock(EmbeddingBlock):
    open_ai_key: Optional[str] = None

    def __init__(self, open_ai_key: str, use_helicone: bool = False) -> None:
        self.open_ai_key = open_ai_key
        if use_helicone:
            self.base_url = "https://oai.hconeai.com/v1"
        else:
            self.base_url = "https://api.openai.com/v1"

    @check_key_decorator
    def embed_text(self, text: str) -> List[int]:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.open_ai_key}",
        }
        json_data = {
            "input": text,
            "model": "text-embedding-ada-002",
        }
        response = requests.post(f"{self.base_url}/embeddings", headers=headers, json=json_data)
        return response.json()["data"][0]["embedding"]
