module.exports = function(grunt) {
	grunt.config('gh-pages', {
		options: {
			base: 'build'
		},
		src: ['**']
	});

	grunt.config('copy.deploy', {
		expand: true,
		src: [
			'favicon.ico',
			'CNAME'
		],
		dest: 'build'
	});

	grunt.registerTask('deploy', ['default', 'copy:deploy', 'gh-pages']);
};
