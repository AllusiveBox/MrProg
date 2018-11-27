/**

    cxBot.js Mr. Prog Validation Scripts
    Version: 4
    Author: AllusiveBox
    Date Started: 08/26/18
    Date Last Updated: 11/23/18
    Last Update By: Th3_M4j0r

**/

// Load in Required Libraries and Files
import * as fs from 'fs';
import * as path from 'path';
import { NoDefinedRole, UnsupportedMethodType } from '../classes/CustomErrors.js';
import { debug, error as errorLog } from './log.js';


/**
 * 
 * @param {string} battleCode
 */
export function validateBattleCode(battleCode: string) {
    // Debug to Console
    debug(`I am inside the Battlecode Validation System.`);

    if (battleCode.length !== 14) { // If Battle Code Length is Invalid...
        debug(`Battlecode fails validation at battleCode.length: `
            + `${battleCode.length}`);
        return false;
    } else { // If Battle Code Length is Valid...
        for (let i = 0; i < battleCode.length; i++) {
            let code = battleCode.charCodeAt(i);
            if ((i === 4) || (i === 9)) { // Special Case for Dash Characters
                if (battleCode[i] !== '-') { // If Not Dash Character...
                    debug(`Battlecode fails validation at battleCode[${i}]: `
                        + `Expected character '-'. Found character ${battleCode[i]}.`);
                    return false;
                }
            } else if (!((code > 47) && code < 58) && !((code > 64) && (code < 70))) {
                // If Code is Out of Bounds...
                debug(`Battlecode fails validation at battleCode[${i}]: `
                    + `Character out of range. Found character ${code}.`);
                return false;
            } else {
                debug(`battleCode[${i}]: ${battleCode[i]} | code: ${code}`);
            }
        }
        debug(`Battlecode successfully passed validation.`);
        return true;
    }
}



interface ProgRole {
    ID : string;
}

/**
 * 
 * @param {ProgRole} role
 * @param {string} commandName
 * @returns {boolean}
 */
export function role(role: ProgRole, commandName: string): boolean {
    // Debug to Console
    debug(`I am inside the role validation system.`);

    if ((!role) || ((!role.ID) || (role.ID === ""))) {
        throw new NoDefinedRole(commandName);
    }

    return true;
}

/**
 * 
 * @param {string} method
 * @returns {boolean}
 */
export function methodType(method: string): boolean {
    // Debug to Console
    debug(`I am inside the method validation system.`);

    if ((method !== "PLAYING") && (method !== "STREAMING") && (method !== "LISTENING") && (method !== "WATCHING")) {
        throw new UnsupportedMethodType(method);
    }

    return true;
}

export function validatePath(filePath: string): boolean {
    // Debug to Console
    debug(`I am inside the filePath validation System.`);

    if (filePath == undefined) { // If File Path is Undefined...
        debug(`Path undefined...`);
        return false;
    }

    if (!filePath.includes('./logs/')) { // If Not Correctly Formatted...
        filePath = `./logs/${filePath}`;
    }

    filePath = path.dirname(`${filePath}/temp.txt`);

    if (fs.existsSync(filePath)) { // If Path Exists...
        debug(`File Path is Valid!`);
        return true;
    } else { // Else Path Does Not Exist...
        debug("Path does not exist...");
        return false;
    }

    return false;
}

export function validateFileName(fileName: string):boolean {
    // Debug to Console
    debug(`I am inside the fileName validation System`);

    if (fileName == undefined) { // If File Name is Undefined...
        debug(`File undefined...`);
    }

    if (fileName.match(/(^[0-9]{4}[-][0-9]{2})/)) { // If File Includes Regex...
        debug(`File Name is Valid!`);
        return true;
    } else { // Else Invalid Format...
        debug(`Invalid File Format...`);
        return false;
    }
}