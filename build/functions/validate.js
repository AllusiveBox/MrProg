"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const CustomErrors_js_1 = require("../classes/CustomErrors.js");
const log_js_1 = require("./log.js");
function validateBattleCode(battleCode) {
    log_js_1.debug(`I am inside the Battlecode Validation System.`);
    if (battleCode.length !== 14) {
        log_js_1.debug(`Battlecode fails validation at battleCode.length: `
            + `${battleCode.length}`);
        return false;
    }
    else {
        for (let i = 0; i < battleCode.length; i++) {
            let code = battleCode.charCodeAt(i);
            if ((i === 4) || (i === 9)) {
                if (battleCode[i] !== '-') {
                    log_js_1.debug(`Battlecode fails validation at battleCode[${i}]: `
                        + `Expected character '-'. Found character ${battleCode[i]}.`);
                    return false;
                }
            }
            else if (!((code > 47) && code < 58) && !((code > 64) && (code < 70))) {
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
function role(role, commandName) {
    log_js_1.debug(`I am inside the role validation system.`);
    if ((!role) || ((!role.ID) || (role.ID === ""))) {
        throw new CustomErrors_js_1.NoDefinedRole(commandName);
    }
    return true;
}
exports.role = role;
function methodType(method) {
    log_js_1.debug(`I am inside the method validation system.`);
    if ((method !== "PLAYING") && (method !== "STREAMING") && (method !== "LISTENING") && (method !== "WATCHING")) {
        throw new CustomErrors_js_1.UnsupportedMethodType(method);
    }
    return true;
}
exports.methodType = methodType;
function validatePath(filePath) {
    log_js_1.debug(`I am inside the filePath validation System.`);
    if (filePath == undefined) {
        log_js_1.debug(`Path undefined...`);
        return false;
    }
    if (!filePath.includes('./logs/')) {
        filePath = `./logs/${filePath}`;
    }
    filePath = path.dirname(`${filePath}/temp.txt`);
    if (fs.existsSync(filePath)) {
        log_js_1.debug(`File Path is Valid!`);
        return true;
    }
    else {
        log_js_1.debug("Path does not exist...");
        return false;
    }
    return false;
}
exports.validatePath = validatePath;
function validateFileName(fileName) {
    log_js_1.debug(`I am inside the fileName validation System`);
    if (fileName == undefined) {
        log_js_1.debug(`File undefined...`);
    }
    if (fileName.match(/(^[0-9]{4}[-][0-9]{2})/)) {
        log_js_1.debug(`File Name is Valid!`);
        return true;
    }
    else {
        log_js_1.debug(`Invalid File Format...`);
        return false;
    }
}
exports.validateFileName = validateFileName;
