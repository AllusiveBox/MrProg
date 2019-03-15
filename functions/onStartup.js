/**

    cxBot.js Mr. Prog Startup Script
    Version: 2
    Author: AllusiveBox
    Date Started: 08/09/18
    Date Last Updated: 02/21/19
    Last Update By: AllusivveBox

**/

const Discord = require(`discord.js`);
const userids = require(`../files/userids.json`);
const { debug, error: errorLog } = require(`../functions/log.js`);

/**
 * 
 * @param {Discord.Client} bot
 * @param {string[]} [args]
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
                break;
            case '99':
                message = (`Update Complete.`);
                bot.users.get(userids.ownerID).send(message);
                break;
            default:
                message = (`Starting up...\n`
                    + `Previous iteration terminated with error code: ${passedArgs}`);
                if (args[3]) {
                    let additioalArgs = args.slice(2).join(" ");
                    message += (`\nThe following arguemtns were also included: ${additionalArgs}`);
                }
                bot.users.get(userids.ownerID).send(message);
        }
    }
    catch (error) {
        errorLog(error);
    }
}
