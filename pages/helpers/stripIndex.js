module.exports.stripIndex = function (src) {
	if (src === 'index.html') {
		return '.';
	}
	return src.replace('index.html', '');
};