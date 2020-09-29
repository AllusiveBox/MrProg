/*
    Command Name: dendome.js
    Function: Assigns a User the Tournament Participant Role
    Clearance: none
  	Default Enabled: Yes
    Date Created: 05/19/18
    Last Updated: 09/29/20
    Last Update By: AllusiveBox

*/

// Load in Required Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const roles = require(`../files/roles.json`);
const { run: disabledCommand } = require(`../functions/disabledCommand.js`);
const { run: disabledDMs } = require(`../functions/disabledDMs.js`);
const { run: dmCheck } = require(`../functions/dmCheck.js`);
const { debug, error: errorLog } = require(`../functions/log.js`);
const { run: react } = require(`../functions/react.js`);
const { role: validate } = require(`../functions/validate.js`);

// Command Variables
const command = {
    bigDescription: ("This command assigns a user a role that will let them be alerted when there is a tournament, or a tournament related announcement. (**Note**: This command cannot be used in a DM.)\n"
        + "Returns:\n\t"
        + config.returnsDM),
    description: "Assigns the user the Tournament Participant Role.",
    enabled: true, // true/false
    fullName: "Dendome",
    name: "dendome",
    permissionLevel: "normal",
    tournyRole: roles.tournyRole
}

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */
module.exports.run = async (bot, message) => {
    // Debug to Console
    debug(`I am inside the ${command.fullName} command.`);

    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand(command.fullName, message);
    }

    // DM Check
    if (await dmCheck(message, command.fullName)) return; // Return on DM channel

    // Check to see if Role has been Defined or Not
    validate(command.tournyRole, command.fullName);

    // Find out the User to Update
    var toUpdate = message.member;

    // Grab the Server Roles
    let serverRoles = message.guild.roles.cache;

    // Get the Current Command Prefix
    let prefix = config.prefix;

    // Check if Member has the Role Already
    if (toUpdate.roles.cache.some(r => [command.tournyRole.ID].includes(r.id))) {
        debug(`${message.author.username} already has the ${command.tournyRole.name} `
            + `role. Removing role now.`);
        let role = await serverRoles.get(command.tournyRole.ID);

        try {
            await toUpdate.roles.remove(role);
        } catch (error) {
            errorLog(error);
            await react(message, false);
            return message.channel.send(`I am sorry, ${message.author}, something`
                + ` went wrong and I was unable to update your roles.`
                + `*${error.toString()}*`);
        }

        let reply = (`${message.author}, you have been removed from the `
            + `${command.tournyRole.name} role.\n`
            + `If you wish to be added back to this role later, please use the `
            + `${prefix}${command.name} command in the ${message.guild.name} server.`);

        await react(message);
        return message.author.send(reply).catch(error => {
            errorLog(error);
            return disabledDMs(message, reply);
        });
    } else {
        debug(`${message.author.username} does not have the ${command.tournyRole.name} `
            + `role. Adding role now.`);
        let role = await serverRoles.get(command.tournyRole.ID);

        try {
            await toUpdate.roles.add(role);
        } catch (error) {
            errorLog(error);
            await react(message, false);
            return message.channel.send(`I am sorry, ${message.author}, something `
                + `went wrong and I was unable to update your roles.`
                + `*${error.toString()}*`);
        }

        let reply = (`${message.author}, you have been added to the `
            + `${command.tournyRole.name} role.\n`
            + `If you wish to be removed from this role later, please use the `
            + `${prefix}${command.name} command in the ${message.guild.name} server.`);

        await react(message);
        return message.author.send(reply).catch(error => {
            return disabledDMs(message, reply);
        });
    }
}

module.exports.help = command;
