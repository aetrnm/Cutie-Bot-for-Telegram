import * as fs from "fs";
import { ICuteGroup } from "./ICuteGroup";
import { ICuteUser } from "./ICuteUser";
import chalk from "chalk";

export const DBFILENAME = "database.json";

export function registerGroup(ctx) {
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
        fs.writeFile(DBFILENAME, json, { encoding: "utf8", flag: "w" }, () =>
            console.log(
                chalk.green("New group added. Data written successfully. RGF")
            )
        );
        console.log(json);
    }
}

export function addUserToGroup(groupID: number, userID: number) {
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
