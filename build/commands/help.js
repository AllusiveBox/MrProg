"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const log_js_1 = require("../functions/log.js");
const react_js_1 = require("../functions/react.js");
const config = require("../files/config.json");
const userIDs = require("../files/userids.json");
const command = {
    bigDescription: ("You're a special kind of stupid, aren't you?"),
    description: `This command. Use ${config.prefix}help {commandName} to get additional information on specific commands!`,
    enabled: null,
    fullName: "Help",
    name: "help",
    permissionLevel: "normal"
};
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    let isMod = await hasElevatedPermissions_js_1.run(bot, message, false, sql, true);
    let isAdmin = await hasElevatedPermissions_js_1.run(bot, message, true, sql, true);
    let isOwner = message.author.id === userIDs.ownerID ? true : false;
    if (args[0]) {
        let command = bot.commands.get(args[0].toLowerCase());
        if (command === undefined) {
            log_js_1.debug(`Unable to locate command, ${args[0]}.`);
            let reply = `I am unable to locate command: ${args[0]}.`;
            return message.author.send(reply).catch(error => {
                disabledDMs_js_1.run(message, reply);
            });
        }
        if ((command.help.permissionLevel === "mod") && !(isMod || isAdmin || isOwner))
            return log_js_1.debug(`Not including ${command.help.name}`);
        if ((command.help.permissionLevel === "admin") && !(isAdmin || isOwner))
            return log_js_1.debug(`Not including ${command.help.name}`);
        if ((command.help.permissionLevel === "owner") && !isOwner)
            return log_js_1.debug(`Not including ${command.help.name}`);
        log_js_1.debug(`Generating help message for ${message.author.username} for the ${args[0]} command.`);
        return message.author.send(command.help.bigDescription).catch(error => {
            disabledDMs_js_1.run(message, `I am sorry, ${message.author}, I am unable to DM you.\n`
                + `Please check your privacy settings and try again.`);
        });
    }
    let reply = "**__A list of My Commands__**\n\n";
    let alreadyFailed = false;
    bot.commands.forEach(function (command) {
        if (command.help.enabled == false)
            return;
        if ((command.help.permissionLevel === "mod") && !(isMod || isAdmin || isOwner))
            return log_js_1.debug(`Not including ${command.help.name}`);
        if ((command.help.permissionLevel === "admin") && !(isAdmin || isOwner))
            return log_js_1.debug(`Not including ${command.help.name}`);
        if ((command.help.permissionLevel === "owner") && !isOwner)
            return log_js_1.debug(`Not including ${command.help.name}`);
        let nextCommand = (`**${command.help.name}:\n\t**`
            + `${command.help.description}\n`);
        if (reply.length + nextCommand.length < 2000) {
            reply = (`${reply}${nextCommand}`);
        }
        else {
            message.author.send(reply).catch(error => {
                if (!alreadyFailed) {
                    disabledDMs_js_1.run(message, `I am sorry, ${message.author}, I am unable to DM you.\n`
                        + `Please check your privacy settings and try again.`);
                    alreadyFailed = true;
                    console.log(alreadyFailed);
                    return react_js_1.run(message, false);
                }
            });
            reply = nextCommand;
        }
    });
    return message.author.send(reply).then(function () {
        react_js_1.run(message);
    }).catch(error => {
        if (alreadyFailed)
            return;
        disabledDMs_js_1.run(message, `I am sorry, ${message.author}, I am unable to DM you.\n`
            + `Please check your privacy settings and try again.`);
        console.log(alreadyFailed);
        return react_js_1.run(message, false);
    });
}
exports.run = run;
exports.help = command;
