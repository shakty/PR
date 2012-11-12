var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3'),
	pr_stats = require('./pr_stats');





var com = [
   './data/com_sel/', 
   './data/com_rnd_fake/',
];

var coo = [
	'./data/coo_rnd_orig/',
	'./data/coo_sel_err/',
];
           

pr_stats.combine(com, 'data/com/', 'pr_full.nddb');
pr_stats.combine(com, 'data/com/', 'PL.nddb');


pr_stats.combine(coo, 'data/coo/', 'pr_full.nddb');
pr_stats.combine(coo, 'data/coo/', 'PL.nddb');