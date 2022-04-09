import { Bot } from "grammy";

export async function setupBotCommandsDescription(bot: Bot): Promise<void> {
    await bot.api.setMyCommands([
        { command: "start", description: "Start the bot" },
        { command: "help", description: "Show all avialable commands" },
        {
            command: "cutie",
            description: "Finds the cutest person of the day",
        },
        {
            command: "register",
            description:
                "Register in the game for the cutiest person of the day",
        },
    ]);
}

export function setupBotCommands(bot: Bot) {
    bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));

    bot.command("help", (ctx) => {
        ctx.reply("*Help* \n_List of commands_:", { parse_mode: "MarkdownV2" });
    });

    bot.command("cutie", (ctx) => {
        ctx.reply("Today the cutie is @aetrnm");
    });

    bot.command("register", (ctx) => {
        ctx.reply(
            "Successfully registered " +
                ctx.from.id +
                "for a chat " +
                ctx.chat.id
        );
    });
}
