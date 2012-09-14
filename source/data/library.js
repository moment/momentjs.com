var fs   = require('fs'),
    zlib = require('zlib'),
    moment = require('../../libs/moment/moment.js');

function filename(fn) {
    fn.unshift(process.cwd());
    var output = fn.join('/');
    return output;
}

function toKb(input){
    var num = Math.round(input / 100) / 10;
    return num + 'k';
}

var src = fs.readFileSync(filename(['libs', 'moment', 'moment.js']), 'utf8');
var min = fs.readFileSync(filename(['libs', 'moment', 'min', 'moment.min.js']), 'utf8');

module.exports = {
    size : toKb(src.length),
    gzipped : null,
    version : moment.version,
    ready : function (cb) {
        zlib.gzip(min, function(err, gzip) {
            module.exports.gzipped = toKb(gzip.length);
            cb();
        });
    }
};
