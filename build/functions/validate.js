"use strict";
/**

    cxBot.js Mr. Prog Validation Scripts
    Version: 4
    Author: AllusiveBox
    Date Started: 08/26/18
    Date Last Updated: 10/13/18
    Last Update By: Th3_M4j0r

**/
Object.defineProperty(exports, "__esModule", { value: true });
// Load in Required Libraries and Files
const CustomErrors_js_1 = require("../classes/CustomErrors.js");
const log_js_1 = require("./log.js");
/**
 *
 * @param {string} battleCode
 */
function validateBattleCode(battleCode) {
    // Debug to Console
    log_js_1.debug(`I am inside the Battlecode Validation System.`);
    if (battleCode.length !== 14) { // If Battle Code Length is Invalid...
        log_js_1.debug(`Battlecode fails validation at battleCode.length: `
            + `${battleCode.length}`);
        return false;
    }
    else { // If Battle Code Length is Valid...
        for (let i = 0; i < battleCode.length; i++) {
            let code = battleCode.charCodeAt(i);
            if ((i === 4) || (i === 9)) { // Special Case for Dash Characters
                if (battleCode[i] !== '-') { // If Not Dash Character...
                    log_js_1.debug(`Battlecode fails validation at battleCode[${i}]: `
                        + `Expected character '-'. Found character ${battleCode[i]}.`);
                    return false;
                }
            }
            else if (!((code > 47) && code < 58) && !((code > 64) && (code < 70))) {
                // If Code is Out of Bounds...
                log_js_1.debug(`Battlecode fails validation at battleCode[${i}]: `
                    + `Character out of range. Found character ${code}.`);
                return false;
            }
            else {
                log_js_1.debug(`battleCode[${i}]: ${battleCode[i]} | code: ${code}`);
            }
        }
        log_js_1.debug(`Battlecode successfully passed validation.`);
        return true;
    }
}
exports.validateBattleCode = validateBattleCode;
/**
 *
 * @param {ProgRole} role
 * @param {string} commandName
 * @returns {boolean}
 */
function role(role, commandName) {
    // Debug to Console
    log_js_1.debug(`I am inside the role validation system.`);
    if ((!role) || ((!role.ID) || (role.ID === ""))) {
        throw new CustomErrors_js_1.NoDefinedRole(commandName);
    }
    return true;
}
exports.role = role;
/**
 *
 * @param {string} method
 * @returns {boolean}
 */
function methodType(method) {
    // Debug to Console
    log_js_1.debug(`I am inside the method validation system.`);
    if ((method !== "PLAYING") && (method !== "STREAMING") && (method !== "LISTENING") && (method !== "WATCHING")) {
        throw new CustomErrors_js_1.UnsupportedMethodType(method);
    }
    return true;
}
exports.methodType = methodType;
