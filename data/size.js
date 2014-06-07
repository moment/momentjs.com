var fs       = require('fs'),
	gzipSize = require('gzip-size'),
	moment   = require('../libs/moment/moment.js'),
	timezone = require('../libs/moment-timezone/moment-timezone.js').tz;

function size (file) {
	var src = fs.readFileSync('./libs/' + file + '.js', 'utf8');

	return {
		size : src.length,
		gzip : gzipSize.sync(src)
	};
}

module.exports = {
	moment                  : size('moment/moment'),
	moment_min              : size('moment/min/moment.min'),
	moment_with_langs       : size('moment/min/moment-with-langs'),
	moment_with_langs_min   : size('moment/min/moment-with-langs.min'),
	moment_timezone         : size('moment-timezone/moment-timezone'),
	moment_timezone_min     : size('moment-timezone/moment-timezone'),
	moment_version          : moment.version,
	moment_timezone_version : timezone.version
};
