/*
    Command Name: update.js
    Function: Restarts and Updates the Bot
    Clearance: Owner Only
	Default Enabled: Cannot be Disabled
    Date Created: 01/06/19
    Last Updated: 01/06/19
    Last Update By: AllusiveBox

*/

// Load in Require Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const userids = require(`../files/userids.json`);
const { debug } = require(`../functions/log.js`);
const { run: react } = require(`../functions/react.js`);

// Command Variables
const command = {
    bigDescription: ("Restarts and updates the bot to allow changes to take place.\n"
        + "Returns:\n\t"
        + "This command returns nothing"),
    description: "Update the bot",
    enabled: null,
    fullName: "Update",
    name: "update",
    permissionLevel: "owner"
}


/**
 *  
 * @param {Discord.Client} bot
 * @param {Discord.message} message
 * @param {string[]} args
 * @param {sqlite} sql
 */
module.exports.run = async (bot, message, args, sql) => {
    // Debug to Console
    debug(`I am inside the ${command.fullName} command.`);

    let inUserList = false;

    // Check if Member is in User ID List
    Object.keys(userids).forEach(function (key) {
        if (userids[key] === message.author.id) { // If Member is in the User ID List...
            return inUserList = true;
        }
    });

    if (inUserList) { // If Member is In the User ID List...
        debug(`Shutting Down...`);
        await sql.close();
        debug(`Database conection closed.`);
        debug(`Alerting Owner...`);
        if (!config.debug) message.author.send(`Updating Now...`);
        await react(message);
        process.exit(99);
    }
}

module.exports.help = command;
