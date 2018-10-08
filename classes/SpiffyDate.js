﻿/**
 * 
 * Mr. Prog SpiffyDate Class
 * Version: 1
 * Date Started: 09/21/18
 * Date Last Updated: 09/22/18
 * Last Updated By: AllusiveBox
 * 
 */

class SpiffyDate {
    /**
     * Builds the Spiffy Date Object
     * 
     */

    constructor() {
        this._setSpiffyDate();
        this._formateDate();
    }

    /**
    * Sets the SpiffyDate
    * 
    */

    _setSpiffyDate() {
        // Get Date
        let date = new Date();

        // Figure out Time
        this.h = date.getHours();
        this.m = date.getMinutes();
        this.s = date.getSeconds();

        // Figure out Date
        this.M = date.getMonth() + 1; // 0 is Jan, so want to return +1
        this.D = date.getDate();
        this.Y = date.getFullYear();
    }

    /**
     * Formats the SpiffyDate into a Single String
     * 
     */

    _formateDate() {
        // Format Time
        this.h = this.h < 10 ? '0' + this.h : this.h;
        this.m = this.m < 10 ? '0' + this.m : this.m;
        this.s = this.s < 10 ? '0' + this.s : this.s;

        // Format Date
        this.D = this.D < 10 ? '0' + this.D : this.D;
        this.M = this.M < 10 ? '0' + this.M : this.M;

        // Format String
        this.formatedDate = `${this.M}/${this.D}/${this.Y}: ${this.h}:${this.m}:${this.s}`;
    }

    /**
     * Makes the current date look Spiffy
     * @returns {SpiffyDate}
     * 
     */

    getSpiffyDate() {
        return this.formatedDate;
    }
}

module.exports = SpiffyDate;