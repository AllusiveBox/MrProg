"use strict";
/**
 *
 * Mr. Prog Logger Class
 * Version: 1
 * Author: AllusiveBox
 * Date Started: 09/21/18
 * Date Last Updated: 10/13/18
 * Last Updated By: Th3_M4jor
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const SpiffyDate_js_1 = require("../classes/SpiffyDate.js");
class Logger {
    /**
     *
     * @param {logType} name
     */
    constructor(name = null) {
        this.name = name;
        this._setLogFilePath();
        this._validateFilePath();
    }
    /**
     * Log Function Logs to the Log File
     * @param {string} logText
     * @param {?boolean} [debug=true]
     *
     */
    log(logText, debug = true) {
        // Get SpiffyDate
        let timestamp = new SpiffyDate_js_1.default();
        // Build the Log Message
        let logMessage = `${timestamp.getSpiffyDate()}: ${this.name} > ${logText}`;
        // Build Stream Writer
        let stream = fs_1.createWriteStream(this.logFilePath, { flags: 'a' });
        // Write to Log File
        stream.write(`${logMessage}\n`);
        // End the Stream
        stream.end();
        if (debug)
            console.log(`${logMessage}\n`);
        return;
    }
    /**
     * Log Function Logs to the Log File and Includes a New Line
     * @param {String} logText
     * @param {?boolean} [debug=true]
     */
    logln(logText, debug = true) {
        this.log(`${logText}\n`, debug);
    }
    /**
     * Generates the Log File's Path
     *
     */
    _setLogFilePath() {
        // Get Current Date
        let currentDate = new Date();
        // Grab Month and Year
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        // Format Month
        let monthString = month < 10 ? '0' + month : month;
        this.logFilePath = `./logs/${this.name}/${year}-${monthString}.txt`;
    }
    /**
     * Validates the logFilePath Variable and Creates it, if Necessary*/
    _validateFilePath() {
        // Ensure Log Directory Exists First
        let logDir = path_1.dirname(`./logs/temp.txt`);
        if (!fs_1.existsSync(logDir)) {
            console.log(`Unable to locate ${logDir}, creating now...`);
            fs_1.mkdirSync(logDir);
            this._validateFilePath();
        }
        let dirname = path_1.dirname(this.logFilePath);
        if (fs_1.existsSync(dirname)) {
            return true;
        }
        else {
            console.log(`Unable to locate ${dirname}, creating now...`);
            fs_1.mkdirSync(dirname);
            this._validateFilePath();
        }
    }
}
exports.default = Logger;
