"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnsupportedMethodType extends Error {
    constructor(cause, message = null) {
        if (message === null) {
            message = (`Unsupported MethodType: ${cause} was passed.\n`
                + `Supported MethodTypes are: 'PLAYING', 'STREAMING', 'LISTENING', and 'WATCHING'.`);
        }
        super(message);
        this.name = "UnsupportedMethodType";
        this.cause = cause;
    }
}
exports.UnsupportedMethodType = UnsupportedMethodType;
class NotConnectedError extends Error {
    constructor(message = null) {
        if (message === null) {
            message = (`Not connected to a database. Make sure to use the 'open' function first.`);
        }
        super(message);
        this.name = "NotConnectedError";
    }
}
exports.NotConnectedError = NotConnectedError;
class NoDefinedRole extends Error {
    constructor(commandName, message = null) {
        if (message === null) {
            message = (`No role set for ${commandName}. Please update files/roles.json and add a role for the ${commandName} entry.\n`
                + `For a template, please check in the templates/ directory.`);
        }
        super(message);
        this.name = "NoDefinedRole";
        this.cause = "Invalid or null role ID.";
    }
}
exports.NoDefinedRole = NoDefinedRole;
class NoBentQuotesDefined extends Error {
    constructor(message = null) {
        if (message === null) {
            message = ("Unable to locate files/bentquote.txt.\n"
                + "Please ensure that there is a bentquote.txt file, and that it is in the correct directory.");
        }
        super(message);
        this.name = "NoBentQuotesDefined";
    }
}
exports.NoBentQuotesDefined = NoBentQuotesDefined;
class NoTextFacesDefined extends Error {
    constructor(message = null) {
        if (message === null) {
            message = ("Unable to locate files/textfaces.txt.\n"
                + "Please ensure that there is a textfaces.txt file, and that it is in the correct directory.");
        }
        super(message);
        this.name = "NoTextFacesDefined";
    }
}
exports.NoTextFacesDefined = NoTextFacesDefined;
class NoAnnouncementTextDefined extends Error {
    constructor(message = null) {
        if (message === null) {
            message = ("Unable to locate files/announcement.txt.\n"
                + "Please ensure that there is an announcement.txt file, and that it is in the correct directory.");
        }
        super(message);
        this.name = "NoAnnouncementTextDefined";
    }
}
exports.NoAnnouncementTextDefined = NoAnnouncementTextDefined;
