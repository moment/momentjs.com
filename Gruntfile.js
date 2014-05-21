module.exports = function(grunt) {
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	grunt.loadTasks('tasks');

	grunt.config('clean.default', 'build/*');

	grunt.registerTask('default', ['clean', 'img', 'html', 'js', 'css']);
};
