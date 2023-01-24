from __future__ import annotations

from cx_copilot import (
    CXCopilot,
    FrontConversationRepository,
    GPTCompletionBlock,
    OpenAIEmbeddingBlock,
    PineconeVectorDBBlock,
    RedisCache,
)

# op = OpenAIEmbeddingBlock(open_ai_key='YOUR_OPEN_AI_KEY')
# vec = op.embed_text('hello, please help me reset my account password')
# db = PineconeVectorDBBlock("YOUR_PINECONE_KEY", "us-west1-gcp")
# completion = GPTCompletionBlock(open_ai_key = 'YOUR_OPEN_AI_KEY')
# cache = RedisCache(host='localhost', port=6379, db=0)
# print(db.lookup(vec, 'YOUR_PINECONE_INDEX').ClosestEmbeddings)
# print(completion.get_completion("What year was San Francisco established?", 2000, 0))
# print(cache.put('test', 'result'))
# print(cache.get('test'))
# print(CXCopilot().cache_block.get('test'))
# print(CXCopilot().ticket_repo.get_conversation_by_id("3").threads[-1])
# print(CXCopilot().get_ticket_response_using_hyde("3", use_cached=False, cache_response=False))
print(
    FrontConversationRepository(
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsic2hhcmVkOioiXSwiaWF0IjoxNjc0NTMwMDM3LCJpc3MiOiJmcm9udCIsInN1YiI6IjA5MTg5MDgzYzNiYzg3ZDYwNzc5IiwianRpIjoiNGNmZmRiMWEwMjg0YWZhMiJ9.13x-dUnSpcbmKADvKj0fdKu--fYzydvy2kt5HmOmkaM"
    )
    .get_conversation_by_id("66281573714")
    .threads
)
