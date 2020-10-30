/*
    Command Name: gamerole.js
    Function: Assigns a User a game role
    Clearance: none
  	Default Enabled: Yes
    Date Created: 10/30/20
    Last Updated: 10/30/20
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
    bigDescription: ("This command assigns a user a role that will let them be alerted when users are trying to gather a group to play certain a certain game(s)."
        + "(**Note**: This command cannot be used in a DM.\n"
        + "Use:\n\t"
        + "!gameRole {roleName}\n"
        + "Returns:\n\t" + config.returnsDM),
    description: "Assigns the user the a game role.",
    enabled: true, // true/false
    fullName: "Game Role",
    name: "gamerole",
    permissionLevel: "normal",
    gameRoles: roles.gameRoles
}

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */
module.exports.run = async (bot, message, args) => {
    // Debug to Console
    debug(`I am inside the ${command.fullName} command.`);

    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand(command.fullName, message);
    }

    // DM Check
    if (await dmCheck(message, command.fullName)) return; // Return on DM channel

    // Check to see if Role has been Defined or Not

    // Find out the User to Update
    var toUpdate = message.member;

    // Grab the Server Roles
    let serverRoles = message.guild.roles.cache;

    // Grab the Role to Add to the User
    let roleToAddString = args.join("").toLowerCase();

    let prefix = config.prefix;

    if (!roleToAddString) {
        message.channel.send(`Please provide a role that you want to be assigned to, ${message.author}. For help, please use ${prefix}help ${command.name}.`);
        return react(message, false);
    }

    let roleToAdd = command.gameRoles[roleToAddString];
    
    // Validate the Role
    try {
        validate(roleToAdd, roleToAddString ? roleToAddString : null);
    } catch (error) {
        debug(`Unable to locate role ${roleToAddString}`);
        message.channel.send(`I'm sorry ${message.author}, I am unable to locate any command for the following arguments:\n\t ${roleToAddString}`);
        return react(message, false);
    }

    // Get the Server Role
    let role = await serverRoles.get(roleToAdd.ID);

    // Check if Member has the Role Already
    if (toUpdate.roles.cache.some(r => [roleToAdd.ID].includes(r.id))) {
        debug(`${message.author.username} already has the ${roleToAdd.name} role. Removing role now.`);

        // Try and Remove the Role
        try {
            await toUpdate.roles.remove(role);
        } catch (error) {
            // Catch the Error and Inform the User
            errorLog(error);
            message.channel.send(`I'm sorry ${message.author}, something went wrong and I was unable to update your roles.`
                + `*${error.toString()}*`);
            // Show Failed Command React
            return react(message, false);
        }

        // Build the Reply to the User
        let reply = (`${message.author}, you have been removed from the ${roleToAdd.name} role.\n`
            + `If you wish to be added back to this role later, please us the ${prefix}${command.name}`
            + `command in the ${message.guild.name} server.`);

        // Send the Reply
        message.author.send(reply).catch(error => {
            errorLog(error);
            disabledDMs(message, reply);
        });

        // Show Successful Command React
        return react(message);
    } else {
        debug(`${message.author.username} does not have the ${roleToAdd.name} role. Adding role now.`);

        // Try and Add the Role
        try {
            await toUpdate.roles.add(role);
        } catch (error) {
            // Catch the Error and Inform the User
            errorLog(error);
            message.channel.send(`I'm sorry ${message.author}, something went wrong and I was unable to update your roles.`
                + `*${error.toString()}*`);
            // Show Failed Command React
            return react(message, false);
        }

        // Build the Reply to the User
        let reply = (`${message.author}, you have been added to the ${roleToAdd.name} role.\n`
            + `If you wish to be removed from this role later, please us the ${prefix}${command.name} command`
            + `in the ${message.guild.name} server.`);

        message.author.send(reply).catch(error => {
            errorLog(error);
            disabledDMs(message, reply);
        });

        return react(message);
    }

}

module.exports.help = command;
