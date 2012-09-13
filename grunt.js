module.exports = function(grunt) {

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
        },
        compass: {
            dev: {
                src: 'source/css',
                dest: 'css',
                outputstyle: 'expanded',
                linecomments: true
            },
            prod: {
                src: 'source/css',
                dest: 'css',
                outputstyle: 'compressed',
                linecomments: false,
                forcecompile: true
            }
        },
        html: {
            files: [
                "source/docs/**/*",
                "source/templates/*"
            ]
        },
        watch: {
            compass: {
                files: [
                    'source/css/*',
                    'source/css/**/*'
                ],
                tasks: 'compass'
            },
            concat: {
                files: [
                    '<config:concat.tests.src>',
                    '<config:concat.langs.src>',
                    '<config:concat.moment.src>'
                ],
                tasks: 'concat'
            },
            min: {
                files: '<config:min.home.src>',
                tasks: 'min'
            },
            html: {
                files: "<config:html.files>",
                tasks: 'html'
            }
        }
    });

    grunt.registerTask("default", "html compass concat min");

    // plugin tasks
    grunt.loadNpmTasks('grunt-compass');

    // tasks
    grunt.loadTasks("tasks");
};
