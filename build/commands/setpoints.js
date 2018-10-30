"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const userids = require("../files/userids.json");
const command = {
    bigDescription: ("Use this command to set the points of a user to something else.\n"
        + "Required arguments: @{user} -> The user to change the points for.\n"
        + "{int} -> The number of points to set the user to have.\n"
        + "Returns:\n\t"
        + "This command returns nothing"),
    description: "Changes a mentioned user's points",
    enabled: null,
    fullName: "Set Points",
    name: "setpoints",
    permissionLevel: "owner"
};
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} Command.`);
    if (dmCheck_js_1.run(message, command.name))
        return;
    if (message.author.id !== userids.ownerID) {
        return log_js_1.debug(`Attempted use of ${command.name} by ${message.author.username}.\n`);
    }
    var toChange = message.mentions.members.first();
    var amount = !!parseInt(message.content.split(" ")[1]) ? parseInt(message.content.split(" ")[1]) : parseInt(message.content.split(" ")[2]);
    if (!toChange) {
        message.channel.send("You must mention someone to update their points");
        return log_js_1.debug("No member was given.\n");
    }
    if (!amount) {
        message.channel.send("You must indicate what to set their points to");
        return log_js_1.debug("No new value was given.\n");
    }
    let row = await sql.getUserRow(toChange.id);
    if (!row) {
        message.channel.send(`I'm sorry, ${message.author}, I am unable to set the points of ${toChange.user.username} `
            + `as they are not currently in the user database.`);
        return log_js_1.debug(`Unable to locate any data for ${toChange.user.username}`);
    }
    if (row.optOut === 1) {
        message.channel.send(`I'm sorry, ${message.author}, I cannot set the points of ${toChange.user.username} they have opted out`);
        return log_js_1.debug(`Unable to set points of ${toChange.user.username}, they have opted out`);
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
    log_js_1.debug(`Setting points for ${name} to ${amount} from ${row.points}`);
    sql.setPoints(toChange.id, amount, row.level, name);
}
exports.run = run;
exports.help = command;
