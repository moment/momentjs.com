module.exports = function(grunt) {
	grunt.config('concat.js', {
		files : {
			'build/static/js/global.js' : [
				'libs/moment/moment.js',
				'libs/moment/min/langs.js',
				'libs/moment-timezone/moment-timezone.js',
				'assets/js/timezone-data-start.js',
				'libs/moment-timezone/moment-timezone.json',
				'assets/js/timezone-data-end.js'
			],
			'build/static/js/timezone-test.js' : [
				'assets/js/test-start.js',
				'libs/nodeunit/nodeunit.js',
				'libs/moment-timezone/tests/**/*.js',
				'assets/js/test.js',
				'assets/js/test-end.js'
			],
			'build/static/js/core-test.js' : [
				'assets/js/test-start.js',
				'libs/nodeunit/nodeunit.js',
				'libs/moment/test/moment/*.js',
				'libs/moment/test/lang/*.js',
				'assets/js/test.js',
				'assets/js/test-end.js'
			],
			'build/static/js/timezone-data.js' : [
				'assets/js/timezone-data.js'
			],
			'build/static/js/timezone-home.js' : [
				'assets/js/timezone-home.js'
			],
			'build/static/js/core-home.js' : [
				'assets/js/core-home.js'
			],
			'build/static/js/docs.js' : [
				'assets/js/docs.js'
			]
		}
	});

	grunt.config('uglify.js', {
		src: 'build/static/js/global.js',
		dest: 'build/static/js/global.min.js'
	});

	grunt.config('copy.js', {
		files : {
			'build/downloads/moment.js'                : 'libs/moment/moment.js',
			'build/downloads/moment.min.js'            : 'libs/moment/min/moment.min.js',
			'build/downloads/moment-with-langs.js'     : 'libs/moment/min/moment-with-langs.js',
			'build/downloads/moment-with-langs.min.js' : 'libs/moment/min/moment-with-langs.min.js',
			'build/downloads/moment-timezone.js'       : 'libs/moment-timezone/moment-timezone.js',
			'build/downloads/moment-timezone.min.js'   : 'libs/moment-timezone/min/moment-timezone.min.js'
		}
	});

	grunt.config('watch.js', {
		files: [
			'assets/**/*.js',
			'libs/**/*.js'
		],
		tasks: ['js']
	});

	grunt.registerTask('js', ['concat:js', 'copy:js', 'uglify:js']);
};
