/**

    cxBot.js Mr. Prog Startup Script
    Version: 2
    Author: AllusiveBox
    Date Started: 08/09/18
    Date Last Updated: 04/10/19
    Last Update By: AllusivveBox

**/

const Discord = require(`discord.js`);
const channels = require(`../files/channels.json`);
const userids = require(`../files/userids.json`);
const { debug, error: errorLog, boot } = require(`../functions/log.js`);

/**
 * 
 * @param {Discord.Client} bot
 * @param {String[]} [args]
 */
module.exports.run = async (bot, args) => {
    // Read in Passed Along Arguments
    passedArgs = await args[2];
    
    try {
		let message = "";
        switch (passedArgs) {
            case null:
            case undefined:
            case '0':
                boot("Previous iteration terminated cleanly.");
                break;
            case '99':
                message = (`Update Complete.`);
                bot.users.get(userids.ownerID).send(message);
                boot(message);
                break;
            default:
                message = (`Previous iteration terminated with error code: ${passedArgs}`);
                boot(message, "alert");
                if (args[3]) {
                    let additionalArgs = args.slice(2).join(" ");
                    message += (`The following arguemtns were also included: ${additionalArgs}`);
                    boot(message, "alert");
                }
                bot.users.get(userids.ownerID).send(message);
                // Load in Log Channel ID
                let logID = channels.log;
                if (logID) bot.channels.get(logID).send(message);
        }
    }
    catch (error) {
        errorLog(error);
    }
}
