var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	d3 = require('d3');


var create_html = require('./create_html_copy'),
	create_html_by_ex = require('./create_html_exh');


var DIR = './data/com_sel/';
///////////////////////////


//create_html(DIR);

//create_html_by_ex(DIR, true); // only published
//
create_html_by_ex(DIR, false); // all submissions
