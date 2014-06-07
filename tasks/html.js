var path = require('path');

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
			lang       : require('../data/lang.js'),
			size       : require('../data/size.js')
		},
		'moment' : {
			options : {
				docs : require('../.temp/docs/moment.json')
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
				docs : require('../.temp/docs/moment-timezone.json')
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
		'docs:moment',
		'docs:moment-timezone',
		'assemble:moment',
		'assemble:moment-timezone'
	]);

	grunt.config('watch.html-moment', {
		files: [
			'.temp/docs/moment.json',
			'pages/**/*.{hbs,json,md}'
		],
		tasks: ['assemble:moment']
	});

	grunt.config('watch.html-moment-timezone', {
		files: [
			'.temp/docs/moment-timezone.json',
			'pages/**/*.{hbs,json,md}'
		],
		tasks: ['assemble:moment-timezone']
	});
};
