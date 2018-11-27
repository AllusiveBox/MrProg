"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("./log.js");
const userids = require("../files/userids.json");
async function run(bot, member, sql) {
    log_js_1.debug(`I am in the deleteMemberInfo function.`);
    Object.keys(userids).forEach(function (key) {
        if (userids[key] === member.id) {
            return log_js_1.debug(`Preserving data on ${member.user.username} due to being in `
                + `the userids list.`);
        }
    });
    log_js_1.debug(`Setting the User's leaveDate Field...`);
    sql.userLeft(member.id);
    return log_js_1.debug(`Update Successful.`);
}
exports.run = run;
