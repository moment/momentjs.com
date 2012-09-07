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

    // build html
    grunt.registerTask('site', 'Build HTML', function() {
        done = this.async();
        main();
    });
};


/*********************************************
    Constants
*********************************************/


var templateVars = {
    version : moment.version,
    minsize : 0,
    srcsize : 0,
    docs : null,
    langs : require('./source/langs/data.js')
}
var running = 0;
var done;

function main() {
    var PATH_TO_LIB = path.normalize(__dirname + '/libs/moment/');
    var src = fs.readFileSync(PATH_TO_LIB + 'moment.js', 'utf8');
    var min = fs.readFileSync(PATH_TO_LIB + 'min/moment.min.js', 'utf8');
    templateVars.srcsize = toKb(src.length);

    zlib.gzip(min, function(err, data) {
        templateVars.minsize = toKb(data.length);
        onTemplatesReady();
    });

    fs.readFile('source/docs/docmap.json', 'utf8', function (err, data){
        var docs = JSON.parse(data);
        normalizeDocs(docs);
        templateVars.docs = docs;
        onTemplatesReady();
    });
};


/*********************************************
    Jade
*********************************************/


function startBuild() {
    running++;
}

function endBuild() {
    running--;
    if (running == 0) {
        done();
    }
}

function toKb(input){
    var num = Math.round(input / 100) / 10;
    return num + 'k';
}

// syntax highlighting for code in <code> blocks
function highlightJs(source) {
    source = source.replace(/\&quot;/g,'"');
    source = source.replace(/<pre>((.|\s)*?)<\/pre>/g, function(original, source){
        return '<pre>' + highlight("javascript", source).value + '</pre>';
    });
    source = source.replace(/&amp;(\w+;)/g,'&$1');
    return source;
}

function jadeToHtml(jadePath, htmlPath) {
    startBuild();
    fs.readFile('source/pages/' + jadePath + '.jade', 'utf8', function(err, data){
        var output = jade.compile(data, {
            filename : 'source/template/html.jade'
        })(templateVars);

        output = highlightJs(output);

        fs.writeFile(htmlPath + 'index.html', output, 'utf8', function(err) {
            console.log('Built html : ' + htmlPath);
            endBuild();
        });
    });
}

function onTemplatesReady() {
    if (!templateVars.docs || !templateVars.minsize) {
        return;
    }
    jadeToHtml('home', '');
    jadeToHtml('test', 'test/');
    jadeToHtml('docs', 'docs/');
}


/*********************************************
    Docs
*********************************************/


function machineFriendly(str) {
    return str.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

function normalizeDocs(docs) {
    var method, section;
    for (i in docs) {
        section = docs[i];
        section.name = section._title || i;
        section.machineName = machineFriendly(i);
        section.body = docsAtPath('source/docs/' + section.machineName + '.md');
        for (j in section.methods) {
            method = section.methods[j];
            method.name = method._title || j;
            method.machineName = machineFriendly(j);
            method.body = docsAtPath('source/docs/' + section.machineName +'/' + method.machineName + '.md');
        }
    }
}

function docsAtPath(p) {
    if (fs.existsSync(p)) {
        return ghm.parse(fs.readFileSync(p, 'utf8'), "timrwood/moment");
    }
    return '';
}
