from typing import Optional
import redis


class Cache:
    def put(self, key: str, value: str):
        pass

    def get(self, key: str, default_value: Optional[str] = None) -> str:
        pass


class RedisCache(Cache):
    instance: redis.Redis = None

    def __init__(self, host: str, port: int, db: int):
        self.instance = redis.Redis(host=host, port=port, db=db)

    def put(self, key: str, value: str):
        self.instance.set(key, value)
        pass

    def get(self, key: str, default_value: Optional[str] = None) -> str:
        result = self.instance.get(key)
        return result or default_value
