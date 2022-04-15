import { Composer } from "grammy";
import * as fs from "fs";
import chalk from "chalk";

import { ICuteGroup } from "./ICuteGroup";
import { DBFILENAME, registerGroup, addUserToGroup } from "./tools.js";

export const commands = new Composer();

commands.command("help", (ctx) => {
    ctx.reply(
        "*Help* \n_List of commands_:\n/help \\- show all avialable commands\n/register \\- register in a cutie of the day game\n/cutie \\- find the cutie of the day\n/info \\- about the bot",
        { parse_mode: "MarkdownV2" }
    );
});

commands.command("cutie", (ctx) => {
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

    const cutiePeriod = 60000; //this time is specified in ms, currently it is one minute
    if (Date.now() - groups[groupIndexInDB].lastCutieGameDate < cutiePeriod) {
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
        console.log(chalk.green("Cutie registered. Data written successfully."))
    );
});

commands.command("register", (ctx) => {
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

commands.command("info", (ctx) => {
    ctx.reply(
        "Bot created by @aetrnm \nGithub repository: https://github.com/aetrnm/Cutie-Bot-for-Telegram",
        { disable_web_page_preview: true }
    );
});
