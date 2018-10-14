"use strict";
/**

    cxBot.js Mr. Prog Startup Script
    Version: 2
    Author: AllusiveBox
    Date Started: 08/09/18
    Date Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

**/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const userids = require("../files/userids.json");
/**
 *
 * @param {Discord.Client} bot
 * @param {?string[]} [args]
 */
async function run(bot, args) {
    // Read in Passed Along Arguments
    let passedArgs = Number(args[2]);
    try {
        if ((passedArgs != 0) && (passedArgs != undefined)) {
            bot.users.get(userids.ownerID).send(`Starting up...\n`
                + `Previous iteration terminated with error code: ${passedArgs}.`);
            if (args[3]) {
                let additionalArgs = args.slice(2).join(" ");
                bot.users.get(userids.ownerID).send(`The following arguments were also `
                    + `included: ${additionalArgs}`);
            }
        }
    }
    catch (error) {
        log_js_1.error(error);
    }
}
exports.run = run;
