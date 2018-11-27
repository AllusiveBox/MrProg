"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const log_js_1 = require("../functions/log.js");
const react_js_1 = require("../functions/react.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("Returns what permissions the mentioned user has, or for the user if nobody was mentioned\n"
        + "Arguments:\n\t"
        + "@{user} -> The user you wish to look up permissions for (Optional).\n"
        + "Returns:\n\t" + config.returnsDM),
    description: "Returns a user's permissions",
    enabled: true,
    fullName: "Permissions",
    name: "permissions",
    permissionLevel: "normal"
};
async function run(client, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} Command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.fullName, message);
    }
    let toCheck;
    let user;
    try {
        toCheck = message.mentions.members.first();
        user = toCheck.user.username;
    }
    catch (error) {
        toCheck = message.author;
        user = toCheck.username;
    }
    log_js_1.debug(`Checking user permissions for ${user}`);
    let row = await sql.getUserRow(toCheck.id);
    if (!row) {
        log_js_1.debug(`${user} does not exist in database`);
        await react_js_1.run(message, false);
        return message.channel.send(`I am unable to locate data on ${user}.`);
    }
    let clearanceLevel = row.clearance;
    if (!clearanceLevel) {
        clearanceLevel = "none";
    }
    let reply = `The Permissions level for ${toCheck} is: **${clearanceLevel}**`;
    await react_js_1.run(message);
    return message.author.send(reply).catch(error => {
        return disabledDMs_js_1.run(message, reply);
    });
}
exports.run = run;
exports.help = command;
