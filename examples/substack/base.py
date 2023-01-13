from cx_copilot import OpenAIEmbeddingBlock, PineconeVectorDBBlock, GPTCompletionBlock, CXCopilot

op = OpenAIEmbeddingBlock(open_ai_key='YOUR_OPENAI_KEY')
db = PineconeVectorDBBlock("YOUR_PINECONE_KEY", "YOUR_PINECONE_DC")
completion = GPTCompletionBlock(open_ai_key = 'YOUR_OPENAI_KEY')

ticket = """Hello, My name is Curtis. I have a substack called Unfettered Reservations that has over 50,000 readers.
There are some users who I would like to offer a complimentary subscription. How do I do that? Please let me know."""

embedded_ticket = op.embed_text(ticket)

closest_embeddings = db.lookup(embedded_ticket, 'substack').ClosestEmbeddings

o = closest_embeddings[0].metadata

prompt_template_1 = """You are a customer support agent for a company called Substack. Substack lets independent writers and podcasters 
publish directly to their audience and get paid through subscriptions. Write an email response to this question from a customer:\n\n
{customer_ticket} \n

To help you answer the customer's question, here is some relevant information on the topic: \n
{relevant_topic}\n
{relevant_information}\n

Identify the customer's problem. Then look for an answer to the problem in relevant information. Let's think step by step.
Your response:"""


example_ticket = {
    "question": """Hello,
    Someone has copied my entire substack and republished it under their name.\n What should I do? Please help!\n 
    Thanks,
    Rahul""",
    "question_summary": "Someone has plagiarized or copied user's substack blog",
    "relevant_info": """Hi,\n someone has copied my entire substack and republished it under their name.\n What should I do? Please help!\n Thanks, Rahul"
Relevant Information: "
What to do when your work’s been copied.
So someone’s taken your article, copied and pasted it, and slapped their name on it elsewhere on the web. You’ve asked them to take down your work to no avail. What’s a writer to do? It’s probably a good idea to talk to a lawyer (more on that below), but we’ve compiled some useful information here to help get you situated.
Your First Stop: Shaming.
Falsely claiming authorship of someone else’s writing is plagiarism. It’s not always unlawful, but it’s very often wrongful — the type of bad act that damages reputations and careers. When your plagiarist is a big name or has a big platform, calling them out might be enough to resolve your problem. You get the recognition you deserve; your plagiarist gets the scorn they’ve got coming.
Next Up: Copyright.
But many times you’re not dealing with a big name, or someone with any shame at all. The good news is that copying someone else’s writing, as plagiarists tend to do, will often be copyright infringement. Copyright infringement is against the law, and copyright owners have a variety of legal tools at their disposal to help fix it. 
Copyright ownership happens automatically and instantly; it’s a right you get when you create original work. Thanks to copyright treaties, most people in the world get rights in most countries — no paperwork required.
Takedowns and the Digital Millennium Copyright Act (DMCA).
Platforms have a strong incentive to remove content when they receive a valid copyright takedown notice (often called a “DMCA notice” after the U.S. law). Find a platform’s copyright policy and send a notice that meets their requirements — this will be enough to see content removed from many reputable hosts. If your infringer is on Substack, let us know ASAP!
Delisting on Google.
Even when the host platform doesn’t respond to a takedown notice, Google Search (and other search engines) might. This doesn’t remove anything from the internet, but it can make the offending content less visible in search results. Google provides a form where you can submit a DMCA notice here. 
Finally: Legal Action.
Depending on the details, your infringer might be on the hook for significant money damages. Talking to a lawyer is the first step to thinking through whether a legal claim is worth it. 
A word to U.S. writers: whether or not you have already registered your work with the Copyright Office might be make-or-break on whether it’s worth your time to go to court. Copyright is automatic, but the U.S. has rules that disadvantage copyright owners who don’t register their work with the U.S. Copyright Office. For Americans, registration is a requirement before suing for infringement, and doing it early is key to securing the right to “statutory damages” — something that can be essential to the financial viability of a lawsuit. 
Registering everything you write individually probably won’t make practical or financial sense, but there are bulk registration options and for that certain special piece, the minor inconvenience and small filing fee might be worth it.
You might have limited options.
The internet is vast, and it can be expensive to enforce your rights. Different countries have different laws and different commitments to the rule of law. Ever met someone with a harddrive full of torrented Hollywood movies? The same realities that make it hard for big industry players to stave off infringement are going to make it difficult for you as well. Depending on where your infringer is based, practical options might be limited. Still, don’t assume you don’t have any options — many writers get their plagiarists to take content down or pay damages every year.""",
    "reasoning": """The User has a complaint about someone plagiarizing their substack blog. According to the relevant information provided, the recommended actions
    are to 1.Shame the person who copied and plagiarized the work. \n 2. Make a copyright claim. DMCA protects most users in most countries without paperwork. \n
    3. Legal Action.  Talking to a lawyer is the first step to thinking through whether a legal claim is worth it. 
    """,
    "response": """Hi Rahul,\n
    
    Thank you for reaching out and we're really sorry that this happened to you. This is a serious issue and we take plagiarism very seriously. \n
    The first step is to try to shame the plagiarist. You can do this by publicly calling them out and asking them to take down your work. If this doesn't work, you may have to take legal action.
    Copyright ownership happens automatically and instantly when you create original work. You can send a takedown notice to the platform hosting the plagiarized work, and you can also submit a DMCA notice to Google Search to make the content less visible in search results.\n
    If the plagiarist is based in the US, you may need to register your work with the US Copyright Office before you can sue for infringement. This is a requirement for claiming statutory damages.
    If you need more help, we suggest consulting a lawyer for guidance on your specific situation. \n
    
    We hope this information is helpful. Please let us know if you have any other questions.\n
    
    Best,\n
    Chris from Substack
    """,

}

prompt_template_2 = """You are a customer support agent for a company called Substack. Substack lets independent writers and podcasters 
publish directly to their audience and get paid through subscriptions. Write an email responses to customer's questions by making use 
of relevant information provided to you.\n\n

== TICKET 1 ==

Question: " {example_question} " \n 
Relevant Information: " {example_relevant_information}" \n
Question Summary: " {example_question_summary} "
Reasoning: " {example_reasoning} " \n
Your Response: " {example_response}" \n

== TICKET 2 == 

Question: " {customer_question} " \n 
Relevant Information: {customer_relevant_information} \n
Question Summary:"""

customer_relevant_information=o['question'] + "\n" + o["value"]

prompt = prompt_template_2.format(example_question=example_ticket["question"],
                                  example_question_summary=example_ticket["question_summary"],
                                  example_relevant_information=example_ticket["relevant_info"],
                                  example_reasoning=example_ticket["reasoning"],
                                  example_response=example_ticket["response"],
                                  customer_question=ticket,
                                  customer_relevant_information=customer_relevant_information)

print("\n Prompt:\n", prompt)
response = completion.get_completion(prompt=prompt, temperature=0, max_tokens=800)

print(response)