var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3'),
	pr_stats = require('./pr_stats');

module.exports = stats_faces;

function stats_faces(DIR, ACTION) {
	

	// Load DATA
	//var db = pr_stats.db(DIR, 'pr_full.nddb');
	var db = pr_stats.db(DIR);
	
	// LOADING DEFAULTS
	//////////////////////
	
	// PL
	var pl = pr_stats.pl(DIR);
	
	// HEADERS
	var header = pl.map(function(p){
		return "P_" + p.pc;
	});
	
	header = ['round', 'player'].concat(header);

	
	////////////////////////////////////
	
	function computeWeightedFaceDiff(p1, p2) {
		if (p1.player.id === p2.player.id) return 'NA';
		return pr_stats.dist.weightedFaceDistance(p1.value, p2.value);
	}
	
	writeRoundStatsByPlayerByPlayer('csv/diff/global/p2p', computeWeightedFaceDiff);
	
	function writeRoundStatsByPlayerByPlayer(outfile, func) {
		
		var file = DIR + outfile + '.csv';
		var pWriter = csv.createCsvStreamWriter(fs.createWriteStream(file));
		pWriter.writeRecord(header);	
		
		var faces, round_stuff, round = 1;
		
		while (round < 31) {
			
			// Divided by player
			round_stuff = db.select('state.round', '=', round).sort('player');
			faces = round_stuff.map(function(p){
				
				var results = round_stuff.map(function(r) {
					return func(p, r);
				});
				results = [round, p.player.pc].concat(results);
				pWriter.writeRecord(results);
			});
			
			round++;
		}
		
		console.log("wrote " + file);
	}
}
