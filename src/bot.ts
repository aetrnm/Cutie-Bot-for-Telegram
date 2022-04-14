import { Bot } from "grammy";
import { config } from "dotenv";
import { commands } from "./botCommands.js";
config();
const BOT_TOKEN = process.env.BOT_TOKEN;

const bot: Bot = new Bot(BOT_TOKEN);

bot.use(commands);

bot.start();
