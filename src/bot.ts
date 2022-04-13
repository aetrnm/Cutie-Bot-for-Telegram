import { Bot } from "grammy";
import { setupBotCommands } from "./setupBotCommands.js";
import { setupBotCommandsDescription } from "./setupBotCommandsDescription.js";
import { config } from "dotenv";
config();
const BOT_TOKEN = process.env.BOT_TOKEN;

const bot: Bot = new Bot(BOT_TOKEN);

setupBotCommands(bot);
setupBotCommandsDescription(bot);

bot.start();
