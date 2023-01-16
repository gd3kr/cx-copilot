from __future__ import annotations

import asyncio

import discord

bot = discord.Bot()

from cx_copilot import CXCopilot

bot = discord.Bot()

cx = CXCopilot()
# rest = hikari.RESTApp()
# rest.start()
#
#
# # bot = hikari.GatewayBot(token="MTA2MzMxODAyMDAxMDgxNTU0OA.G5sZ9Y.v741Y260QVmuGjsn1mdSfb5WPuMBEBXWgF1yCo")
# #
# # @bot.listen()
# # async def ping(event: hikari.GuildMessageCreateEvent) -> None:
# #     """If a non-bot user mentions your bot, respond with 'Pong!'."""
# #
# #     # Do not respond to bots nor webhooks pinging us, only user accounts
# #     if not event.is_human:
# #         return
# #
# #     me = bot.get_me()
# #
# #     if me.id in event.message.user_mentions_ids:
# #         await event.message.respond("Pong!")
# #
# # bot.run()
#
# async def print_my_user(token):
#     await rest.start()
#     # We acquire a client with a given token. This allows one REST app instance
#     # with one internal connection pool to be reused.
#     async with rest.acquire(token, token_type="Bot") as loc:
#         my_user = await loc.fetch_channel(1063326511354101910)
#         # threads = await loc.fetch_active_threads(my_user[0].id)
#         messages = await loc.fetch_messages(my_user.id)
#         print(messages)


# asyncio.run(print_my_user("MTA2MzMxODAyMDAxMDgxNTU0OA.G5sZ9Y.v741Y260QVmuGjsn1mdSfb5WPuMBEBXWgF1yCo"))


@bot.slash_command(
    name="autofill"
)  # Add the guild ids in which the slash command will appear. If it should be in all, remove the argument, but note that it will take some time (up to an hour) to register the command if it's for all guilds.
async def autofill(ctx):
    reply = cx.get_ticket_response(ctx.channel_id, cache_response=True, use_cached=True)
    await ctx.respond(reply, ephemeral=True)


#
# @tree.command(
#     name="cx",
#     description="Summon copilot to generate ephemeral message based on the thread text",
# )
# async def slash_command(interact: discord.Interaction):
#     reply = cx.get_ticket_response(interact.channel_id)
#     await interact.response.send_message(reply)
#
#
# @client.event
# async def on_ready():
#     await tree.sync()
#     print("Ready!")


# loop = asyncio.get_running_loop()
# loop.create_task(client.start(token=""))
bot.run("DISCORD_BOT_CODE")
