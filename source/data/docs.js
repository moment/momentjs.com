var fs            = require('fs'),
	highlight     = require("highlight.js").highlight,
	marked        = require('marked'),
	core_docs     = require("./core_docs.json"),
	timezone_docs = require("./timezone_docs.json");

marked.setOptions({
	highlight : function (code, lang) {
		if (lang === "javascript") {
			return highlight("javascript", code).value;
		}
		return code;
	}
});

function filename(fn) {
	fn.unshift(process.cwd());
	var output = fn.join('/');
	return output;
}

/*********************************************
	Docs
*********************************************/


function machineFriendly(str) {
	return str.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

function normalizeDocs(docs) {
	var method, section, i, j;
	for (i = 0; i < docs.length; i++) {
		section = docs[i];
		section.title = section.title || section.key;
		section.key = machineFriendly(section.key);
		section.body = docsAtPath(filename(['source', 'docs', section.key + '.md']));

		for (j = 0; j < section.methods.length; j++) {
			method = section.methods[j];
			method.title = method.title || method.key;
			method.key = machineFriendly(method.key);

			if (method.signature && method.signature.join) {
				method.signature = method.signature.join('\n');
			}

			method.body = docsAtPath(filename(['source', 'docs', section.key, method.key + '.md']));
		}
	}
	return docs;
}

function docsAtPath(p) {
	if (fs.existsSync(p)) {
		return marked(fs.readFileSync(p, 'utf8'));
	}
	return '';
}

module.exports = {
	core : function () {
		return normalizeDocs(core_docs);
	},
	timezone : function () {
		return normalizeDocs(timezone_docs);
	}
};
