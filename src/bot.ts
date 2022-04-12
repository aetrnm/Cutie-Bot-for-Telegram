import { Bot } from "grammy";
import { setupBotCommands } from "./setupBotCommands";
import { setupBotCommandsDescription } from "./setupBotCommandsDescription";
import * as dotenv from "dotenv";
const env = dotenv?.config()?.parsed || { BOT_TOKEN: "" };
const BOT_TOKEN = env.BOT_TOKEN;

const bot: Bot = new Bot(BOT_TOKEN);

setupBotCommands(bot);
setupBotCommandsDescription(bot);

bot.start();
