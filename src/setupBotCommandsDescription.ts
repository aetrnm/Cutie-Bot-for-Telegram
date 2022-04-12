import { Bot } from "grammy";

export async function setupBotCommandsDescription(bot: Bot): Promise<void> {
    await bot.api.setMyCommands([
        { command: "help", description: "Show all avialable commands" },
        {
            command: "register",
            description:
                "Register in the game for the cutiest person of the day",
        },
        {
            command: "cutie",
            description: "Finds the cutest person of the day",
        },
        {
            command: "info",
            description: "Get information about the bot",
        },
    ]);
}
