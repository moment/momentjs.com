module.exports = function(grunt) {

    // Project configuration.
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
                dest: 'js/tests.js'
            },
            langs: {
                src: [
                    'libs/moment/lang/*.js'
                ],
                dest: 'js/langs.js'
            },
            moment: {
                src: [
                    'libs/moment/moment.js'
                ],
                dest: 'js/moment.js'
            }
        },
        min: {
            home: {
                src: [
                    'libs/moment/moment.js',
                    'libs/moment/lang/*.js',
                    'source/js/home.js'
                ],
                dest: 'js/home.min.js'
            }
        }
    });

};