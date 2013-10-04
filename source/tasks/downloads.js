var async = require('async');
    fs =    require('fs');

function filename(fn) {
    fn.unshift(process.cwd());
    var output = fn.join('/');
    return output;
}

function copyDownloads(grunt, cb) {
    async.parallel([
        copier(["libs", "moment", "moment.js"]),
        copier(["libs", "moment", "min", "moment.min.js"]),
        copier(["libs", "moment", "min", "moment+langs.js"]),
        copier(["libs", "moment", "min", "moment+langs.min.js"]),
        copier(["libs", "moment-timezone", "moment-timezone.js"]),
        copier(["libs", "moment-timezone", "min", "moment-timezone.min.js"])
    ], cb);
}

function copier(path) {
    return function(cb){
        var src = filename(path),
            dest = filename(["downloads", path[path.length - 1]]);
        fs.createReadStream(src).pipe(fs.createWriteStream(dest));
        cb();
    }
}

module.exports = function(grunt) {
    grunt.registerTask('downloads', 'Copy downloads to their folder', function() {
        copyDownloads(grunt, this.async());
    });
};
