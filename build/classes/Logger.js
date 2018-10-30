"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const SpiffyDate_js_1 = require("../classes/SpiffyDate.js");
class Logger {
    constructor(name = null) {
        this.name = name;
        this._setLogFilePath();
        this._validateFilePath();
    }
    log(logText, debug = true) {
        let timestamp = new SpiffyDate_js_1.default();
        let logMessage = `${timestamp.getSpiffyDate()}: ${this.name} > ${logText}`;
        let stream = fs_1.createWriteStream(this.logFilePath, { flags: 'a' });
        stream.write(`${logMessage}\n`);
        stream.end();
        if (debug)
            console.log(`${logMessage}\n`);
        return;
    }
    logln(logText, debug = true) {
        this.log(`${logText}\n`, debug);
    }
    _setLogFilePath() {
        let currentDate = new Date();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        let monthString = month < 10 ? '0' + month : month;
        this.logFilePath = `./logs/${this.name}/${year}-${monthString}.txt`;
    }
    _validateFilePath() {
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
