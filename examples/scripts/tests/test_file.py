from __future__ import annotations

from cx_copilot import TestPipeline


def gen_response(question):
    return "fake"


class TestPip(TestPipeline):
    @classmethod
    def setUpClass(cls):
        return super().setUpClass(
            open_ai_key="test",
            examples=[{"question": "How do i get student discount?", "expected_response": "Please send copy of ID"}],
        )

    def pipeline_response_generator(self, question: str):
        return "fake"
