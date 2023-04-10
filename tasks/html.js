var path = require('path'),
	docs = require('../data/docs');

function rename (dest, src) {
	var basename = path.basename(src, path.extname(src));

	if (basename === "index") {
		basename = "";
	}

	return path.join(dest, path.dirname(src), basename, 'index.html');
}

module.exports = function(grunt) {
	grunt.config('assemble', {
		'options' : {
			partials   : 'pages/partials/**/*.hbs',
			layoutdir  : 'pages/layout',
			helpers    : 'pages/helpers/**/*.js',
			marked     : { sanitize: false },
			locale     : require('../data/locale.js'),
			size       : require('../data/size.js')
		},
		'moment' : {
			options : {
				docs : docs('docs', 'moment'),
                guides: docs('guides', 'moment')
			},
			files: [{
				expand : true,
				rename : rename,
				dest   : 'build',
				cwd    : 'pages/moment',
				src    : '**/*.{hbs,md}'
			}]
		},
		'moment-timezone' : {
			options : {
				docs : docs('docs', 'moment-timezone'),
				guides: docs('guides', 'moment-timezone')
			},
			files: [{
				expand : true,
				rename : rename,
				dest   : 'build/timezone',
				cwd    : 'pages/moment-timezone',
				src    : '**/*.hbs'
			}]
		}
	});

	grunt.registerTask('html', [
		'assemble:moment',
		'assemble:moment-timezone'
	]);

	grunt.config('watch.html-moment', {
		files: ['{pages,docs/moment,guides/moment}/**/*.{hbs,json,md,js}'],
		tasks: ['assemble:moment']
	});

	grunt.config('watch.html-moment-timezone', {
		files: ['{pages,docs/moment-timezone,guides/moment-timezone}/**/*.{hbs,json,md,js}'],
		tasks: ['assemble:moment-timezone']
	});
};
