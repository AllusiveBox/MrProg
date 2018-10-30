"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpiffyDate {
    constructor() {
        this._setSpiffyDate();
        this._formateDate();
    }
    _setSpiffyDate() {
        let date = new Date();
        this.h = date.getHours();
        this.m = date.getMinutes();
        this.s = date.getSeconds();
        this.M = date.getMonth() + 1;
        this.D = date.getDate();
        this.Y = date.getFullYear();
    }
    _formateDate() {
        this.h = this.h < 10 ? '0' + this.h : this.h;
        this.m = this.m < 10 ? '0' + this.m : this.m;
        this.s = this.s < 10 ? '0' + this.s : this.s;
        this.D = this.D < 10 ? '0' + this.D : this.D;
        this.M = this.M < 10 ? '0' + this.M : this.M;
        this.formatedDate = `${this.M}/${this.D}/${this.Y}: ${this.h}:${this.m}:${this.s}`;
    }
    getSpiffyDate() {
        return this.formatedDate;
    }
}
exports.default = SpiffyDate;
