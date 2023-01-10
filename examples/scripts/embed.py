from cx_copilot import OpenAIEmbeddingBlock, PineconeVectorDBBlock, GPTCompletionBlock

op = OpenAIEmbeddingBlock(open_ai_key='YOUR_OPEN_AI_KEY')
vec = op.embed_text('hello, please help me reset my account password')
db = PineconeVectorDBBlock("YOUR_PINECONE_KEY", "us-west1-gcp")
completion = GPTCompletionBlock(open_ai_key = 'YOUR_OPEN_AI_KEY')

print(db.lookup(vec, 'YOUR_PINECONE_INDEX').ClosestEmbeddings)
print(completion.get_completion("What year was San Francisco established?", 2000, 0))