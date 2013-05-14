var data = require("../../libs/moment-timezone/zones/all");

module.exports = [];

for (var i in data.zones) {
    module.exports.push(i);
}

module.exports.sort();
