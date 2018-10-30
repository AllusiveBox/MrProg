"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const userids = require("../files/userids.json");
async function run(bot, args) {
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
