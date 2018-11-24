/**

    cxBot.js Mr. Prog better sqlite Scripts
    Version: 1
    Author: Th3_M4j0r
    Date Started: 09/08/18
    Date Last Updated: 11/24/18
    Last Update By: AllusiveBox

**/

const Discord = require(`discord.js`);
const sql = require(`sqlite`);
const { debug, error: errorLog } = require(`../functions/log.js`);
const { NotConnectedError } = require(`../classes/CustomErrors.js`);


//the strings for each statement to prepare after connecting
//prepared statements are faster and also safer
const insertUserString = "INSERT INTO userinfo (userId, userName, battlecode, favechip, "
    + "navi, clearance, points, level, optOut, joinDate, leaveDate, firstJoinDate) VALUES (?, ?, ?, ?, ?, ?, "
    + "?, ?, ?, ?, ?, ?)";
const setPointsString = "UPDATE userinfo SET points = ?, level = "
    + "?, userName = ? WHERE userId = ?";
const promoteString = "UPDATE userinfo SET clearance = ? WHERE userId = ?"; //don't know how AllusiveBox does this yet
const getUserString = "SELECT * FROM userinfo WHERE userId = ?";
const getJoinDateString = "SELECT joinDate from userinfo WHERE userId = ?"
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
const optOutString = "UPDATE userinfo SET optOut = 1 WHERE userId = ?";
const optInString = "UPDATE userinfo SET optOut = 0 WHERE userId = ?";
const userLookupString = "SELECT * FROM userinfo WHERE userID = ? OR userID = ? "
    + "OR userName = ? OR userName = ?";



module.exports = class betterSql {

    /**
     * constructor does nothing
     */
    constructor() {
        this._dbOpen = false;
    }

    /**
     * connect to a database
     * 
     * @param {!string} path 
     * @returns {Promise<boolean>}
     */
    async open(path) {
        debug(`Opening sqlite DB at ${path}`);
        this._Database = await sql.open(path, { Promise });
        debug(`Preparing statements`);
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
        this._optOutStmt = await this._Database.prepare(optOutString);
        this._optInStmt = await this._Database.prepare(optInString);
        this._userLookupStmt = await this._Database.prepare(userLookupString);
        debug(`Statements prepared`);
        this._dbOpen = true;
        return true;
    }

    /**
     * 
     * @param {Discord.Snowflake} userId 
     */
    async getUserRow(userId) {
        debug(`I am in the sql.getUserRow function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        return await this._getUserStmt.get(userId);
    }

    /**
     * 
     * @param {Discord.Snowflake} userId
     */
    async getJoinDate(userId) {
        debug(`I am in the sql.getJoinDate function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        let row = await this._getJoinDateStmt.get(userId);
        return row.joinDate;
    }

    /**
     * 
     * @param {Discord.Snowflake} userId 
     * @param {string} username
     * @param {string} [joinDate=null]
     */
    async insertUser(userId, username, joinDate = null) {
        debug(`I am in the sql.insertUser function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._userInsertStmt.run(
            userId, username, "0000-0000-0000", null, "megaman", null, 0, 0, 0, joinDate, null, joinDate);
    }

    /**
     * 
     * updates a user's battlecode
     * 
     * @param {Discord.Snowflake} userId
     * @param {string} battleCode
     */
    async setBattleCode(userId, battleCode) {
        debug(`I am in the sql.setBattleCode function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._setBattleCodeStmt.run(battleCode, userId);
    }

    /**
     * 
     * @param {Discord.Snowflake} userId
     * @param {string} joinDate
     */
    async setFirstJoinDate(userId, joinDate) {
        debug(`I am in the sql.setFirstJoinDate function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._setFirstJoinDateStmt.run(joinDate, userId);
    }

    /**
     * 
     * @param {Discord.Snowflake} userId
     * @param {string} joinDate
     */

    async setJoinDate(userId, joinDate) {
        debug(`I am in the sql.setJoinDate function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._setJoinDateStmt.run(joinDate, userId);
    }

    async setLeaveDate(userId, leaveDate) {
        debug(`I am in the sql.setLeaveDate function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._setLeaveDateStmt.run(leaveDate, userId);
    }

    /**
     * 
     * Sets a users points
     * 
     * @param {Discord.Snowflake} userId 
     * @param {number} points 
     * @param {number} level 
     * @param {string} username 
     */
    async setPoints(userId, points, level, username) {
        debug(`I am in the sql.setPoints function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._setPointsStmt.run(points, level, username, userId);
    }

    /**
     * 
     * @param {Discord.Snowflake} userId 
     * @param {string} navi 
     */
    async setNavi(userId, navi) {
        debug(`I am in the sql.setNavi function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._setNaviStmt.run(navi, userId);
    }

    /**
     * 
     * promotes/demotes the user with the given id to the new role
     * 
     * @param {Discord.Snowflake} userId 
     * @param {string} newRole 
     */
    async promoteUser(userId, newRole) {
        debug(`I am in the sql.promoteUser function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._promoteStmt.run(newRole, userId);
    }


    /**
     * 
     * A user has requested everything be deleted
     * 
     * @param {Discord.Snowflake} userId
     */
    async deleteUser(userId) {
        debug(`I am in the sql.deleteUser function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._deleteMeStmt.run(userId);
    }


    /**
     * 
     * A user has opted out
     * 
     * @param {Discord.Snowflake} userId
     */
    async optOutUser(userId) {
        debug(`I am in the sql.optOutUser function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._optOutStmt.run(userId);
    }

    /**
     * 
     * A user wants to opt back in
     * 
     * @param {Discord.Snowflake} userId
     */
    async optInUser(userId) {
        debug(`I am in the sql.optInUser function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._optInStmt.run(userId);
    }

    /**
     * 
     * allows searching for a user
     * 
     * @param {Object} toCheck 
     */
    async userLookup(toCheck) {
        debug(`I am in the sql.userLookup function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        return await this._userLookupStmt.get(toCheck, toCheck.id, toCheck.username, toCheck);
    }

    /**
     * 
     * A user has left the server
     * 
     * @param {Discord.Snowflake} userId
     */
    async userLeft(userId) {
        debug(`I am in the sql.userLeft function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._userLeftStmt.run(new Date(), userId);
    }


    /**
     * 
     * allows execution of statements directly,
     * only use if really needed
     * 
     * @param {string} stmt 
     */
    async run(stmt) {
        debug(`I am in the sql.run function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._Database.exec(stmt);
    }

    /**
     * 
     * allows execution of statements directly,
     * only use if really needed
     * 
     * @param {string} stmt 
     */
    async get(stmt) {
        debug(`I am in the sql.get function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        return await this._Database.get(stmt);
    }

    /**
     * 
     * Close the connection, no further statements can be executed
     */
    async close() {
        debug(`I am in the sql.close funciton`);
        if (!this._dbOpen) return; //if not open, quietly do nothing
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
        this._DatabaseuserLeftStmt = null;
        await this._deleteMeStmt.finalize();
        this._deleteMeStmt = null;
        await this._optOutStmt.finalize();
        this._optOutStmt = null;
        await this._optInStmt.finalize();
        this._optInStmt = null;
        await this._userLookupStmt.finalize();
        this._userLookupStmt = null;
        await this._Database.close();
        debug(`database successfully closed`);

    }

}
