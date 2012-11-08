var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3');


var stats_copy =  require('./stats_copy'),
	stats_faces_pub =  require('./stats_faces_pub'),
	stats_faces_self =  require('./stats_faces_self'),
	stats_faces =  require('./stats_faces'),
	stats_ingroup =  require('./stats_ingroup'),
	stats_players =  require('./stats_players'),
	stats_pubs =  require('./stats_pubs'),
	stats_reviews =  require('./stats_reviews'),
	stats_subs =  require('./stats_subs'),
	stats_win_lose =  require('./stats_win_lose');


var DIR = './data/com_sel/';
//var DIR = './data/com_rnd_fake/';
//var DIR = './data/coo_sel_err/';

// COPIES
//stats_copy(DIR, 'ROUND_STATS');
//stats_copy(DIR, 'ROUND_STATS_NORM');
//stats_copy(DIR, 'DISTANCE_VS_SCORE');


//stats_faces_pub(DIR);
//
//stats_faces_self(DIR);
//
//stats_faces(DIR);
//
//stats_ingroup(DIR);
//
//stats_players(DIR);
//
//stats_pubs(DIR);
//
//stats_reviews(DIR, 'ROUND_STATS');
//
//stats_reviews(DIR, 'DISTANCE_VS_SCORE');

//stats_subs(DIR);
//stats_subs(DIR, 'TRANSFORM');

stats_win_lose(DIR);


