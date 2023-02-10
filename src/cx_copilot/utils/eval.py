from __future__ import annotations

import unittest
from dataclasses import dataclass
from typing import List, TypedDict

from ..blocks.completion import GPTCompletionBlock

_PROMPT = (
    "You are a test agent responsible for determining if two responses to a question are similar in quality. Respond with a match store ranging from [0-100]. \n"
    "The question is {question} \n"
    "The expected answer is {expected_response} \n"
    "The generated answer is {actual_response} \n"
    "The match score between 0-100 is: "
)


class TestExample(TypedDict):
    question: str
    expected_response: str


class TestPipeline(unittest.TestCase):
    example_list: list[TestExample] = []
    pipeline_response_generator = None
    score_treshold = 0
    gpt_block = None

    @classmethod
    def setUpClass(cls, open_ai_key="", pipeline_response_gen=None, score_threshold=50, examples=[]):
        cls.gpt_block = GPTCompletionBlock(open_ai_key=open_ai_key)
        cls.score_treshold = score_threshold
        cls.pipeline_response_generator = pipeline_response_gen
        cls.example_list = examples

    def test_examples(self):
        for testcase in self.example_list:
            res = self._test_example(testcase)
            self.assertGreater(self.score_treshold, int(res), f"test failed. question failure {testcase['question']}")

    def _test_example(self, test_case: TestExample):
        generated_response = self.pipeline_response_generator(test_case["question"])
        expected = test_case["expected_response"]
        prompt = _PROMPT.format(
            question=test_case["question"], expected_response=expected, actual_response=generated_response
        )
        res = self.gpt_block.get_completion(prompt)
        return res
