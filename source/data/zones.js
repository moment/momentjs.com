var data = require("../../libs/moment-timezone/moment-timezone.json"),
	name, group,
	i;

module.exports = {};

for (i in data.meta) {
	name = i.split('/');
	group = name.shift();

	if (!name.length) {
		name = [i];
		group = 'Generic';
	}

	if (!module.exports[group]) {
		module.exports[group] = [];
	}
	module.exports[group].push({
		name : name.join('/'),
		group : group,
		id : i
	});
}
