from __future__ import annotations

from cx_copilot import TestPipeline


class TestPip(TestPipeline):
    @classmethod
    def setup(self):
        self.setUpClass()
