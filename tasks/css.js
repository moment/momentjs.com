module.exports = function(grunt) {
	grunt.config('compass', {
		prod: {
			options: {
				sassDir: 'source/css',
				cssDir: 'build/static/css'
			}
		}
	});

	grunt.config('watch.css', {
		files: [
			'source/css/*',
			'source/css/**/*'
		],
		tasks: 'compass'
	});

	grunt.registerTask('css', ['compass']);
};
