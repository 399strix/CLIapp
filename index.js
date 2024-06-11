#!/usr/bin/env node

/**
 * techTest
 * CLI Application for BE Techincal Test
 *
 * @author dzakirizadf <https://github.com/399strix>
 */

const filter = require('./generator');

(async () => {
	const args = process.argv.slice(2);
	const filterIndex = args.indexOf("filter");
	const directoryIndex = args.indexOf("-d");
	const startIndex = args.indexOf("-s");
	const endIndex = args.indexOf("-e");
	if (filterIndex === -1 || directoryIndex === -1 || startIndex === -1 || endIndex === -1) {
		console.error(
			"Invalid arguments. Usage: filter -d <directory> -s <start_time> -e <end_time>"
		);
	}

	const directory = args[directoryIndex + 1];
	const start = args[startIndex + 1];
	const end = args[endIndex + 1];
	if (!directory || !start || !end) {
		console.error(
			"Invalid argument values. Please provide valid values for directory, start time, and end time."
		);
	}

	if(filterIndex !== -1) {
		await filter(directory, start, end);
	}
})();
