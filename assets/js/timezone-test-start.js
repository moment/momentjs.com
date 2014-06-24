(function(){
    var module = {};
    var require = function(str){
        return str.indexOf('helper') > -1 ? module.exports : window.moment;
    }
    var exports = {};