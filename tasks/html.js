var fs        = require('fs'),
    library   = require('../source/data/library'),
    langs     = require('../source/data/lang'),
    docs      = require('../source/data/docs'),
    swig      = require('swig'),
    highlight = require("highlight.js").highlight;


swig.init({
    allowErrors: true,
    autoescape: true,
    cache: true,
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

function main(cb) {
    var data = {
        library : library,
        docs : docs,
        langs : langs
    };
    library.ready(function(){
        render(data, cb);
    })
}

function highlightJs(source) {
    source = source.replace(/\&quot;/g,'"');
    source = source.replace(/<pre[^>]*>((.|\s)*?)<\/pre>/g, function(original, source){
        console.log(source);
        var output = '<pre>' + highlight("javascript", source).value + '</pre>';
        console.log(output);
        return output;
    });
    source = source.replace(/&amp;(\w+;)/g,'&$1');
    return source;
}

function renderSingle(src, dst, data, cb) {
    var template = swig.compileFile(src);
    var html = template.render(data);

    //html = highlightJs(html);

    fs.writeFile(filename([dst]), html, 'utf8', function(err) {
        console.log('Built html : ' + dst);
        cb();
    });
}

function render(data, cb) {
    renderSingle('home.html', 'index.html', data, function(){
        renderSingle('test.html', 'test/index.html', data, function(){
            renderSingle('docs.html', 'docs/index.html', data, cb);
        });
    });
}

module.exports = function(grunt) {
    grunt.registerTask('html', 'Build HTML', function() {
        main(this.async());
    });
};
