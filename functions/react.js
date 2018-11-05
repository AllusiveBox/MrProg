/**

    cxBot.js Mr. Prog React to Message
    Version: 1
    Author: AllusiveBox
    Date Created: 10/27/18
    Date Last Updated: 10/27/18
    Last Update By: AllusiveBox

**/

// Load in Required Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const { error: errorLog } = require(`../functions/log.js`);

/**
 * 
 * @param {Discord.Message} message
 * @param {?Boolean} [success=true]
 */
module.exports.run = async (message, success = true) => {
    let react = success ? config.success : config.fail;

    try {
        await message.react(react);
    } catch (error) {
        errorLog(error);
        return message.channel.send(`*${error.toString()}*`);
    }
}