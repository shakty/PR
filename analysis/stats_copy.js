var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3');


// Load DATA
var db = new NDDB();

db.h('player', function(gb) {
	return gb.player.id;
});
db.h('state', function(gb) {
	return gb.state.state + '.' + gb.state.step +  '.' + gb.state.round;
});
db.h('key', function(gb) {
	return gb.key;
});


db.load('./nddbs/all_cf_sub_eva_copy.nddb');
// Cast to number
db.each(function(e){
	e.state.round = Number(e.state.round);
});
db.sort(['player.pc', 'state.round']);
db.rebuildIndexes();
//console.log(db.first());



// PL
var pl = new NDDB();	
pl.h('id', function(gb) { return gb.id;});
pl.load('./pl.nddb');
pl.sort('pc');
pl.rebuildIndexes();

// HEADERS
var pnames = pl.map(function(p){
	return "P_" + p.pc;
});

var rnames = J.seq(1,30,1,function(e){
	if (e < 10) {
		e = '0' + e;
	}
	return 'R_' + e;
});



writeRoundStats();

function writeRoundStats(path) {
	
	var pfile = 'copy/copy_x_round_x_player.csv'; 
	var rfile = 'copy/copy_x_round.csv';
//	var efile = 'copy/sub_x_ex_round.csv';
//	
//	var prfile = 'sub_x_player_x_round.csv';
	
	// PLAYER STATS
	var pWriter = csv.createCsvStreamWriter(fs.createWriteStream('./csv/' + pfile));
	pWriter.writeRecord(pnames);	
	var round = 1;
	while (round < 31) {
		
		// Divided by player
		var round_stuff = db.select('state.round','=',round).sort('player');
		var copies = round_stuff.map(function(p){
			if (p.copy) {
				return p.state.round - p.copy.copied_round;
			}
			else {
				return 0;
			}
		});
		pWriter.writeRecord(copies);
		//console.log(subs);
		round++;
	}
	console.log("wrote " + pfile);

	// ROUND STATS
	var rWriter = csv.createCsvStreamWriter(fs.createWriteStream('./csv/' + rfile));
	rWriter.writeRecord(rnames);

	for (var pl in db.player) {
		if (db.player.hasOwnProperty(pl)) {
			
			db.player[pl].sort('round');
			var copies_pl = db.player[pl].map(function(p) {
				if (p.copy) {
					return p.state.round - p.copy.copied_round;
				}
				else {
					return 0;
				}
			});
			rWriter.writeRecord(copies_pl);
			
		}
	}
	console.log("wrote " + rfile);

	
}


/**
 * Takes an obj and write it down to a csv file;
 */
writeCsv = function (path, obj, options) {
	options = options || {};
	
	var writer = csv.createCsvStreamWriter(fs.createWriteStream( path, {'flags': 'a'}));
	
	// Add headers, if requested, and if found
	options.writeHeaders = options.writeHeaders || true;
	if (options.writeHeaders) {
		var headers = [];
		if (J.isArray(options.headers)) {
			headers = options.headers;
		}
		else if (J.isArray(obj)) {
			headers = J.keys(obj[0]);
		}
		
		if (headers.length) {
			writer.writeRecord(headers);
		}
		else {
			console.log('Could not find headers', 'WARN');
		}
	}
	
	var i;
    for (i = 0; i < obj.length; i++) {
    	console.log(obj[i]);
		writer.writeRecord(obj[i]);
	}
};
