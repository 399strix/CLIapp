const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
	clear: {
		type: `boolean`,
		default: true,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: false,
		desc: `Don't clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `dbg`,
		desc: `Print debug info`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	},
	directory: {
		type: `string`,
		alias: `d`,
		desc: `Directory to filter`,
		demandOption: true
	},
	start: {
		type: `string`,
		alias: `s`,
		desc: `Start time in RFC3339 format`,
		demandOption: true
	},
	end: {
		type: `string`,
		alias: `e`,
		desc: `End time in RFC3339 format`,
		demandOption: true
	},
	output: {
		type: `string`,
		alias: `o`,
		desc: `Output CSV file`,
		demandOption: true
	}
};

const commands = {
	help: { desc: `Print help info` }
};

const helpText = meowHelp({
	name: `filter`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

module.exports = meow(helpText, options);
