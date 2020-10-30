/*
 * Command Name: serverupdates.js
 * Function: Assigns a User the Role to be Alerted with Server Updates
 * Clearance: none
 * Default Enabled: Cannot be Disabled
 * Date Created: 10/30/20
 * Last Updated: 10/30/20
 * Last Updated By: AllusiveBox
 * 
 */

// Load in Required Files
const Discord = require("discord.js");
const config = require("../files/config.json");
const roles = require("../files//roles.json");
const { run: disabledDMs } = require("../functions/disabledDMs.js");
const { run: dmCheck } = require("../functions/dmCheck.js");
const { debug, error: errorLog } = require("../functions/log.js");
const { run: react } = require("../functions/react.js");
const { role: validate } = require("../functions/validate.js");

// Command Variables
const command = {
    bigDescription: ("This command assigns a user a role that will let them be alerted when there is a server update."
        + "(**Note**: This command cannot be used in a DM.)\n"
        + "Returns:\n\t" + config.returnsDM),
    description: "Provides the user a role so they can know when the server updates.",
    enabled: null,
    fullName: "Server Updates",
    name: "serverupdates",
    permissionLevel: "normal",
    serverUpdates: roles.serverUpdates
}

module.exports.run = async (bot, message) => {
    // Debug to the Console
    debug(`I am inside the ${command.fullName} command.`);

    // DM Check
    if (dmCheck(message, command.fullName)) return; // Return on DM Channel

    // Check to see if Role has been Defined or Not
    try {
        validate(command.serverUpdates, command.fullName);
    } catch (error) {
        debug(`Unable to locate role for ${command.fullName} command.`);
        message.channel.send(`I'm sorry ${message.author}, I am unable to update your roles at this time.\n`
            + `Error:\n${error.toString()}`);
        return react(message, false);
    }

    // Find User to Update
    let toUpdate = message.member;

    // Grab Server Role List
    let serverRoles = message.guild.roles.cache;

    // Grab the Current Prefix
    let prefix = config.prefix;

    // Grab the Server Updates Role
    let role = await serverRoles.get(command.serverUpdates.ID);

    if (toUpdate.roles.cache.some(r => [command.serverUpdates.ID].includes(r.id))) {
        debug(`${message.author.username} already has the ${command.serverUpdates.name} role. Removing now.`);

        // Try and Remove the Role
        try {
            await toUpdate.roles.remove(role);
        } catch (error) {
            // Catch the Error and Inform the User
            errorLog(error);
            message.channel.send(`I'm sorry ${message.author}, something went wrong and I was unable to update your roles.`
                + `*${error.toString()}*`);
            // show Failed Command React
            return react(message, false);
        }

        // Build the Reply to the User
        let reply = (`${message.author}, you have been removed from the ${command.serverUpdates.name} role.\n`
            + `If you wish to be added back to this role later, please use the ${prefix}${command.name} command`
            + `in the ${message.guild.name} server.`);

        // Send the Reply
        message.author.send(reply).catch(error => {
            errorLog(error);
            disabledDMs(message, reply);
        });

        // Show Successful Command React
        return react(message);
    } else {
        debug(`${message.author.username} does not have the ${command.serverUpdates.name} role. Adding role now.`);

        // Try and Add the Role
        try {
            await toUpdate.roles.add(role);
        } catch (error) {
            // Catch the Error and Inform the User
            errorLog(error);
            message.channel.send(`I'm sorry ${message.author}, something went wrong and I was unable to update your roles.`
                + `*${error.toString()}*`);
            return react(message, false);
        }

        // Build the Reply to the User
        let reply = (`${message.author}, you have been added to the ${command.serverUpdates.name} role.\n`
            + `If you wish to be removed from this role later, please use the ${prefix}${command.name} command`
            + `in the ${message.guild.name} server.`);

        message.author.send(reply).catch(error => {
            errorLog(error);
            disabledDMs(message, reply);
        });

        return react(message);
    }
}

module.exports.help = command;