var fs   = require('fs'),
    path = require('path'),
    toMarkdown = require('to-markdown').toMarkdown,
    jade = require('jade');


function jadeToMarkdown(input) {
    var output = jade.compile(input, {
        pretty: true
    })({});

    output = toMarkdown(output);
    output = output.replace(/<pre>/g, '\n```javascript\n');
    output = output.replace(/<\/pre>/g, '\n```\n');

    return output;
}

function convertJadeToMarkdown(file){
    fs.readFile(file, 'utf8', function(err, data){
        if (err) {
            throw err;
        }

        fs.writeFile(file.replace('.jade', '.md'), jadeToMarkdown(data), function (err) {
            if (err) {
                throw err;
            }
            console.log('It\'s saved!');
        });
    });
    console.log(file);
}

function recurseFolder(folder) {
    fs.readdirSync(folder).forEach(function(file){
        //console.log(file);
        if (file.indexOf('.') > -1) {
            if (file.indexOf('.jade') > -1) {
                convertJadeToMarkdown(folder + '/' + file);
            }
        } else {
            recurseFolder(folder + '/' + file);
        }
    });
}

recurseFolder('./source/docs');
