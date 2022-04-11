import { Bot } from "grammy";
import * as fs from "fs";
import { ICuteGroup } from "./ICuteGroup";
import { ICuteUser } from "./ICuteUser";
import chalk from "chalk";

const DBFILENAME = "database.json";

export async function setupBotCommandsDescription(bot: Bot): Promise<void> {
    await bot.api.setMyCommands([
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

function registerGroup(ctx) {
    const groupID = ctx.chat.id;
    const rawdata = fs.readFileSync(DBFILENAME, "utf8");
    const groups: Array<ICuteGroup> = JSON.parse(rawdata);
    const newGroup: ICuteGroup = {
        id: groupID,
        groupMembers: [],
    };

    const groupIndexInDB: number = groups.findIndex(
        (group) => group.id === groupID
    );

    if (groupIndexInDB === -1) {
        groups.push(newGroup);
        ctx.reply("Group DIDN'T exist. Group created.");
        const json = JSON.stringify(groups);
        fs.writeFile(DBFILENAME, json, "utf8", () =>
            console.log(
                chalk.green("New group added. Data written successfully. RGF")
            )
        );
        console.log(json);
    }
}

function addUserToGroup(groupID: number, userID: number) {
    const newUser: ICuteUser = { id: userID, cuteCounter: 0 };

    const rawdata = fs.readFileSync(DBFILENAME, "utf8");
    const groups: Array<ICuteGroup> = JSON.parse(rawdata);
    const groupIndexInDB: number = groups.findIndex(
        (group) => group.id === groupID
    );
    groups[groupIndexInDB].groupMembers.push(newUser);
    const json = JSON.stringify(groups);
    fs.writeFile(DBFILENAME, json, "utf8", () =>
        console.log(chalk.green("New user added. Data written successfully."))
    );
}

export function setupBotCommands(bot: Bot) {
    bot.command("help", (ctx) => {
        ctx.reply("*Help* \n_List of commands_:", { parse_mode: "MarkdownV2" });
    });

    bot.command("cutie", (ctx) => {
        const groupID = ctx.chat.id;
        const rawdata = fs.readFileSync(DBFILENAME, "utf8");
        const groups: Array<ICuteGroup> = JSON.parse(rawdata);

        const groupIndexInDB: number = groups.findIndex(
            (group) => group.id === groupID
        );
        if (groupIndexInDB === -1) {
            ctx.reply(
                "You should be registered in the game first!\nUse /register command."
            );
            return;
        }
        function getRandomInt(max: number) {
            return Math.floor(Math.random() * max);
        }

        const numberOfMembers = groups[groupIndexInDB].groupMembers.length;
        const cutieIndex = getRandomInt(numberOfMembers);
        const cutieID = groups[groupIndexInDB].groupMembers[cutieIndex].id;
        groups[groupIndexInDB].groupMembers[cutieIndex].cuteCounter++;
        ctx.getChatMember(cutieID).then((member) =>
            ctx.reply(`@${member.user.username} is a cutie`)
        );
        const json = JSON.stringify(groups);
        fs.writeFile(DBFILENAME, json, { encoding: "utf8", flag: "w" }, () =>
            console.log(
                chalk.green("Cutie registered. Data written successfully.")
            )
        );

        console.log(json);
    });

    bot.command("register", (ctx) => {
        const userID = ctx.from.id;
        const groupID = ctx.chat.id;
        const rawdata = fs.readFileSync(DBFILENAME, "utf8");
        const groups: Array<ICuteGroup> = JSON.parse(rawdata);

        const groupIndexInDB: number = groups.findIndex(
            (group) => group.id === groupID
        );
        if (groupIndexInDB === -1) {
            registerGroup(ctx);
            addUserToGroup(groupID, userID);
            return;
        }

        const group: ICuteGroup = groups[groupIndexInDB];
        const userInGroup = group.groupMembers.findIndex(
            (user) => user.id === userID
        );

        if (userInGroup === -1) {
            addUserToGroup(groupID, userID);
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
