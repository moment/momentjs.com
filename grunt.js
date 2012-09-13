var fs   = require('fs'),
    path = require('path'),
    zlib = require('zlib'),
    jade = require('jade'),
    ghm = require('github-flavored-markdown'),
    moment = require('./libs/moment/moment.js'),
    highlight = require("highlight.js").highlight;

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
        site: {
            files: [
                "source/docs/**/*",
                "source/template/**/*",
                "source/pages/**/*"
            ]
        },
        watch: {
            compass: {
                files: 'source/css/*.scss',
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
            site: {
                files: "<config:site.files>",
                tasks: 'site'
            }
        }
    });

    // plugin tasks
    grunt.loadNpmTasks('grunt-compass');

    // tasks
    grunt.loadTasks("tasks");
};
