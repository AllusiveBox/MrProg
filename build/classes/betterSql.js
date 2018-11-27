"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_1 = require("sqlite");
const log_js_1 = require("../functions/log.js");
const CustomErrors_js_1 = require("./CustomErrors.js");
var optOutChoice;
(function (optOutChoice) {
    optOutChoice[optOutChoice["optedIn"] = 0] = "optedIn";
    optOutChoice[optOutChoice["optedOut"] = 1] = "optedOut";
})(optOutChoice = exports.optOutChoice || (exports.optOutChoice = {}));
const insertUserString = "INSERT INTO userinfo (userId, userName, battlecode, favechip, "
    + "navi, clearance, points, level, optOut, joinDate, leaveDate, firstJoinDate) VALUES (?, ?, ?, ?, ?, ?, "
    + "?, ?, ?, ?, ?, ?)";
const setPointsString = "UPDATE userinfo SET points = ?, level = "
    + "?, userName = ? WHERE userId = ?";
const promoteString = "UPDATE userinfo SET clearance = ? WHERE userId = ?";
const getUserString = "SELECT * FROM userinfo WHERE userId = ?";
const getJoinDateString = "SELECT joinDate from userinfo WHERE userId = ?";
const userLeftString = "UPDATE userinfo SET battlecode = null, navi = null, clearance = null, points = null, "
    + "level = null, joinDate = null, leaveDate = ? WHERE userId = ?";
const deleteMeString = "UPDATE userinfo SET userName = null, battlecode = null, "
    + "favechip = null, navi = null, points = 0, "
    + "level = 0 WHERE userId = ?";
const setBattleCodeString = "UPDATE userinfo SET battlecode = ? WHERE userId = ?";
const setFirstJoinDateString = "UPDATE userinfo SET firstJoinDate = ? WHERE userId = ?";
const setJoinDateString = "UPDATE userinfo SET joinDate = ? WHERE userId = ?";
const setLeaveDateString = "UPDATE userinfo SET leaveDate = ? WHERE userId = ?";
const setNaviString = "UPDATE userinfo SET navi = ? WHERE userId = ?";
const changeOptString = "UPDATE userinfo SET optOut = ? WHERE userId = ?";
const userLookupString = "SELECT * FROM userinfo WHERE userID = ? OR userID = ? "
    + "OR userName = ? OR userName = ?";
const dbOptions = {
    promise: Promise
};
class betterSql {
    constructor() {
        this._dbOpen = false;
    }
    async open(path) {
        log_js_1.debug(`Opening sqlite DB at ${path}`);
        this._Database = await sqlite_1.open(path, dbOptions);
        this._Database.run("CREATE TABLE IF NOT EXISTS userinfo (userId TEXT NOT NULL, "
            + "userName TEXT, battlecode TEXT, favechip TEXT, navi TEXT, "
            + "clearance TEXT, points INTEGER, level INTEGER, optOut INTEGER, "
            + "PRIMARY KEY (userId))");
        log_js_1.debug(`Preparing statements`);
        this._userInsertStmt = await this._Database.prepare(insertUserString);
        this._setPointsStmt = await this._Database.prepare(setPointsString);
        this._promoteStmt = await this._Database.prepare(promoteString);
        this._getUserStmt = await this._Database.prepare(getUserString);
        this._getJoinDateStmt = await this._Database.prepare(getJoinDateString);
        this._setBattleCodeStmt = await this._Database.prepare(setBattleCodeString);
        this._setFirstJoinDateStmt = await this._Database.prepare(setFirstJoinDateString);
        this._setJoinDateStmt = await this._Database.prepare(setJoinDateString);
        this._setLeaveDateStmt = await this._Database.prepare(setLeaveDateString);
        this._setNaviStmt = await this._Database.prepare(setNaviString);
        this._userLeftStmt = await this._Database.prepare(userLeftString);
        this._deleteMeStmt = await this._Database.prepare(deleteMeString);
        this._changeOptStmt = await this._Database.prepare(changeOptString);
        this._userLookupStmt = await this._Database.prepare(userLookupString);
        log_js_1.debug(`Statements prepared`);
        this._dbOpen = true;
        return true;
    }
    isOpen() {
        return this._dbOpen;
    }
    async getUserRow(userId) {
        log_js_1.debug(`I am in the sql.getUserRow function`);
        if (!this._dbOpen) {
            throw new CustomErrors_js_1.NotConnectedError();
        }
        return await this._getUserStmt.get(userId);
    }
    async getJoinDate(userId) {
        log_js_1.debug(`I am in the sql.getJoinDate function`);
        if (!this._dbOpen) {
            throw new CustomErrors_js_1.NotConnectedError();
        }
        let row = await this._getJoinDateStmt.get(userId);
        return row.joinDate;
    }
    async insertUser(userId, username, joinDate = null) {
        log_js_1.debug(`I am in the sql.insertUser function`);
        if (!this._dbOpen) {
            throw new CustomErrors_js_1.NotConnectedError();
        }
        await this._userInsertStmt.run(userId, username, "0000-0000-0000", null, "megaman", null, 0, 0, 0, joinDate, null, joinDate);
    }
    async setBattleCode(userId, battleCode) {
        log_js_1.debug(`I am in the sql.setBattleCode function`);
        if (!this._dbOpen) {
            throw new CustomErrors_js_1.NotConnectedError();
        }
        await this._setBattleCodeStmt.run(battleCode, userId);
    }
    async setFirstJoinDate(userId, joinDate) {
        log_js_1.debug(`I am in the sql.setFirstJoinDate function`);
        if (!this._dbOpen) {
            throw new CustomErrors_js_1.NotConnectedError();
        }
        await this._setFirstJoinDateStmt.run(joinDate, userId);
    }
    async setJoinDate(userId, joinDate) {
        log_js_1.debug(`I am in the sql.setJoinDate function`);
        if (!this._dbOpen) {
            throw new CustomErrors_js_1.NotConnectedError();
        }
        await this._setJoinDateStmt.run(joinDate, userId);
    }
    async setLeaveDate(userId, leaveDate) {
        log_js_1.debug(`I am in the sql.setLeaveDate function`);
        if (!this._dbOpen) {
            throw new CustomErrors_js_1.NotConnectedError();
        }
        await this._setLeaveDateStmt.run(leaveDate, userId);
    }
    async setPoints(userId, points, level, username) {
        log_js_1.debug(`I am in the sql.setPoints function`);
        if (!this._dbOpen) {
            throw new CustomErrors_js_1.NotConnectedError();
        }
        await this._setPointsStmt.run(points, level, username, userId);
    }
    async setNavi(userId, navi) {
        log_js_1.debug(`I am in the sql.setNavi function`);
        if (!this._dbOpen) {
            throw new CustomErrors_js_1.NotConnectedError();
        }
        await this._setNaviStmt.run(navi, userId);
    }
    async promoteUser(userId, newRole) {
        log_js_1.debug(`I am in the sql.promoteUser function`);
        if (!this._dbOpen) {
            throw new CustomErrors_js_1.NotConnectedError();
        }
        await this._promoteStmt.run(newRole, userId);
    }
    async deleteUser(userId) {
        log_js_1.debug(`I am in the sql.deleteUser function`);
        if (!this._dbOpen) {
            throw new CustomErrors_js_1.NotConnectedError();
        }
        await this._deleteMeStmt.run(userId);
    }
    async optOutUser(userId) {
        log_js_1.debug(`I am in the sql.optOutUser function`);
        if (!this._dbOpen) {
            throw new CustomErrors_js_1.NotConnectedError();
        }
        await this._changeOptStmt.run(optOutChoice.optedOut, userId);
    }
    async optInUser(userId) {
        log_js_1.debug(`I am in the sql.optInUser function`);
        if (!this._dbOpen) {
            throw new CustomErrors_js_1.NotConnectedError();
        }
        await this._changeOptStmt.run(optOutChoice.optedIn, userId);
    }
    async userLookup(toCheck) {
        log_js_1.debug(`I am in the sql.userLookup function`);
        if (!this._dbOpen) {
            throw new CustomErrors_js_1.NotConnectedError();
        }
        return await this._userLookupStmt.get(toCheck, toCheck.id, toCheck.username, toCheck);
    }
    async userLeft(userId) {
        log_js_1.debug(`I am in the sql.userLeft function`);
        if (!this._dbOpen) {
            throw new CustomErrors_js_1.NotConnectedError();
        }
        await this._userLeftStmt.run(new Date(), userId);
    }
    async run(stmt) {
        log_js_1.debug(`I am in the sql.run function`);
        if (!this._dbOpen) {
            throw new CustomErrors_js_1.NotConnectedError();
        }
        await this._Database.exec(stmt);
    }
    async get(stmt) {
        log_js_1.debug(`I am in the sql.get function`);
        if (!this._dbOpen) {
            throw new CustomErrors_js_1.NotConnectedError();
        }
        return await this._Database.get(stmt);
    }
    async close() {
        log_js_1.debug(`I am in the sql.close funciton`);
        if (!this._dbOpen)
            return;
        this._dbOpen = false;
        await this._userInsertStmt.finalize();
        this._userInsertStmt = null;
        await this._setPointsStmt.finalize();
        this._setPointsStmt = null;
        await this._promoteStmt.finalize();
        this._promoteStmt = null;
        await this._getUserStmt.finalize();
        this._getUserStmt = null;
        await this._getJoinDateStmt.finalize();
        this._getJoinDateStmt = null;
        await this._setBattleCodeStmt.finalize();
        this._setBattleCodeStmt = null;
        await this._setFirstJoinDateStmt.finalize();
        this._setFirstJoinDateStmt = null;
        await this._setJoinDateStmt.finalize();
        this._setJoinDateStmt = null;
        await this._setLeaveDateStmt.finalize();
        this._setLeaveDateStmt = null;
        await this._setNaviStmt.finalize();
        this._setNaviStmt = null;
        await this._userLeftStmt.finalize();
        this._userLeftStmt = null;
        await this._deleteMeStmt.finalize();
        this._deleteMeStmt = null;
        await this._changeOptStmt.finalize();
        this._changeOptStmt = null;
        await this._userLookupStmt.finalize();
        this._userLookupStmt = null;
        await this._Database.close();
        log_js_1.debug(`database successfully closed`);
    }
}
exports.default = betterSql;
