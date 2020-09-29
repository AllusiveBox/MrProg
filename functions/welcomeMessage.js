/**

    cxBot.js Mr. Prog Welcome Message Script
    Version: 1
    Author: AllusiveBox
    Date Started: 08/08/18
    Date Last Updated: 09/29/20
    Last Update By: AllusiveBox

**/

// Load in Required Libraries and Files
const Discord = require(`discord.js`);
const channels = require(`../files/channels.json`);
const config = require(`../files/config.json`);
const { debug } = require(`../functions/log.js`);

/**
 * 
 * @param {Discord.Member} member
 */
module.exports.run = (member) => {
    // Get the Server Name
    let serverName = member.guild.name;
    // Read in the Bot prefix
    let prefix = config.prefix;
    // Load in the Rules Channel ID
    let rulesID = channels.rules;
    // Check if there was an ID Provided
    if (!rulesID) { // If no Rules ID...
        debug(`Unable to find the rules ID in channels.json.`
            + `Looking for another rules channel.`);
        // Look for Rules Channel in the Server
        let rulesChannel = member.guild.channels.cache.find(val => val.name === 'rules'); //changed to function, since other way is deprecated
        if (!rulesChannel) {
            debug(`Unable to find any kind of rules channel.`);
        } else {
            rulesID = rulesChannel.id;
        }
    }
    // Define the Rules Channel Name
    let rulesChannel = "the server";
    // Check if there is an ID Now
    if (rulesID) { // If there is a Rules ID...
        rulesChannel = `<#${rulesID}>`;
    }
    // Generate the Welcome Message
    debug(`Generating welcome message for ${member.user.username}`);
    let welcomeMessage = (`Welcome to the ${serverName} server, ${member}!\n`
        + `Before you are able to post in the server, you will need to make sure `
        + `you have a verified e-mail linked to your Discord account.\n`
        + `Please note that by posting in ${serverName}, you are agreeing to the `
        + `rules found in ${rulesChannel}. In addition, in order to stay in the server your profile picture `
		+ `**must** be safe for work. We will remove members that do not meet this requirement.\n\n`
        + `In order to better maintain both the bot and server, certain things will be logged.`
        + `This includes join dates, edited messages, deleted messages, and DMs sent to the server's bot(s).\n\n`
        + `You can opt out of this at any time with the \\${prefix}optOut command.\n`
        + `To see what data the bot has collected for you, use the \\${prefix}profile command.\n\n`
        + `For a list of bot commands, use the \\${prefix}help.\n\n`
        + `Please check out our FAQ for commonly asked questions and answers.\n`
        + `http://cxfaqdoc.mmbnchronox.com/`);

    return welcomeMessage;
}
