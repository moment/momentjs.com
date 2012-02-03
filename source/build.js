var fs     = require('fs'),
    path = require('path'),
    gzip   = require('gzip'),
    jade = require('jade'),
    moment = require('../libs/moment/moment.js');


/*********************************************
    Constants
*********************************************/


var PATH_TO_LIB = path.normalize(__dirname + '/../libs/moment/');
var VERSION = moment.version;
var SRCSIZE = 0;
var MINSIZE = 0;
var BUILD_DATE = moment().format('YYMMDD_HHmmss');


/*********************************************
    Helpers
*********************************************/

/*
 * function to minify a string and write to a file
 *
 * @param {String} source The source JS
 * @param {String} dest The file destination
 */
function makeFile(p, contents) {
    var filename = path.normalize(__dirname + '/../deploy/' + p + '/index.html');

    fs.writeFile(filename, contents, 'utf8', function(err) {
        console.log('Built html : ' + filename);
    });
}


/*********************************************
    Jade
*********************************************/


function toKb(input){
    var num = Math.round(input / 100) / 10;
    return num + 'kb';
}

function jadeToHtml(jadePath, htmlPath) {
    var args = {
        version : VERSION,
        minsize : toKb(MINSIZE),
        srcsize : toKb(SRCSIZE),
        builddate : BUILD_DATE
    };

    var compileFilename = path.normalize(__dirname + '/template/html.jade');
    var pathToJade = path.normalize(__dirname + '/pages/' + jadePath + '.jade');

    var snippet = fs.readFile(pathToJade, 'utf8', function(err, data){
        var compile = jade.compile(data, {
            filename : compileFilename
        });
        makeFile(htmlPath, compile(args));
    });
}

(function() {
    var src = fs.readFileSync(PATH_TO_LIB + 'moment.js', 'utf8');
    var min = fs.readFileSync(PATH_TO_LIB + 'moment.min.js', 'utf8');
    SRCSIZE = src.length;
    gzip(min, function(err, data) {
        MINSIZE = data.length;
        jadeToHtml('home', '/');
        jadeToHtml('docs', '/docs/');
        jadeToHtml('test', '/test/');
    });
})();
