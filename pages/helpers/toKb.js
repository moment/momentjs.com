module.exports.toKb = function (src) {
	return +((src / 1024).toFixed(1)) + 'k';
};