module.exports = function(grunt) {

	grunt.initConfig({
		concat: {
			core_home: {
				src: 'source/js/core-home.js',
				dest: 'static/js/core-home.js'
			},
			core_test: {
				src: [
					'source/js/test-start.js',
					'libs/nodeunit/nodeunit.js',
					'libs/moment/test/moment/*.js',
					'libs/moment/test/lang/*.js',
					'source/js/test.js',
					'source/js/test-end.js'
				],
				dest: 'static/js/core-test.js'
			},
			timezone_home: {
				src: 'source/js/timezone-home.js',
				dest: 'static/js/timezone-home.js'
			},
			timezone_data: {
				src: 'source/js/timezone-data.js',
				dest: 'static/js/timezone-data.js'
			},
			timezone_test: {
				src: [
					'source/js/test-start.js',
					'libs/nodeunit/nodeunit.js',
					'libs/moment-timezone/tests/**/*.js',
					'source/js/test.js',
					'source/js/test-end.js'
				],
				dest: 'static/js/timezone-test.js'
			},
			global: {
				src: [
					'libs/moment/moment.js',
					'libs/moment/min/langs.js',
					'libs/moment-timezone/moment-timezone.js',
					'source/js/timezone-data-start.js',
					'libs/moment-timezone/moment-timezone.json',
					'source/js/timezone-data-end.js'
				],
				dest: 'static/js/global.js'
			}
		},
		uglify: {
			global: {
				src: 'static/js/global.js',
				dest: 'static/js/global.min.js'
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
		watch: {
			css: {
				files: [
					'source/css/*',
					'source/css/**/*'
				],
				tasks: 'compass'
			},
			js: {
				files: [
					'source/**/*.js',
					'libs/**/*.js'
				],
				tasks: ['concat', 'uglify']
			},
			html: {
				files: [
					"source/**/*.md",
					"source/**/*.html",
					"source/**/*.json"
				],
				tasks: ["html"]
			}
		}
	});

	grunt.registerTask("default", ["html", "downloads", "concat", "uglify", "compass"]);

	// plugin tasks
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");

	// tasks
	grunt.loadTasks("source/tasks");
};
