from helpers import pinecone_connect
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import SentenceTransformerEmbeddings


def follow_on(context, previous_statement, agent_personality):

    print(f'context {context}')
    print(f'agent_personality {agent_personality}')

    context = context[0:150]

    query_string = '''
    {agent_personality}

    Respond to the following statment, specifically referenceing the supplied context.  Limit the response to three sentences.

    Statement: 
    {previous_statement}

    Context: 
    {context}

    '''. format(agent_personality=agent_personality, context=context, previous_statement=previous_statement)

    reaction = []

    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=1)
    return llm.call_as_llm(query_string)


def multi_agent(topic, agent_a_personality, agent_b_personality, lpa):

    print(f'topic {topic}')

    print(f'lpa {lpa}')
    index = pinecone_connect()

    embedding_model = SentenceTransformerEmbeddings(
        model_name="all-MiniLM-L6-v2")
    query = embedding_model.embed_documents(
        [topic],
    )

    lpa_results = index.query(
        vector=query,
        filter={
            "LPA": {"$eq": lpa + '.txt'},
        },
        top_k=8,
        include_metadata=True
    )

    context = ''
    for match in lpa_results['matches'][0:8]:

        if (match['score'] > 0.3):
            context += match['metadata']['text'] + '\n'
        else:
            context += f'{lpa} does not have a detailed policy on {topic}' + '\n'

    query_string = '''
    {agent_a_personality}

    Respond stating what you think about the following context, referencing it specifically. Limit the response to three sentences. 

    Context: 
    {context}

    '''. format(agent_a_personality=agent_a_personality, context=context)

    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=1)
    llm_result = llm.call_as_llm(query_string)
    reaction = {'reaction': llm_result, 'agent': 'a', 'context': context}

    return reaction
