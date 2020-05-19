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
	moment                                      : size('moment/moment'),
	moment_min                                  : size('moment/min/moment.min'),
	moment_with_locales                         : size('moment/min/moment-with-locales'),
	moment_with_locales_min                     : size('moment/min/moment-with-locales.min'),
	moment_timezone                             : size('moment-timezone/moment-timezone'),
	moment_timezone_min                         : size('moment-timezone/builds/moment-timezone.min'),
	moment_timezone_with_data                   : size('moment-timezone/builds/moment-timezone-with-data'),
	moment_timezone_with_data_min               : size('moment-timezone/builds/moment-timezone-with-data.min'),
	moment_timezone_with_data_1970_2030         : size('moment-timezone/builds/moment-timezone-with-data-1970-2030'),
	moment_timezone_with_data_1970_2030_min     : size('moment-timezone/builds/moment-timezone-with-data-1970-2030.min'),
	moment_timezone_with_data_10_year_range     : size('moment-timezone/builds/moment-timezone-with-data-10-year-range'),
	moment_timezone_with_data_10_year_range_min : size('moment-timezone/builds/moment-timezone-with-data-10-year-range.min'),
	moment_version                              : moment.version,
	moment_timezone_version                     : timezone.version,
	moment_timezone_data_version                : timezone.dataVersion
};
