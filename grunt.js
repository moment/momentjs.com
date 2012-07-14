module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        concat: {
            dist: {
                src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
                dest: 'dist/built.js'
            }
        }
    });

};