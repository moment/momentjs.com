module.exports = function (grunt) {
	var fs = require('fs'),
		join = require('path').join;

	grunt.registerTask(
			'update-locales',
			'update data/locales.js to match locales defined in moment/src/locales',
			function () {
				var localesDir = 'libs/moment/src/locale',
					locales = {en: 'English (United States)'},
					numErrors = 0;
				fs.readdirSync(localesDir).forEach(function (localeFile) {
					var localeName = null, localeAbbr = null;
					grunt.file.read(join(localesDir, localeFile)).split(/\n|\r|\r\n/).forEach(function (line) {
						if (line.slice(0, 10) === '//! locale') {
							localeName = line.split(' : ')[1].split(' [')[0].trim();
							localeAbbr = line.split(' : ')[1].split(/\[|\]/)[1];
						}
					});
					if (localeName == null) {
						grunt.log.error('wtf', localeFile);
						numErrors += 1;
					} else if (localeAbbr !== localeFile.split('.')[0]) {
						grunt.log.error('wtf2', localeFile, localeAbbr, localeName);
						numErrors += 1;
					} else {
						// grunt.log.writeln(localeAbbr, localeName);
						locales[localeAbbr] = localeName;
					}
				});
				if (numErrors > 0) {
					return;
				}
				grunt.file.write('data/locale.js',
						'// this file is auto generated from tasks/update-locales.js every release\n' +
						'module.exports =' + JSON.stringify(Object.keys(locales).map(function (key) {
					return {
						abbr: key,
						name: locales[key]
					}
				}).sort(function (a, b) {
					if (a.name < b.name) { return -1; }
					if (a.name > b.name) { return 1; }
					return 0;
				}), null, 4) + ';\n');
			}
	);
};
