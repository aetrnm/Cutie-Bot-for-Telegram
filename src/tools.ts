import { Bot } from "grammy";
import * as groups from "./database.json";
import * as fs from "fs";
import { ICuteGroup } from "./ICuteGroup";
import { ICuteUser } from "./ICuteUser";

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
        {
            command: "info",
            description: "Get information about the bot",
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
        const userID: number = ctx.from.id;
        const groupID: number = ctx.chat.id;
        const dbGroups: Array<ICuteGroup> = groups;

        const newUser: ICuteUser = { id: userID, cuteCounter: 0 };
        const newGroup: ICuteGroup = {
            id: groupID,
            groupMembers: [newUser],
        };

        const chatIndexInDB: number = dbGroups.findIndex(
            (group) => group.id === groupID
        );

        if (chatIndexInDB === -1) {
            dbGroups.push(newGroup);
            ctx.reply("Group DOESN'T exists. Group created. User added");
            const json = JSON.stringify(dbGroups);
            fs.writeFile("database.json", json, "utf8", () =>
                console.log("Data written successfully")
            );
            return;
        }

        const group: ICuteGroup = dbGroups[chatIndexInDB];
        const userInGroup = group.groupMembers.findIndex(
            (user) => user.id === userID
        );

        if (userInGroup === -1) {
            group.groupMembers.push(newUser);
            dbGroups[chatIndexInDB] = group;
            ctx.reply("Group exists. User added");
            const json = JSON.stringify(dbGroups);
            fs.writeFile("database.json", json, "utf8", () =>
                console.log("Data written successfully")
            );

            return;
        }

        ctx.reply("You are already registered!");
    });

    bot.command("info", (ctx) => {
        ctx.reply(
            "Bot created by @aetrnm \nGithub repository: https://github.com/aetrnm/TGbot/tree/master",
            { disable_web_page_preview: true }
        );
    });
}
