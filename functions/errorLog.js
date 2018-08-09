/**

    cxBot.js Mr. Prog Error Logging Script
    Version: 2
    Author: AllusiveBox
    Date Started: 08/08/18
    Date Last Updated: 08/08/18

**/

// Load in Required Libraries and Files
const fs = require(`fs`);
const config = require(`../files/config.json`);
const spiffyDate = require(`../functions/getSpiffyDate.js`);

module.exports.log = (error) => {
  // Declare Necessary Variables
  var stream = fs.createWriteStream("log.txt", {flags: 'a'});
  // Get Spiffy Date
  let date = spiffyDate.run();

  // Combine the String
  error = `${date}> ERROR: ${error}\n`;

  // Write to Log File
  stream.write(`${error}`);
  stream.end();

  return console.log(error);
}
