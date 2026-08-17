const handlebars = require('handlebars');
const handlebarsPlugin = require('@11ty/eleventy-plugin-handlebars');
const MarkdownIt = require('markdown-it');
const childProcess = require('node:child_process');
const buildAssets = require('./scripts/build-assets');
const loadLocales = require('./data/locales');

const markdown = new MarkdownIt({
	html: true,
	breaks: false,
	linkify: false,
	typographer: false
});

handlebars.registerHelper('markdown', function (options) {
	return new handlebars.SafeString(markdown.render(options.fn(this).trim()));
});

handlebars.registerHelper('is', function (left, right, options) {
	return left === right ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper('isnt', function (left, right, options) {
	return left !== right ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper('toKb', function (bytes) {
	return Number((bytes / 1024).toFixed(1)) + 'k';
});

handlebars.registerHelper('versionDescription', function (version) {
	if (version.includes('-')) {
		const versions = version.split('-');
		return 'From ' + versions[0] + ', Deprecated ' + versions[1];
	}

	return version + '+';
});

function executeDoctests() {
	childProcess.execFileSync(
		process.execPath,
		[
			'--test',
			'--test-reporter=./scripts/doctest-reporter.js',
			'scripts/doctest.js'
		],
		{ stdio: 'inherit' }
	);
}

function runDevelopmentDoctests() {
	console.log('Testing documentation examples...');
	executeDoctests();
}

module.exports = function (eleventyConfig) {
	let initialDoctestComplete = false;
	let documentationChanged = false;

	eleventyConfig.addPlugin(handlebarsPlugin, {
		eleventyLibraryOverride: handlebars
	});

	eleventyConfig.addGlobalData('locale', loadLocales);
	eleventyConfig.addGlobalData('size', function () {
		delete require.cache[require.resolve('./data/size')];
		return require('./data/size');
	});

	eleventyConfig.addWatchTarget('assets');
	eleventyConfig.addWatchTarget('docs');
	eleventyConfig.addWatchTarget('guides');
	eleventyConfig.on('eleventy.before', async function ({ runMode }) {
		await buildAssets();

		if (
			runMode === 'serve' &&
			(!initialDoctestComplete || documentationChanged)
		) {
			runDevelopmentDoctests();
			initialDoctestComplete = true;
			documentationChanged = false;
		}
	});
	eleventyConfig.on('eleventy.beforeWatch', function (changedFiles) {
		if (changedFiles.some(function (file) {
			return /(^|[/\\])(docs|guides)[/\\].+\.(md|markdown)$/i.test(file);
		})) {
			documentationChanged = true;
		}
	});

	return {
		dir: {
			input: 'pages',
			includes: 'partials',
			layouts: 'layout',
			output: 'build'
		},
		templateFormats: ['hbs'],
		markdownTemplateEngine: false,
		htmlTemplateEngine: false
	};
};
