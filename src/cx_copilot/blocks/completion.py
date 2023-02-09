from __future__ import annotations

from typing import List, Optional

import openai

from ..exceptions.exceptions import MissingAPIKeyException


class CompletionBlock:
    def get_completion(self, prompt: str, max_tokens: int, temperature: int) -> str:
        pass


def check_key_decorator(func):
    def wrapper(*args, **kwargs):
        if args[0].open_ai_key is None:
            raise MissingAPIKeyException("OpenAI API key is required for GPT-3 Completion")
        return func(*args, **kwargs)

    return wrapper


class GPTCompletionBlock(CompletionBlock):
    open_ai_key: str | None = None

    def __init__(self, open_ai_key: str, use_helicone: bool = False) -> None:
        self.open_ai_key = open_ai_key
        openai.api_key = open_ai_key
        if use_helicone:
            openai.api_base = "https://oai.hconeai.com/v1"

    @check_key_decorator
    def get_completion(self, prompt: str, max_tokens: int, temperature: int) -> str:
        return (
            openai.Completion.create(
                engine="text-davinci-003", prompt=prompt, max_tokens=max_tokens, temperature=temperature
            )
            .choices[0]
            .text
        )
