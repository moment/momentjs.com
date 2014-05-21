module.exports = function(grunt) {
	grunt.config('connect.server', {
		options: {
			port: 6060,
			hostname: '*',
			base: 'build',
			livereload: 36060,
			open: true
		}
	});

	grunt.config('watch.livereload', {
		options: {
			debounceDelay: 250,
			livereload: 36060
		},
		files: 'build/**/*'
	});

	grunt.registerTask('server', ['default', 'connect:server', 'watch']);
};
