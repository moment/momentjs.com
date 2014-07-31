var fs       = require('fs'),
	gzipSize = require('gzip-size'),
	moment   = require('../libs/moment'),
	timezone = require('../libs/moment-timezone').tz;

function size (file) {
	var src = fs.readFileSync('./libs/' + file + '.js', 'utf8');

	return {
		size : src.length,
		gzip : gzipSize.sync(src)
	};
}

module.exports = {
	moment                                  : size('moment/moment'),
	moment_min                              : size('moment/min/moment.min'),
	moment_with_locales                     : size('moment/min/moment-with-locales'),
	moment_with_localess_min                : size('moment/min/moment-with-locales.min'),
	moment_timezone                         : size('moment-timezone/moment-timezone'),
	moment_timezone_min                     : size('moment-timezone/builds/moment-timezone.min'),
	moment_timezone_with_data               : size('moment-timezone/builds/moment-timezone-with-data'),
	moment_timezone_with_data_min           : size('moment-timezone/builds/moment-timezone-with-data.min'),
	moment_timezone_with_data_2010_2020     : size('moment-timezone/builds/moment-timezone-with-data-2010-2020'),
	moment_timezone_with_data_2010_2020_min : size('moment-timezone/builds/moment-timezone-with-data-2010-2020.min'),
	moment_version                          : moment.version,
	moment_timezone_version                 : timezone.version,
	moment_timezone_data_version            : timezone.dataVersion
};
