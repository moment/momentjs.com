var fs        = require('fs'),
    library   = require('../data/library'),
    langs     = require('../data/lang'),
    docs      = require('../data/docs'),
    zones     = require('../data/zones'),
    swig      = require('swig'),
    moment    = require("../../libs/moment");

swig.init({
    allowErrors: true,
    autoescape: true,
    cache: false,
    encoding: 'utf8',
    filters: {},
    root: filename(['source', 'templates']),
    tags: {},
    extensions: {},
    tzOffset: 0
});


function filename(fn) {
    fn.unshift(process.cwd());
    var output = fn.join('/');
    return output;
}

function main(grunt, cb) {
    var data = {
        library : library,
        core_docs : docs.core(),
        timezone_docs : docs.timezone(),
        zones : zones,
        langs : langs,
        cachebust : moment().format(),
        global : grunt.option('localhost') && 'global' || 'global.min',
        localhost : grunt.option('localhost') && process.cwd() || '',
        nav : function (path) {
            if (grunt.option('localhost')) {
                return process.cwd() + path + "/index.html";
            } else {
                return path + "/";
            }
        }
    };
    library.ready(function(){
        render(data, cb);
    });
}

function renderSingle(src, dst, data, cb) {
    var template = swig.compileFile(src),
        html = template.render(data);

    fs.writeFile(filename([dst]), html, 'utf8', function(err) {
        console.log('Built html : ' + dst);
        cb();
    });
}

function render(data, cb) {
    renderSingle('core-home.html', 'index.html', data, function(){
        renderSingle('core-test.html', 'test/index.html', data, function(){
            renderSingle('core-docs.html', 'docs/index.html', data, function(){
                renderSingle('timezone-home.html', 'timezone/index.html', data, function(){
                    renderSingle('timezone-test.html', 'timezone/test/index.html', data, function(){
                        renderSingle('timezone-data.html', 'timezone/data/index.html', data, function(){
                            renderSingle('timezone-docs.html', 'timezone/docs/index.html', data, cb);
                        });
                    });
                });
            });
        });
    });
}

module.exports = function(grunt) {
    grunt.registerTask('html', 'Build HTML', function() {
        main(grunt, this.async());
    });
};
