from cx_copilot import OpenAIEmbeddingBlock, PineconeVectorDBBlock

op = OpenAIEmbeddingBlock(open_ai_key='YOUR_OPEN_AI_KEY')
vec = op.embed_text('hello, please help me reset my account password')
db = PineconeVectorDBBlock("YOUR_PINECONE_KEY", "us-west1-gcp")

print(db.lookup(vec, 'YOUR_PINECONE_INDEX').ClosestEmbeddings)