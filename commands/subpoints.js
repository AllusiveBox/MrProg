/*
    Command Name: subpoints.js
    Function: To Remove a User's Points
    Clearance: mod+
	Default Enabled: Yes
    Date Created: 08/17/20
    Last Updated: 10/30/20
    Last Update By: AllusiveBox
*/

// Load in Required Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const { debug, error: errorLog } = require(`../functions/log.js`);
const { run: hasElevatedPermissions } = require(`../functions/hasElevatedPermissions.js`);
const { run: react } = require(`../functions/react.js`);
const { run: dmCheck } = require(`../functions/dmCheck.js`);
const betterSql = require(`../classes/betterSql.js`);

// Command Variables
const command = {
    adminOnly: false,
    bigDescription: ("This command allows an administrator or mod to remove points from a user's total point count.\n"
        + "Use:\n\t"
        + `!subpoints {user} {int}\n`
        + "Returns:\n\t"
        + "This command returns nothing."),
    description: "Allows an admin or mod the ability to decrease someone's points.",
    enabled: true,
    fullName: "Subtract Points",
    name: "subpoints",
    permissionLevel: "mod"
}

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} args
 * @param {betterSql} sql
 */
module.exports.run = async (bot, message, args, sql) => {
    // Debug to Console Log
    debug(`I am inside the ${command.fullName} Command.`);
    if (dmCheck(message, command.name)) return;

    // Validate if User has Permission to Use Command
    if (! await hasElevatedPermissions(bot, message, command.adminOnly, sql)) return;

    // Get the name of the Member to Give Points
    var toChange = message.mentions.members.first();

    // Get Amount to Add
    var amount = !!parseInt(message.content.split(" ")[1]) ? parseInt(message.content.split(" ")[1]) : parseInt(message.content.split(" ")[2]);

    if (!toChange) { // If No User Detected...
        message.channel.send("You must mention someone to update their points.");
        return react(message, false);
    }

    if (!amount) { // If No Amount Detected...
        message.channel.send("You must indicate an amount to decrease their points by");
        return react(message, false);
    }

    let row = await sql.getUserRow(toChange.id);

    if (!row) {
        message.channel.send(`I'm sorry, ${message.author}, I am unable to increase the points of ${toChange.user.username}. I cannot find them in `
            + `my database...`);
        return react(message, false);
    } else if (row.optOut === 1) {
        message.channel.send(`I'm sorry, ${message.author}, I am unable to increase the points of ${toChange.user.username} as they have opted out `
            + `of me collecting data on them.`);
        return react(message, false);
    }

    let name = toChange.user.username;
    try {
        name = message.guild.members.cache.get(toChange.id).nickname;
        if (!name) name = toChange.user.username;
        debug(`Name set to: ${name}`);
    }
    catch (error) {
        name = message.author.username;
        debug(`Unable to get Nickname. Name set to: ${name}`);
    }

    try {
        sql.setPoints(toChange.id, row.points - amount, row.level, name);
        return react(message);
    } catch (error) {
        message.channel.send(`I'm sorry ${message.author}, I am unable to do that at this time due to the following error:\n`
            + `*${error.toString()}*`);
        errorLog(error);
        return react(message, false);
    }
}

module.exports.help = command;
