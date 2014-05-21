module.exports = function(grunt) {
	grunt.config('concat', {
		all: {
			files : {
				'static/js/global.js' : [
					'libs/moment/moment.js',
					'libs/moment/min/langs.js',
					'libs/moment-timezone/moment-timezone.js',
					'source/js/timezone-data-start.js',
					'libs/moment-timezone/moment-timezone.json',
					'source/js/timezone-data-end.js'
				],
				'static/js/timezone-test.js' : [
					'source/js/test-start.js',
					'libs/nodeunit/nodeunit.js',
					'libs/moment-timezone/tests/**/*.js',
					'source/js/test.js',
					'source/js/test-end.js'
				],
				'static/js/core-test.js' : [
					'source/js/test-start.js',
					'libs/nodeunit/nodeunit.js',
					'libs/moment/test/moment/*.js',
					'libs/moment/test/lang/*.js',
					'source/js/test.js',
					'source/js/test-end.js'
				],
				'static/js/timezone-data.js' : [
					'source/js/timezone-data.js'
				],
				'static/js/timezone-home.js' : [
					'source/js/timezone-home.js'
				],
				'static/js/core-home.js' : [
					'source/js/core-home.js'
				]
			}
		}
	});

	grunt.config('uglify', {
		global: {
			src: 'static/js/global.js',
			dest: 'static/js/global.min.js'
		}
	});

	grunt.config('copy', {
		downloads : {
			files : {
				'downloads/moment.js'                : 'libs/moment/moment.js',
				'downloads/moment.min.js'            : 'libs/moment/min/moment.min.js',
				'downloads/moment-with-langs.js'     : 'libs/moment/min/moment-with-langs.js',
				'downloads/moment-with-langs.min.js' : 'libs/moment/min/moment-with-langs.min.js',
				'downloads/moment-timezone.js'       : 'libs/moment-timezone/moment-timezone.js',
				'downloads/moment-timezone.min.js'   : 'libs/moment-timezone/min/moment-timezone.min.js'
			}
		}
	});

	grunt.config('watch.js', {
		files: [
			'source/**/*.js',
			'libs/**/*.js'
		],
		tasks: ['concat', 'uglify']
	});

	grunt.registerTask('js', ['concat', 'copy', 'uglify']);
};
