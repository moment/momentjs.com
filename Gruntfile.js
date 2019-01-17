module.exports = function(grunt) {
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-assemble');

	grunt.loadTasks('tasks');

	grunt.config('clean.default', 'build/*');

	grunt.registerTask('default', ['clean', 'update-locales', 'img', 'html', 'js', 'css']);
};
