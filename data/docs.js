var path = require('path'),
	yfm  = require('assemble-yaml'),
	grunt = require('grunt');

module.exports = function (type, root) {
	var files = grunt.file.expand(path.join(type, root, '**/*.md')),
		groups = [],
		cache = {};

	files.forEach(function (file) {
		var data      = yfm.extract(file),
			groupPath = path.basename(path.dirname(file)),
			itemPath  = path.basename(file, '.md'),
			groupSlug = groupPath.replace(/^\d\d-/, ''),
			itemSlug  = itemPath.replace(/^\d\d-/, ''),
			group     = cache[groupSlug],
			item      = data.context;

		if (!group) {
			group = cache[groupSlug] = {
				slug : groupSlug,
				items : []
			};
			groups.push(group);
		}

		if (itemPath === '00-intro') {
			group.title = item.title;
		}

		group.items.push(item);

		item.body = data.content;
		item.slug = groupSlug + '/' + itemSlug;
		item.edit = 'https://github.com/moment/momentjs.com/blob/master/' + type + '/' + root + '/' + groupPath + '/' + itemPath + '.md';
	});

	return groups;
};
