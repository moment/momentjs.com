var data = require("../../libs/moment-timezone/moment-timezone.json");

module.exports = [];

for (var i in data.zones) {
    module.exports.push(i);
}

module.exports.sort();
