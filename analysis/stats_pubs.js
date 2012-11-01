var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3');


module.exports = stats_pubs;

function stats_pubs(DIR, ACTION) {
	
	
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
	
	
	db.load(DIR + 'all_cf_sub_eva.nddb');
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
	pl.load(DIR + 'PL.nddb');
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
		
		var pfile = 'pubs/pubs_x_round_x_player.csv'; 
	//	var rfile = 'sub_x_round.csv';
	//	var efile = 'sub_x_ex_round.csv';
	//	
	//	var prfile = DIR + 'sub_x_player_x_round.csv';
	//	
		// PLAYER STATS
		var pWriter = csv.createCsvStreamWriter(fs.createWriteStream(DIR + 'csv/' + pfile));
		pWriter.writeRecord(pnames);	
		var round = 1;
		while (round < 31) {
			
			// Divided by player
			var round_stuff = db.select('state.round','=',round).sort('player');
			var subs = round_stuff.map(function(p){
				return p.published ? 1 : 0;
			});
			pWriter.writeRecord(subs);
			//console.log(subs);
			round++;
		}
		console.log("wrote " + pfile);
	}
}