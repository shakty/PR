if (!process.argv || !process.argv.length) {
	console.log('No input argument. Aborting');
	return;
}

// 0 = node, 1 ex.js
var FUNC = process.argv[2],
	DIR = process.argv[3],
	ACTION = process.argv[4];

var func = require('./' + FUNC);
func(DIR, ACTION);


