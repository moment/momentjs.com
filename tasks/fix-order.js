module.exports = function (grunt) {
	var fs = require('fs')
		join = require('path').join;

	function getNum(name) {
		return parseInt(name.split('-')[0], 10);
	}

	function pad(number, width) {
		var res = "" + number;
		while (res.length < width) {
			res = "0" + res;
		}
		return res;
	}

	grunt.registerTask(
			'fix-order',
			'restore order in the docs directory',
			function () {
				var dirs = {};
				grunt.file.recurse('docs', function (abspath, rootdir, subdir, filename) {
					if (!(subdir in dirs)) {
						dirs[subdir] = [];
					}
					dirs[subdir].push(filename);
				});
				for (var subdir in dirs) {
					var files = dirs[subdir];
					files.sort();
					files.forEach(function (file, idx) {
						var num = getNum(file);
						if (num !== idx) {
							var from = join('docs', subdir, file);
							var to = join('docs', subdir, pad(idx, 2) + '-' + file.split('-').slice(1).join('-'));
							grunt.log.ok('mv', from, to);
							fs.renameSync(from, to);
						}
					});
				}
			}
	)
}
