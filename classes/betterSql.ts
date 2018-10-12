/**

    cxBot.js Mr. Prog better sqlite Scripts
    Version: 1
    Author: Th3_M4j0r
    Date Started: 09/08/18
    Date Last Updated: 10/12/18
    Last Update By: Th3_M4j0r
**/

import * as Discord from 'discord.js';
import { open as _open, Database, Statement } from 'sqlite';
import { debug } from '../functions/log.js';
import { NotConnectedError } from './CustomErrors.js';


export interface userRow {
    userId:Discord.Snowflake,
    userName: string,
    battlecode: string,
    favechip: string,
    navi: string,
    clearance: clearances
    points: number,
    level: number,
    optOut: optOutChoice
}

export enum optOutChoice {
    optedIn = 0, optedOut = 1
}

export type clearances = "none" | "mod" | "admin" | "smod" | null; 

//the strings for each statement to prepare after connecting
//prepared statements are faster and also safer
const insertUserString = "INSERT INTO userinfo (userId, userName, battlecode, favechip, "
    + "navi, clearance, points, level, optOut) VALUES (?, ?, ?, ?, ?, ?, "
    + "?, ?, ?)";
const setPointsString = "UPDATE userinfo SET points = ?, level = "
    + "?, userName = ? WHERE userId = ?";
const promoteString = "UPDATE userinfo SET clearance = ? WHERE userId = ?"; //don't know how AllusiveBox does this yet
const getUserString = "SELECT * FROM userinfo WHERE userId = ?";
const userLeftString = "DELETE FROM userinfo WHERE userId = ?";
const deleteMeString = "UPDATE userinfo SET userName = null, battlecode = null, "
    + "favechip = null, navi = null, points = null, "
    + "level = null WHERE userId = ?";
const setBattleCodeString = "UPDATE userinfo SET battlecode = ? WHERE userId = ?";
const setNaviString = "UPDATE userinfo SET navi = ? WHERE userId = ?";
const changeOptString = "UPDATE userinfo SET optOut = ? WHERE userId = ?";
const userLookupString = "SELECT * FROM userinfo WHERE userID = ? OR userID = ? "
    + "OR userName = ? OR userName = ?";



export default class betterSql {

    private _dbOpen : boolean;
    private _Database : Database;
    private _userInsertStmt : Statement;
    private _setPointsStmt : Statement;
    private _promoteStmt : Statement;
    private _getUserStmt : Statement;
    private _setBattleCodeStmt : Statement;
    private _setNaviStmt : Statement;
    private _userLeftStmt : Statement
    private _deleteMeStmt : Statement;
    private _changeOptStmt : Statement;
    private _userLookupStmt : Statement;


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
    async open(path: string): Promise<boolean> {
        debug(`Opening sqlite DB at ${path}`);

        //@ts-ignore
        this._Database = await _open(path, { promise });

        debug(`Preparing statements`);
        this._userInsertStmt = await this._Database.prepare(insertUserString);
        this._setPointsStmt = await this._Database.prepare(setPointsString);
        this._promoteStmt = await this._Database.prepare(promoteString);
        this._getUserStmt = await this._Database.prepare(getUserString);
        this._setBattleCodeStmt = await this._Database.prepare(setBattleCodeString);
        this._setNaviStmt = await this._Database.prepare(setNaviString);
        this._userLeftStmt = await this._Database.prepare(userLeftString);
        this._deleteMeStmt = await this._Database.prepare(deleteMeString);
        this._changeOptStmt = await this._Database.prepare(changeOptString);
        this._userLookupStmt = await this._Database.prepare(userLookupString);
        debug(`Statements prepared`);
        this._dbOpen = true;
        return true;
    }

    isOpen() : boolean {
        return this._dbOpen;
    }

    /**
     * 
     * @param {Discord.Snowflake} userId 
     * 
     * @returns {Promise<userRow>}
     */
    async getUserRow(userId: Discord.Snowflake): Promise<userRow> {
        debug(`I am in the sql.getUserRow function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        return await this._getUserStmt.get(userId);
    }

    /**
     * 
     * @param {Discord.Snowflake} userId 
     * @param {string} username 
     */
    async insertUser(userId: Discord.Snowflake, username: string) {
        debug(`I am in the sql.insertUser function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._userInsertStmt.run(
            userId, username, "0000-0000-0000", null, "megaman", null, 0, 0, 0);
    }

    /**
     * 
     * updates a user's battlecode
     * 
     * @param {Discord.Snowflake} userId
     * @param {string} battleCode
     */
    async setBattleCode(userId: Discord.Snowflake, battleCode: string) {
        debug(`I am in the sql.setBattleCode function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._setBattleCodeStmt.run(battleCode, userId);
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
    async setPoints(userId: Discord.Snowflake, points: number, level: number, username: string) {
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
    async setNavi(userId: Discord.Snowflake, navi: string) {
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
     * @param {clearances} newRole 
     */
    async promoteUser(userId: Discord.Snowflake, newRole: clearances) {
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
    async deleteUser(userId: Discord.Snowflake) {
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
    async optOutUser(userId: Discord.Snowflake) {
        debug(`I am in the sql.optOutUser function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._changeOptStmt.run(optOutChoice.optedOut, userId);
    }

    /**
     * 
     * A user wants to opt back in
     * 
     * @param {Discord.Snowflake} userId
     */
    async optInUser(userId: Discord.Snowflake) {
        debug(`I am in the sql.optInUser function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._changeOptStmt.run(optOutChoice.optedIn, userId);
    }

    /**
     * 
     * allows searching for a user
     * 
     * @param {any} toCheck
     * 
     * @returns {Promise<?userRow>}
     */
    async userLookup(toCheck: any): Promise<userRow | null> {
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
    async userLeft(userId: Discord.Snowflake) {
        debug(`I am in the sql.userLeft function`);
        if (!this._dbOpen) {
            throw new NotConnectedError();
        }
        await this._userLeftStmt.run(userId);
    }


    /**
     * 
     * allows execution of statements directly,
     * only use if really needed
     * 
     * @param {string} stmt 
     */
    async run(stmt: string) {
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
    async get(stmt: string) {
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
        await this._setBattleCodeStmt.finalize();
        this._setBattleCodeStmt = null;
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
        debug(`database successfully closed`);

    }

}
