/*
    Command Name: about.js
    Function: Give Bot Information
    Clearance: none
    Default Enabled: Yes
    Date Created: 10/15/17
    Last Updated: 10/27/18
    Last Update By: AllusiveBox

*/

// Load in Require Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const { debug } = require(`../functions/log.js`);
const { run: disabledCommand } = require(`../functions/disabledCommand.js`);
const { run: disabledDMs } = require(`../functions/disabledDMs`);
const { run: react } = require(`../functions/react.js`);

// Command Variables
const command = {
    bigDescription: ("Returns information about me!\n"
        + "Returns:\n\t"
        + config.returnsDM),
    description: ("Returns informaton about the bot."),
    enabled: true,
    fullName: "About",
    name: "about",
    permissionLevel: "normal"
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

    // Return About Text
    debug(`Generating About Message for ${message.author.username}`);
    let reply = (`Hello, my name is ${bot.user.username}! I was created by `
        + `${config.about.author}!\n\n`
        + `I am version: **${config.about.verNum}**.\n\n`
        + `I was last updated on: **${config.about.lastUpdated}**.\n\n`
        + `You can find my public github repo here: <${config.publicRepoLink}>\n\n`
        + `To report issues, please use the public issue repo here: <${config.issueRepoLink}>`);

    // Send the Message
    await react(message);
    return message.author.send(reply).catch(error => {
        return disabledDMs(message, reply);
    });
}

module.exports.help = command;
