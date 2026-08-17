module.exports = async function * doctestReporter(source) {
	for await (const event of source) {
		if (event.type === 'test:fail') {
			const error = event.data.details.error.cause || event.data.details.error;
			yield 'FAIL ' + event.data.name + '\n' + (error.stack || error) + '\n\n';
		}

		if (event.type === 'test:stderr' || event.type === 'test:stdout') {
			yield event.data.message;
		}

		if (event.type === 'test:summary' && event.data.file === undefined) {
			const counts = event.data.counts;
			const results = [counts.passed + ' passed', counts.skipped + ' skipped'];

			if (counts.failed) {
				results.push(counts.failed + ' failed');
			}

			yield results.join(', ') + '\n';
		}
	}
};
