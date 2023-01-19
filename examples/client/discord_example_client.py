from __future__ import annotations

import asyncio

import discord

bot = discord.Bot()

from cx_copilot import CXCopilot

bot = discord.Bot()

cx = CXCopilot()


@bot.slash_command(name="autofill")
async def autofill(ctx):
    reply = cx.get_ticket_response(ctx.channel_id, cache_response=True, use_cached=True)
    await ctx.respond(reply, ephemeral=True)


bot.run("DISCORD_BOT_CODE")
