import { Bot } from "grammy";
import { setupBotCommandsDescription, setupBotCommands } from "./tools";
import * as dotenv from "dotenv";
const env = dotenv?.config()?.parsed || { BOT_TOKEN: "" };
const BOT_TOKEN = env.BOT_TOKEN;

const bot: Bot = new Bot(BOT_TOKEN);

setupBotCommands(bot);
setupBotCommandsDescription(bot);

bot.on("message", (ctx) => ctx.reply("Got another message!"));

bot.start();
