/**

    cxBot.js Mr. Prog returns the number of ms to the first of next month
    Version: 1
    Author: Th3_M4j0r
    Date Started: 09/01/18
    Date Last Updated: 10/07/18
    Last Update By: Th3_M4j0r

**/

const { debug } = require(`../functions/log.js`);


/**
 * @returns {number}
 */
module.exports.run = () => {

    debug("Calculating miliseconds to next month");

    let currDate = new Date();
    let month = currDate.getMonth();
    let year = currDate.getFullYear();
    month++;
    if (month >= 12) { //month is zero indexed for Date() according to MDN
        month = 0;
        year++;
    }
    let nextMonth = new Date(year, month, 1);
    return nextMonth.getTime() - currDate.getTime();
};