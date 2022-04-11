import { Bot } from "grammy";
import { setupBotCommands, setupBotCommandsDescription } from "./tools.js";
import * as dotenv from "dotenv";
const env = dotenv?.config()?.parsed || { BOT_TOKEN: "" };
const BOT_TOKEN = env.BOT_TOKEN;

const bot: Bot = new Bot(BOT_TOKEN);

setupBotCommands(bot);
setupBotCommandsDescription(bot);

bot.start();
