var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3'),
	pr_stats = require('./pr_stats');


var db = pr_stats.db('data/com_sel/', 'pr_full.nddb');

console.log(db.length);
console.log(db.select('diff').count());