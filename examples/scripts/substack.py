from cx_copilot import OpenAIEmbeddingBlock, PineconeVectorDBBlock, GPTCompletionBlock, RedisCache, CXCopilot

op = OpenAIEmbeddingBlock(open_ai_key='YOUR_OPENAI_KEY')
db = PineconeVectorDBBlock("YOUR_OPENAI_KEY")
completion = GPTCompletionBlock(open_ai_key = 'YOUR_OPENAI_KEY')

ticket = "Someone just copied my Substack and republished it under their name. What should I do?"

embedded_ticket = op.embed_text(ticket)

closest_embeddings = db.lookup(embedded_ticket, 'substack').ClosestEmbeddings

#metadata = [embed['metadata'] for embed in closest_embeddings]

o = closest_embeddings[0].metadata
# print("\nQuestion\n", o['question'], "\n\nAnswer\n", o['value'])

prompt_template = """You are a customer support agent for a company called Substack. Substack lets independent writers and podcasters 
publish directly to their audience and get paid through subscriptions. Write an email response to this question from a customer:\n\n
{customer_ticket} \n

To help you answer the customer's question, here is some relevant information on the topic: \n
{relevant_topic}\n
{relevant_information}\n

Identify the customer's problem. Then look for an answer to the problem in relevant information. Let's think step by step.
Your response:"""

prompt = prompt_template.format(customer_ticket=ticket, relevant_topic=o['question'], relevant_information=o['value'])
print("\n Prompt:\n", prompt)
response = completion.get_completion(prompt=prompt, temperature=0, max_tokens=2000)
print("\n\n Response:\n", response)