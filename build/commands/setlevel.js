"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dmCheck_js_1 = require("../functions/dmCheck.js");
const log_js_1 = require("../functions/log.js");
const userids = require("../files/userids.json");
const command = {
    bigDescription: ("Use this command to set the level of a user to something else.\n"
        + "Required arguments: @{user} -> The user to change the points for.\n"
        + "{int} -> The level to set the user to have.\n"
        + "Returns:\n\t"
        + "This command returns nothing"),
    description: "Changes a mentioned user's level",
    enabled: null,
    fullName: "Set Level",
    name: "setlevel",
    permissionLevel: "owner"
};
async function run(client, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} Command.`);
    if (dmCheck_js_1.run(message, command.name))
        return;
    if (message.author.id !== userids.ownerID) {
        return log_js_1.debug(`Attempted use of ${command.fullName} by ${message.author.username}.\n`);
    }
    let toChange = message.mentions.members.first();
    let newLevel = !!parseInt(message.content.split(" ")[1]) ? parseInt(message.content.split(" ")[1]) : parseInt(message.content.split(" ")[2]);
    if (!toChange) {
        message.channel.send("You must mention someone to update their level");
        return log_js_1.debug("No member was given.\n");
    }
    if (!newLevel) {
        message.channel.send("You must indicate what to set their level to");
        return log_js_1.debug("No new value was given.\n");
    }
    let row = await sql.getUserRow(toChange.id);
    if (!row) {
        message.channel.send(`I'm sorry, ${message.author}, I am unable to set the level of ${toChange.user.username} `
            + `as they are not currently in the user database.`);
        return log_js_1.debug(`Unable to locate any data for ${toChange.user.username}`);
    }
    if (row.optOut === 1) {
        message.channel.send(`I'm sorry, ${message.author}, I cannot set the level of ${toChange.user.username}, they have opted out`);
        return log_js_1.debug(`Unable to set level of ${toChange.user.username}, they have opted out`);
    }
    let name = toChange.user.username;
    try {
        name = message.guild.members.get(toChange.id).nickname;
        if (!name)
            name = toChange.user.username;
        log_js_1.debug(`Name set to: ${name}`);
    }
    catch (error) {
        name = message.author.username;
        log_js_1.debug(`Unable to get Nickname. Name set to: ${name}`);
    }
    log_js_1.debug(`Setting level for ${name} to ${newLevel} from ${row.level}`);
    sql.setPoints(toChange.id, row.points, newLevel, name);
}
exports.run = run;
exports.help = command;
