module.exports = function(grunt) {

	grunt.initConfig({
		concat: {
			tests: {
				src: [
					'source/js/iife_start.js',
					'libs/nodeunit/nodeunit.js',
					'libs/moment/test/moment/*.js',
					'libs/moment/test/lang/*.js',
					'source/js/test.js',
					'source/js/iife_end.js'
				],
				dest: 'static/js/tests.js'
			},
			timezone_tests: {
				src: [
					'source/js/iife_start.js',
					'libs/nodeunit/nodeunit.js',
					'libs/moment-timezone/tests/**/*.js',
					'source/js/test.js',
					'source/js/iife_end.js'
				],
				dest: 'static/js/timezone-tests.js'
			},
			langs: {
				src: [
					'libs/moment/min/langs.js'
				],
				dest: 'static/js/langs.js'
			},
			moment: {
				src: [
					'libs/moment/moment.js'
				],
				dest: 'static/js/moment.js'
			},
			moment_timezone: {
				src: [
					'libs/moment-timezone/moment-timezone.js'
				],
				dest: 'static/js/moment-timezone.js'
			}
		},
		uglify: {
			home: {
				src: [
					'libs/moment/moment.js',
					'libs/moment/min/langs.js',
					'source/js/home.js'
				],
				dest: 'static/js/home.min.js'
			}
		},
		compass: {
			prod: {
				options: {
					sassDir: 'source/css',
					cssDir: 'static/css'
				}
			}
		},
		html: {
			files: [
				"source/docs/**/*",
				"source/templates/*"
			]
		},
		watch: {
			compass: {
				files: [
					'source/css/*',
					'source/css/**/*'
				],
				tasks: 'compass'
			},
			concat: {
				files: [
					'<config:concat.tests.src>',
					'<config:concat.langs.src>',
					'<config:concat.moment.src>'
				],
				tasks: 'concat'
			},
			min: {
				files: '<config:min.home.src>',
				tasks: 'min'
			},
			html: {
				files: "<config:html.files>",
				tasks: 'html'
			}
		}
	});

	grunt.registerTask("default", ["html", "concat", "uglify", "compass"]);

	// plugin tasks
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");

	// tasks
	grunt.loadTasks("source/tasks");
};
