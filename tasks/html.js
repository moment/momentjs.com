var fs        = require('fs'),
    path      = require('path'),
    library   = require('../source/data/library'),
    langs     = require('../source/data/lang.js'),
    swig      = require('swig'),
    ghm       = require('github-flavored-markdown'),
    moment    = require('../libs/moment/moment.js'),
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
    console.log(output);
    return output;
}

module.exports = function(grunt) {

    /*********************************************
        Constants
    *********************************************/

    function main(cb) {
        var data = {
            library : library,
            docs : {},
            langs : langs
        };
        library.ready(function(){
            render(data, cb);
        })
    }

    /*********************************************
        Swig
    *********************************************/

    // syntax highlighting for code in <code> blocks
    function highlight(source) {
        source = source.replace(/\&quot;/g,'"');
        source = source.replace(/<pre>((.|\s)*?)<\/pre>/g, function(original, source){
            return '<pre>' + highlight("javascript", source).value + '</pre>';
        });
        source = source.replace(/&amp;(\w+;)/g,'&$1');
        return source;
    }

    function renderSingle(src, dst, data, cb) {
        var template = swig.compileFile(src);
        var html = template.render(data);

        html = highlight(html);

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

    /*********************************************
        Docs
    *********************************************/


    function machineFriendly(str) {
        return str.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    }

    function normalizeDocs(docs) {
        var method, section, i, j;
        for (i in docs) {
            section = docs[i];
            section.name = section._title || i;
            section.machineName = machineFriendly(i);
            section.body = docsAtPath(filename(['source', 'docs', section.machineName + '.md']));
            for (j in section.methods) {
                method = section.methods[j];
                method.name = method._title || j;
                method.machineName = machineFriendly(j);
                method.body = docsAtPath(filename(['source', 'docs', section.machineName, method.machineName + '.md']));
            }
        }
        return docs;
    }

    function docsAtPath(p) {
        if (fs.existsSync(p)) {
            return ghm.parse(fs.readFileSync(p, 'utf8'), "timrwood/moment");
        }
        return '';
    }

    // build html
    grunt.registerTask('html', 'Build HTML', function() {
        main(this.async());
    });

};
