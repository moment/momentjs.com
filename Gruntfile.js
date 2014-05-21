module.exports = function(grunt) {
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	grunt.loadTasks('tasks');

	grunt.registerTask('default', ['html', 'js', 'css']);
};
