"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const log_js_1 = require("../functions/log.js");
const validate_js_1 = require("../functions/validate.js");
const config = require("../files/config.json");
const roles = require("../files/roles.json");
const command = {
    bigDescription: ("This command assigns a user a role that will let them be alerted when the bot updates. (**Note**: This command cannot be used in a DM.)\n"
        + "Returns:\n\t"
        + config.returnsDM),
    description: "Provides the user a role so they can know when the bot updates.",
    enabled: true,
    fullName: "Alert Me",
    name: "alertme",
    permissionLevel: "normal"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.fullName, message);
    }
    if (dmCheck_js_1.run(message, command.fullName))
        return;
    validate_js_1.role(roles.alertMe, command.fullName);
    var toUpdate = message.member;
    let serverRoles = message.guild.roles;
    let prefix = config.prefix;
    if (toUpdate.roles.some(r => [roles.alertMe.ID].includes(r.id))) {
        log_js_1.debug(`${message.author.username} already has the ${roles.alertMe.name} role.`
            + ` Removing role now.`);
        let role = serverRoles.get(roles.alertMe.ID);
        try {
            await toUpdate.removeRole(role);
        }
        catch (error) {
            log_js_1.error(error);
            await message.react(config.fail);
            return message.channel.send(`*${error.toString()}*`);
        }
        let reply = (`${message.author}, you have been removed from the `
            + `${roles.alertMe.name} role.\n`
            + `If you wish to be added back to this role later, please use the `
            + `${prefix}alertMe command in the ${message.guild.name} server.`);
        return message.author.send(reply).catch(error => {
            return disabledDMs_js_1.run(message, reply);
        });
    }
    else {
        log_js_1.debug(`${message.author.username} does not have the ${roles.alertMe.name} `
            + `role. Adding role now.`);
        let role = serverRoles.get(roles.alertMe.ID);
        try {
            await toUpdate.addRole(role);
        }
        catch (error) {
            log_js_1.error(error);
            await message.react(config.fail);
            return message.channel.send(`*${error.toString()}*`);
        }
        await message.react(config.success);
        let reply = (`${message.author}, you have been added to the `
            + `${roles.alertMe.name} role.\n`
            + `If you wish to be removed from this role later, pleas use the `
            + `${prefix}alertMe command in the ${message.guild.name} server.`);
        return message.author.send(reply).catch(error => {
            return disabledDMs_js_1.run(message, reply);
        });
    }
}
exports.run = run;
exports.help = command;
