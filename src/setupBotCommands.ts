import { Bot } from "grammy";
import * as fs from "fs";
import { ICuteGroup } from "./ICuteGroup";
import chalk from "chalk";
import { DBFILENAME, registerGroup, addUserToGroup } from "./tools.js";

export function setupBotCommands(bot: Bot) {
    bot.command("help", (ctx) => {
        ctx.reply(
            "*Help* \n_List of commands_:\n/help \\- show all avialable commands\n/register \\- register in a cutie of the day game\n/cutie \\- find the cutie of the day\n/info \\- about the bot",
            { parse_mode: "MarkdownV2" }
        );
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

        if (groups[groupIndexInDB].lastCutieGameDate - Date.now() < 86400) {
            return;
        }

        const numberOfPlayers = groups[groupIndexInDB].groupMembers.length;
        const cutieIndex = getRandomInt(numberOfPlayers);
        const cutieID = groups[groupIndexInDB].groupMembers[cutieIndex].id;
        groups[groupIndexInDB].groupMembers[cutieIndex].cuteCounter++;
        groups[groupIndexInDB].lastCutieGameDate = Date.now();
        ctx.getChatMember(cutieID).then((member) =>
            ctx.reply(`@${member.user.username} is a cutie`)
        );
        const json = JSON.stringify(groups);
        fs.writeFile(DBFILENAME, json, { encoding: "utf8", flag: "w" }, () =>
            console.log(
                chalk.green("Cutie registered. Data written successfully.")
            )
        );
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
            ctx.reply("Registered!");
            return;
        }

        const group: ICuteGroup = groups[groupIndexInDB];
        const userInGroup = group.groupMembers.findIndex(
            (user) => user.id === userID
        );

        if (userInGroup === -1) {
            addUserToGroup(groupID, userID);
            ctx.reply("Registered!");
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
