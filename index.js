#!/usr/bin/env node

/**
 * techTest
 * CLI Application for BE Techincal Test
 *
 * @author dzakirizadf <https://github.com/399strix>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const filter = require('./utils/filter');

const input = cli.input;
const flags = cli.flags;
const { clear, debug, directory, start, end} = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	debug && log(flags);

	if(input.includes(`filter`)) {
		await filter(directory, start, end);
	}
})();
