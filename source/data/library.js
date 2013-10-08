var fs   = require('fs'),
	zlib = require('zlib'),
	moment = require('../../libs/moment/moment.js'),
	timezone = require('../../libs/moment-timezone/moment-timezone.js').tz;

function filename(fn) {
	fn.unshift(process.cwd());
	var output = fn.join('/');
	return output;
}

function toKb(input){
	var num = parseFloat((input / 1000).toFixed(1), 10);
	return num + 'kb';
}

var core_src = fs.readFileSync(process.cwd() + '/libs/moment/moment.js', 'utf8');
var bundle_src = fs.readFileSync(process.cwd() + '/libs/moment/min/moment-with-langs.js', 'utf8');
var core_min = fs.readFileSync(process.cwd() + '/libs/moment/min/moment.min.js', 'utf8');
var bundle_min = fs.readFileSync(process.cwd() + '/libs/moment/min/moment-with-langs.min.js', 'utf8');
var timezone_src = fs.readFileSync(process.cwd() + '/libs/moment-timezone/moment-timezone.js', 'utf8');
var timezone_min = fs.readFileSync(process.cwd() + '/libs/moment-timezone/min/moment-timezone.min.js', 'utf8');

module.exports = {
	core_size : toKb(core_src.length),
	core_gzipped : null,
        bundle_size : toKb(bundle_src.length),
        bundle_gzipped : null,
	core_version : moment.version,

	timezone_size : toKb(timezone_src.length),
	timezone_gzipped : null,
	timezone_version : timezone.version,

	ready : function (cb) {
		zlib.gzip(core_min, function(err, gzip) {
			module.exports.core_gzipped = toKb(gzip.length);

			zlib.gzip(timezone_min, function(err, gzip) {
				module.exports.timezone_gzipped = toKb(gzip.length);

				zlib.gzip(bundle_min, function(err, gzip) {
					module.exports.bundle_gzipped = toKb(gzip.length);

					cb();
				})
			});
		});
	}
};
