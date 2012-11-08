var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3'),
	pr_stats = require('./pr_stats');

module.exports = stats_subs;

function stats_subs(DIR, ACTION) {
	

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
	
	
	db.load(DIR +'all_cf_sub_eva.nddb');
	// Cast to number
	db.each(function(e){
		e.state.round = Number(e.state.round);
	});
	db.sort(['player.pc', 'state.round']);
	db.rebuildIndexes();
	//console.log(db.first());
	
	
	
	// LOADING DEFAULTS
	//////////////////////
	
	// PL
	var pl = pr_stats.pl(DIR);
	
	// HEADERS
	var pnames = pl.map(function(p){
		return "P_" + p.pc;
	});
	
	var rnames = pr_stats.rnames;
	
	// CF FEATURES
	
	var cf_features = pr_stats.features;
	
	////////////////////////////////////
	
	// If true: integer are written instead of A,B,C
	var transform = (ACTION === 'TRANSFORM') ? true : false;
	
	
	writeRoundStats();
	
	function writeRoundStats(path) {
	
		var pfile = (transform) ? 'sub/sub_x_round_x_player_int.csv'
								: 'sub/sub_x_round_x_player.csv'; 
		
		var rfile = 'sub/sub_x_round.csv';
		var efile = 'sub/sub_x_ex_round.csv';
		
		var prfile = 'sub/sub_x_player_x_round.csv';
		
		// PLAYER STATS
		var pWriter = csv.createCsvStreamWriter(fs.createWriteStream(DIR + 'csv/' + pfile));
		pWriter.writeRecord(pnames);	
		var round = 1;
		while (round < 31) {
			
			// Divided by player
			var round_stuff = db.select('state.round','=',round).sort('player');
			var subs = round_stuff.map(function(p){
				if (transform) {
					var o = {};
					o.A = 1;
					o.B = 2;
					o.C = 3;
					return o[p.ex];
				}
				return p.ex;
			});
			pWriter.writeRecord(subs);
			//console.log(subs);
			round++;
		}
		console.log("wrote " + pfile);
	
		// ROUND STATS
		var rWriter = csv.createCsvStreamWriter(fs.createWriteStream(DIR + 'csv/' + rfile));
		rWriter.writeRecord(rnames);
	
		for (var pl in db.player) {
			if (db.player.hasOwnProperty(pl)) {
				
				db.player[pl].sort('round');
				var exs_pl = db.player[pl].map(function(p) {
					return p.ex;
				});
				rWriter.writeRecord(exs_pl);
				
			}
		}
		console.log("wrote " + rfile);
		
		// ROUND STATS
		var rWriter = csv.createCsvStreamWriter(fs.createWriteStream(DIR + 'csv/' + efile));
		rWriter.writeRecord(['A','B','C']);
	
		round = 1;
		while (round < 31) {
			
			// Divided by player
			var round_stuff = db.select('state.round','=',round).sort('ex');
			var subs = [];
			subs.push(round_stuff.select('ex', '=', 'A').count());
			subs.push(round_stuff.select('ex', '=', 'B').count());
			subs.push(round_stuff.select('ex', '=', 'C').count());
		
			rWriter.writeRecord(subs);
			round++;
		}
		console.log("wrote " + efile);
		
	}
}