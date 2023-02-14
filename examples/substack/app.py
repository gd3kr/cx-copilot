from cx_copilot import OpenAIEmbeddingBlock, PineconeVectorDBBlock, GPTCompletionBlock, CXCopilot
import streamlit as st
import json

embedding = OpenAIEmbeddingBlock(open_ai_key='YOUR_OPENAI_KEY')
database = PineconeVectorDBBlock("YOUR_PINECONE_KEY", "YOUR_PINECONE_DATACENTER")
gpt = GPTCompletionBlock(open_ai_key = 'YOUR_OPENAI_KEY')

def summarize_ticket(ticket):
    prompt_ticket_summarize = """ticket: Hey, I am a substack writer for over a year and a big fan of the platform. Even though my Substack is paid, I would like to offer free subscriptions to some of my users like college students. Can you help me with that?
    question: How do I offer free subscriptions to some of my users like college students?

    ticket: Hello, I am the writer of a substack called Political Polarization and a bunch of readers are public policy students. I think it would be great for me to conduct a poll among my readers to see what kind of topics they want me to cover in the upcoming versions of Substack. Can you show me how to do that in my next Substack?
    question: How do I add a poll for my readers in my Substack?

    ticket: Hi there, I am a big reader on the substack platform and a fan of a bunch of writers who write here. Unfortunately, I am running on a tight budget as I am in between jobs and would like to temporarily cancel my subscription. Can you help me with that?
    question: How can I pause a subscription?

    ticket: {ticket}
    question:""".format(ticket=ticket)

    return gpt.get_completion(prompt=prompt_ticket_summarize, max_tokens=100, temperature=0.3)

def create_hypothetical_answer(question):
    prompt_hypothetical_answer = """Write a passage to answer the following question from a user:
    Question: {question}
    Answer: """.format(question=question)

    return gpt.get_completion(prompt=prompt_hypothetical_answer, max_tokens=400, temperature=0.5, engine="text-curie-001")

def answer_ticket(question="", relevant_info=""):
    prompt_ticket_answer = """ You are a  customer support agent for a company called Substack.
    Below is some relevant information to help you answer this question: ``` {question} ```.
    
    Relevant Information:
    ``` 
    {relevant_info}
    ```

    Based on the information provided, answer the following question: ``` {question} ```. 
    If you do not have enough information to answer the question, please say you do not know the answer. 
    Make sure your response has a friendly tone. 
    Answer:""".format(question=question, relevant_info=get_relevant_info_str(relevant_info))

    st.write(prompt_ticket_answer)
    return gpt.get_completion(prompt=prompt_ticket_answer, max_tokens=500, temperature=0.1)

def get_relevant_info_str(relevant_information):
    relevant_info_str = ""
    for key, value in relevant_information.items():
        relevant_info_str += """ "{question}"
        {answer} """.format(question=value['Question'], answer=value['Answer'], score=value['Score'])
    return relevant_info_str

def get_relevant_information(question, hypothetical_answer):
    embedded_question = embedding.embed_text(question)
    top_k_question = database.lookup(embedded_question, 'substack-answers', top_k=4).ClosestEmbeddings

    # embedded_answer = embedding.embed_text(hypothetical_answer)
    # top_k_answer = database.lookup(embedded_answer, 'substack-answers', top_k=2).ClosestEmbeddings

    return {
        "1" : {
            "Score": top_k_question[0].score,
            "Question" : top_k_question[0].metadata['question'],
            "Answer": top_k_question[0].metadata['value']
        },
        "2" : {
            "Score": top_k_question[1].score,
            "Question" : top_k_question[1].metadata['question'],
            "Answer": top_k_question[1].metadata['value']
        },
        "3" : {
            "Score": top_k_question[2].score,
            "Question" : top_k_question[2].metadata['question'],
            "Answer": top_k_question[2].metadata['value']
        },
        "4" : {
            "Score": top_k_question[3].score,
            "Question" : top_k_question[3].metadata['question'],
            "Answer": top_k_question[3].metadata['value']
        }
    }

def print_relevant_information(relevant_info):
    print("\n [1]: ")
    print("Score: ", relevant_info['1']['Score'])
    print("Question: ", relevant_info['1']['Question'])
    print("Answer: ", relevant_info['1']['Answer'])
    print("\n [2]: ")
    print("Score: ", relevant_info['2']['Score'])
    print("Question: ", relevant_info['2']['Question'])
    print("Answer: ", relevant_info['2']['Answer'])
    print("\n [3]: ")
    print("Score: ", relevant_info['3']['Score'])
    print("Question: ", relevant_info['3']['Question'])
    print("Answer: ", relevant_info['3']['Answer'])
    print("\n [4]: ")
    print("Score: ", relevant_info['4']['Score'])
    print("Question: ", relevant_info['4']['Question'])
    print("Answer: ", relevant_info['4']['Answer'])

def write_relevant_information(relevant_info):
    st.title("Relevant Information")
    for i in range(1, 5):
        st.write(f"[{i}]:")
        st.write("Score: ", relevant_info[str(i)]['Score'])
        st.write("Question: ", relevant_info[str(i)]['Question'])
        st.write("Answer: ", relevant_info[str(i)]['Answer'])

st.title("Substack Help Center")

st.write("This is a help center built for Substack using CX Copilot.")

ticket = st.text_area("How can I help you?")
if (len(ticket) > 0):
    # summarized_ticket = summarize_ticket(ticket)
    hypothetical_answer = create_hypothetical_answer(ticket)
    relevant_info = get_relevant_information(ticket, hypothetical_answer)
    answer = answer_ticket(ticket, relevant_info)
    st.write("Answer: ", answer)