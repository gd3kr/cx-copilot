# cx-copilot

🤖 Empower your CX team with open-source AI-powered response auto-drafting. 🤖

## 🤔 What is cx-copilot?

An open source library that lets you leverage LLMs and latest advancements in AI to automate customer support interactions. By connecting a Large Language Model (LLM) to your knowledge base and historical support tickets via embeddings & vector searching, you can accurately auto-draft responses to all customer requests.

## 🖥 Where can it be used?

You can use cx-copilot to auto-draft responses in Helpdesk, Intercom, Support Inboxes, Zendesk, and anywhere else you store & respond to customer requests.

## ⚡️ Installation



## 🚀 Live Demo



## 📖 How does it work?

The basis of cx-copilot is embedding, vector storing and vector searching. Vector embeddings are a way to represent text as a series of numbers in such a way that you can perform mathematical operations, such as similarity comparison. By first embedding all previous historical customer request tickets using an embedding model (like [text-embedding-ada-002](https://openai.com/blog/new-and-improved-embedding-model/) from OpenAI) and storing the embeddings & the paired response from your company in a vector database, you can then perform a vector search for incoming support tickets, returning the closest-matching tickets based on cosine similarity. The final step is to prompt a Large Language Model (LLM) with your team's responses to the closest-matching historical tickets, generating an auto-drafted response which will answer your customer’s query while conforming to your tone & formatting tendencies.

## 🧰 Integrations

| Integrations |  |
|-------|---------|
| <img src="https://style.helpscout.com/images/logo/help-scout-logo-circle-blue.svg" alt="Helpscout logo" height="50px"> | Helpscout |
| <img src="https://www.svgrepo.com/download/303161/gmail-icon-logo.svg" alt="Gmail logo" height="50px"> | Gmail |
| <img src="https://cdn.worldvectorlogo.com/logos/intercom-1.svg" alt="Intercom logo" height="50px"> | Intercom (coming soon) |
| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Zendesk_logo.svg/2560px-Zendesk_logo.svg.png" alt="Zendesk logo" height="50px"> | Zendesk (coming soon) |
| <img src="https://www.svgrepo.com/show/353655/discord-icon.svg" alt="Discord logo" height="50px"> | Discord (coming soon) |

## 📱 Community

Join the [Discord community for cx-copilot](https://discord.gg/XhPnzxhm6y) for support & project updates.

## 👩‍💻 Contributing

### Installation
To install this package, simply run the following command:

```
pip install cx_copilot
```

To install for local development use:

```
flit install [--symlink] [--python path/to/python]
```


### Development
This package is built on top of abstract classes that can be implemented for different customer support ticket providers. This ensures interoperability and allows for easy development. There are examples of how to use each of these classes in the `examples` directory. The source code for the package is located in the `src` directory.

Please always create base classes and implement them for specific use cases.

For example:

The cache class is an abstract class with the following definition:

```
class Cache:
    def put(self, key: str, value: str):
        pass

    def get(self, key: str, default_value: Optional[str] = None) -> str:
        pass
```

And the redis class implements that abstract class with the following definition

```
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
```

so our compound block can be agnostic on which provider to use. It's set during initialization.

```
 def get_ticket_response(self, ticket_id: str, use_cached=True, cache_response=True, max_tokens=2000):
        content = self.ticket_repo.get_conversation_by_id(conversation_id=ticket_id)
        if use_cached:
            try:
                value = self.cache_block.get(ticket_id)
                if value is not None:
                    return value
            except Exception:
                pass
```

Whenever introducing a new block either follow the abstract classes already defined or introduce a new one.


### Usages

The examples and client directory has some rich examples of how to use this library. For instance under the examples/client/discord_example_client.py you can see an example of a discord bot that you can deploy to answer support queries.

```
@bot.slash_command(name="autofill")
async def autofill(ctx):
    reply = cx.get_ticket_response(ctx.channel_id, cache_response=True, use_cached=True)
    await ctx.respond(reply, ephemeral=True)
```

Please create a PR with your changes. Once merged, a GitHub action will bump up the minor version. For major version changes, please contact the contributors(eng@caesarhq.com).

# 🚀 Deployment

If you are having issues self hosting, we offer a deployed version. Please contact us at eng@caesarhq.com.
