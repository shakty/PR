var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3');


var load_faces = require('./load_faces'),
	load_reviews = require('./load_reviews'),
	load_evas = require('./load_eva'),
	load_subs = require('./load_sub'),
	load_copies = require('./load_copy');


var DIR = './data/com_sel/';
//var DIR = './data/sample/';
///////////////////////


//load_faces(DIR);

//load_subs(DIR);

//load_evas(DIR);

//load_copies(DIR);



// Ingroup
load_reviews(DIR);

