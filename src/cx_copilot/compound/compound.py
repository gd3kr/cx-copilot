from typing import Optional, Dict
import redis
from envyaml import EnvYAML
from ..blocks.cache import Cache, RedisCache
from ..blocks.tickets import ConversationRepository, HelpscoutConversationRepository


class CXCopilot:
    cache_block: Cache
    ticket_repo: ConversationRepository

    def __init_cache__(self, yaml: EnvYAML):
        cache_config: Optional[Dict] = yaml.get('cache')
        if cache_config is None:
            return

        if cache_config['type'] == 'redis':
            host = cache_config['host']
            port = cache_config['port']
            db = cache_config['db']
            self.cache_block = RedisCache(host=host, port=port, db=db)

    def __init_ticket_repo__(self, yaml: EnvYAML):
        ticket_config: Optional[Dict] = yaml.get('ticketing')
        if ticket_config is None:
            return

        if ticket_config['type'] == 'helpscout':
            app_id = ticket_config['app_id']
            secret = ticket_config['secret']
            self.ticket_repo = HelpscoutConversationRepository(app_id=app_id, app_secret=secret)

    def __init__(self, path='copilot_config.yml'):
        env = EnvYAML(path)
        self.__init_cache__(env)
        self.__init_ticket_repo__(env)
