var path = require('path'),
	yfm  = require('assemble-yaml');

module.exports = function (grunt) {
	grunt.registerTask('docs', function (root) {
		if (root !== 'moment' && root !== 'moment-timezone') {
			throw new Error("Missing project name.\n\nUse `grunt docs:moment` or `grunt docs:moment-timezone`");
		}

		var files = grunt.file.expand(path.join('docs', root, '**/*.md')),
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
			item.edit = 'https://github.com/moment/momentjs.com/blob/master/docs/' + root + '/' + groupPath + '/' + itemPath + '.md';
		});

		grunt.file.write('.temp/docs/' + root + '.json', JSON.stringify(groups, null, 4));
	});



	grunt.config('watch.docs-moment', {
		files: ['docs/moment/**/*.md'],
		tasks: ['docs:moment']
	});

	grunt.config('watch.docs-moment-timezone', {
		files: ['docs/moment-timezone/**/*.md'],
		tasks: ['docs:moment-timezone']
	});
};