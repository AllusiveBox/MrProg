"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const log_js_1 = require("../functions/log.js");
const validate_js_1 = require("../functions/validate.js");
const react_js_1 = require("../functions/react.js");
const config = require("../files/config.json");
const roles = require("../files/roles.json");
const command = {
    bigDescription: ("This command assigns a user a role that will let them be alerted when there is a tournament, or a tournament related announcement. (**Note**: This command cannot be used in a DM.)\n"
        + "Returns:\n\t"
        + config.returnsDM),
    description: "Assigns the user the Tournament Participant Role.",
    enabled: true,
    fullName: "Dendome",
    name: "dendome",
    permissionLevel: "normal",
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.fullName, message);
    }
    if (await dmCheck_js_1.run(message, command.fullName))
        return;
    validate_js_1.role(command.tournyRole, command.fullName);
    var toUpdate = message.member;
    let serverRoles = message.guild.roles;
    let prefix = config.prefix;
    if (toUpdate.roles.some(r => [roles.tournyRole.ID].includes(r.id))) {
        log_js_1.debug(`${message.author.username} already has the ${roles.tournyRole.name} `
            + `role. Removing role now.`);
        let role = await serverRoles.get(roles.tournyRole.ID);
        try {
            await toUpdate.removeRole(role);
        }
        catch (error) {
            log_js_1.error(error);
            await react_js_1.run(message, false);
            return message.channel.send(`I am sorry, ${message.author}, something`
                + ` went wrong and I was unable to update your roles.`
                + `*${error.toString()}*`);
        }
        let reply = (`${message.author}, you have been removed from the `
            + `${roles.tournyRole.name} role.\n`
            + `If you wish to be added back to this role later, please use the `
            + `${prefix}${command.name} command in the ${message.guild.name} server.`);
        await react_js_1.run(message);
        return message.author.send(reply).catch(error => {
            log_js_1.error(error);
            return disabledDMs_js_1.run(message, reply);
        });
    }
    else {
        log_js_1.debug(`${message.author.username} does not have the ${roles.tournyRole.name} `
            + `role. Adding role now.`);
        let role = await serverRoles.get(roles.tournyRole.ID);
        try {
            await toUpdate.addRole(role);
        }
        catch (error) {
            log_js_1.error(error);
            await react_js_1.run(message, false);
            return message.channel.send(`I am sorry, ${message.author}, something `
                + `went wrong and I was unable to update your roles.`
                + `*${error.toString()}*`);
        }
        let reply = (`${message.author}, you have been added to the `
            + `${roles.tournyRole.name} role.\n`
            + `If you wish to be removed from this role later, please use the `
            + `${prefix}${command.name} command in the ${message.guild.name} server.`);
        await react_js_1.run(message);
        return message.author.send(reply).catch(error => {
            return disabledDMs_js_1.run(message, reply);
        });
    }
}
exports.run = run;
exports.help = command;
