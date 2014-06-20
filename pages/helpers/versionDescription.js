module.exports.versionDescription = function (versionString) {
    var from, to, versions;
    if (versionString.match('-')) {
        versions = versionString.split('-');
        from = versions[0];
        to = versions[1];
        return "From " + from + ", Deprecated " + to;
    } else {
        return versionString + '+';
    }
};
