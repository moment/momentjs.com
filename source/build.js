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
var docsNavHtml = '';
var docsCopyHtml = '';
var docsArgs = {};


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
    return num + 'k';
}

function jadeToHtml(jadePath, htmlPath, args) {
    if (!args) {
        args = {};
    }
    args.version = VERSION;
    args.minsize = toKb(MINSIZE);
    args.srcsize = toKb(SRCSIZE);
    args.builddate = BUILD_DATE;

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
    var min = fs.readFileSync(PATH_TO_LIB + 'min/moment.min.js', 'utf8');
    SRCSIZE = src.length;
    gzip(min, function(err, data) {
        MINSIZE = data.length;
        jadeToHtml('home', '/');
        jadeToHtml('test', '/test/');

        docsArgs.version = VERSION;
        docsArgs.minsize = toKb(MINSIZE);
        docsArgs.srcsize = toKb(SRCSIZE);
        docsArgs.builddate = BUILD_DATE;
        buildDocs();
    });
})();


/*********************************************
    Docs
*********************************************/


function machineFriendly(str) {
    return str.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

function buildDocs() {
    var docPath = path.normalize(__dirname + '/docs/');
    var docmap = JSON.parse(fs.readFileSync(docPath + 'docmap.json', 'utf8'));
    var i, j;
    var html = '';
    for (i in docmap) {
        buildHeaderStart();
        buildHeader(i, docmap[i]);
        for (j in docmap[i]) {
            if (typeof docmap[i][j] != "string") {
                buildBody(machineFriendly(i), j, docmap[i][j]);
            }
        }
        buildHeaderEnd();
    }
    var arg = {
        docsCopyHtml : docsCopyHtml,
        docsNavHtml : docsNavHtml
    }
    jadeToHtml('docs', '/docs/', arg);
}

function buildHeaderStart() {
    docsNavHtml += "<li class='dropdown'>";
}

function buildHeaderEnd() {
    docsNavHtml += "</ul></li>";
}

function buildHeader(title, object) {
    var humanTitle = object._title || title;
    var machineTitle = machineFriendly(title);
    docsNavHtml += "<a class='dropdown-toggle' data-toggle='dropdown' href='#'>";
    if (object._icon) {
        docsNavHtml += "<i class='icon-" + object._icon + "'></i> ";
    }
    docsNavHtml += humanTitle + "<b class='caret'></b></a><ul class='dropdown-menu'>";
    docsCopyHtml += "<div class='row'><div class='span12'><a class='target' name='/" + machineTitle + "/'></a><h2>" + humanTitle + "</h2></div>";
    docsCopyHtml += "<div class='span12'>";
    docsCopyHtml += docsAtPath(path.normalize(__dirname + '/docs/' + machineTitle + '.jade'));
    docsCopyHtml += "</div></div>";
}

function buildBody(parent, title, object) {
    var humanTitle = object._title || title;
    var machineTitle = machineFriendly(title);
    docsNavHtml += "<li><a href='#/" + parent + '/' + machineTitle + "/'>" + humanTitle + "</a></li>";
    docsCopyHtml += "<div class='row'><a class='target' name='/" + parent + '/' + machineTitle + "/'></a>";
    // title block
    docsCopyHtml += "<div class='span12'>";
    docsCopyHtml += "<h3 class='doc-row'>" + humanTitle + "</h3>";
    docsCopyHtml += "</div><div class='span4'>";
    if (object._signature) {
        docsCopyHtml += "<pre>" + object._signature + "</pre>";
    }
    if (object._version) {
        docsCopyHtml += "<div style='text-align:right'>Available in version <span class='label'>" + object._version + "</span></div>";
    }
    docsCopyHtml += "&nbsp;</div>";

    // docs block
    docsCopyHtml += "<div class='span8'>";
    docsCopyHtml += docsAtPath(path.normalize(__dirname + '/docs/' + parent + '/' +machineTitle + '.jade'));
    docsCopyHtml += "</div>";

    // end
    docsCopyHtml += "</div>";
}

function docsAtPath(p) {
    if (path.existsSync(p)) {
        var snippet = fs.readFileSync(p, 'utf8');
        var compile = jade.compile(snippet);
        return compile(docsArgs);
    }
    return '';
}