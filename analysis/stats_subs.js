var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3');



var db = new NDDB();

db.h('player', function(gb) {
	return gb.player;
});
db.h('state', function(gb) {
	return gb.state.state + '.' + gb.state.step +  '.' + gb.state.round;
});
db.h('key', function(gb) {
	return gb.key;
});


db.load('./all_cf_sub_eva.nddb');

db.each(function(e){
	e.state.round = Number(e.state.round);
});

db.sort(['player.pc', 'state.round']);
db.rebuildIndexes();

var players = db.groupBy('player.id');



var pl = new NDDB();
	

pl.h('id', function(gb) {
	return gb.id;
});

pl.load('./pl.nddb');
pl.sort('pc');
var pnames = pl.map(function(p){
	return "P_" + p.pc;
});

pl.rebuildIndexes();

console.log(db.first())


var countRevs = {};

writeRoundStats();

function writeRoundStats(path) {
	var round = 1;
	
	var writer = csv.createCsvStreamWriter(fs.createWriteStream('./csv/sub_x_round_x_player.csv'));
	writer.writeRecord(pnames);

	var rWriter = csv.createCsvStreamWriter(fs.createWriteStream('./csv/sub_x_round.csv'));
	
	while (round < 31) {
		
		// Divided by player
		var round_stuff = dbeva.select('round','=',round).sort('player');
		var evas = round_stuff.map(function(p){
			return p.eva_mean;
		});
		writer.writeRecord(evas);
	
		round++;
	}


	var header = J.seq(1,30,1,function(e){
		if (e < 10) {
			e = '0' + e;
		}
		return 'R_' + e;
	});
	rWriter.writeRecord(header);

	
	
	
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
