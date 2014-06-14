module.exports = function(grunt) {
	grunt.config('sass.css', {
		files : [{
			expand: true,
			cwd : 'assets/css/',
			src: '*.scss',
			dest: '.temp/css/',
			ext: '.css'
		}],
		options : {
			outputStyle : 'compressed'
		}
	});

	grunt.config('autoprefixer.css', {
		options: {
			browsers: ['> 1%', 'last 2 versions', 'ie 9']
		},
		files : [{
			expand: true,
			cwd: '.temp/css/',
			src: '*.css',
			dest: 'build/static/css/'
		}]
	});

	grunt.config('watch.css', {
		files: ['assets/css/**/*'],
		tasks: ['css']
	});

	grunt.registerTask('css', ['sass:css', 'autoprefixer:css']);
};
