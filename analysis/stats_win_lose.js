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
	////////////
	var db = pr_stats.db(DIR, 'pr_full.nddb');
	
	
	// LOADING DEFAULTS
	//////////////////////
	
	// PL
	var pl = pr_stats.pl(DIR);
	
	// HEADERS
	var pnames = [];
	
	pl.each(function(p) {
		var pc = "P_" + p.pc;
		var array = [
	         pc + '_pub', 
	         pc + '_stay', 
	         pc + '_diffOthers', 
	         pc + '_diffSelf',
	         pc + '_diffPubs',
	         pc + '_diffPubsCum',
		];
		pnames = pnames.concat(array);
	});
	
//	console.log(pnames);
	
	var rnames = pr_stats.rnames;
	
	// CF FEATURES
	
	var cf_features = pr_stats.features;
	
	////////////////////////////////////
	
	// If true: integer are written instead of A,B,C
//	var transform = (ACTION === 'TRANSFORM') ? true : false;
	
	
	writeRoundStats();
	
	function writeRoundStats(path) {
	
		var pfile = 'win_lose/win_lose_by_player.csv';
		var afile = 'win_lose/win_lose_all.csv';					
		
//		var rfile = 'sub/sub_x_round.csv';
//		var efile = 'sub/sub_x_ex_round.csv';
//		
//		var prfile = 'sub/sub_x_player_x_round.csv';
		
		// BY PLAYER STATS
		var pWriter = csv.createCsvStreamWriter(fs.createWriteStream(DIR + 'csv/' + pfile));
		pWriter.writeRecord(pnames);	
		
		// ALL PLAYERS STATS
		var aWriter = csv.createCsvStreamWriter(fs.createWriteStream(DIR + 'csv/' + afile));
		aWriter.writeRecord(['published', 'stay', 'diffOthers', 'diffSelf', 'diffPubs', 'diffPubsCum']);
		
		var round = 1;
		while (round < 31) {
			
			// Divided by player
			var round_stuff = db.select('state.round','=',round).sort('player');
			var roundStats = [];
			round_stuff.each(function(p){
				
				
				
//				for (var pl in db.player) {
//					if (db.player.hasOwnProperty(pl)) {
						
//						db.player[pl].sort('round');
				
//						var stats_pl = db.player[pl].map(function(p) {
							
						var stats_pl = [
						        p.published ? 1 : 0,
						        ('undefined' === typeof p.diff.self) ? 'NA' : p.stay ? 1 : 0,
						        p.diff.others,
						        ('undefined' === typeof p.diff.self) ? 'NA' : p.diff.self,
						        ('undefined' === typeof p.diff.pubs) ? 'NA' : p.diff.pubs,
						        ('undefined' === typeof p.diff.pubsCum) ? 'NA' : p.diff.pubsCum,
						        ];
//						});
						
						aWriter.writeRecord(stats_pl);
							
						roundStats = roundStats.concat(stats_pl);
//					}
//				}
				
				
				
			});
			pWriter.writeRecord(roundStats);
//			pWriter.writeRecord(subs);
			//console.log(subs);
			round++;
		}
		console.log("wrote " + pfile);
	
//		// ROUND STATS
//		var rWriter = csv.createCsvStreamWriter(fs.createWriteStream(DIR + 'csv/' + rfile));
//		rWriter.writeRecord(rnames);
//	
//		for (var pl in db.player) {
//			if (db.player.hasOwnProperty(pl)) {
//				
//				db.player[pl].sort('round');
//				var exs_pl = db.player[pl].map(function(p) {
//					return p.ex;
//				});
//				rWriter.writeRecord(exs_pl);
//				
//			}
//		}
//		console.log("wrote " + rfile);
//		
//		// ROUND STATS
//		var rWriter = csv.createCsvStreamWriter(fs.createWriteStream(DIR + 'csv/' + efile));
//		rWriter.writeRecord(['A','B','C']);
//	
//		round = 1;
//		while (round < 31) {
//			
//			// Divided by player
//			var round_stuff = db.select('state.round','=',round).sort('ex');
//			var subs = [];
//			subs.push(round_stuff.select('ex', '=', 'A').count());
//			subs.push(round_stuff.select('ex', '=', 'B').count());
//			subs.push(round_stuff.select('ex', '=', 'C').count());
//		
//			rWriter.writeRecord(subs);
//			round++;
//		}
//		console.log("wrote " + efile);
//		
	}
}