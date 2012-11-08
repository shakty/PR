var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3'),
	pr_stats = require('./pr_stats');

module.exports = stats_faces_pub;

function stats_faces_pub(DIR) {

	// Load DATA
	var db = pr_stats.db(DIR, 'pr_full.nddb');
		
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
	
	/// BEGIN
	
	// Every round with all the previous ones
	 writeRoundStats();
	
	// Every round with the immediately previous one
	writePreviousRoundStats();
	
	// All the entries, distance from published faces at R-1 and their score
	correlateDistanceAndScore();
	correlateDistanceAndScoreCopy();
	
	//Every round with all the previous one
	writeCumulativeRoundStats();
	
//	var cumulative = (ACTION == 'CUMULATIVE') ? true : false;
	
	/// END
	
	function getPublishedFaces(round, cumulative) {
		if (!round) return false;
		cumulative = cumulative || false;
		
		var s = (cumulative) ? db.select('state.round', '<=', round)
							 : db.select('state.round', '=', round);
		
//		console.log('CUMULATIVE ' + cumulative);
//		console.log(s.length)
		
		return s.select('published', '=', true);
	}
	
	function getAvgDistanceFromPubFaces(face, round, cumulative) {
		if (!face || !round) return false;
		var pubs = getPublishedFaces(round, cumulative);
		
		// TODO: check this
		// If there are no pubs in the previous round diff = 1
		if (!pubs || !pubs.length) return 'NA';
	
		var diffs = 0; 
		
		pubs.each(function(e){
			diffs += weightedFaceDistance(face, e.value);
		});
		
		return diffs / pubs.length;
	}
	
	function writeRoundStats() {
		
	
		// PLAYER STATS SELF
		var round = 2; // IMPORTANT 2
		var old_faces, faces, round_stuff, faceDiff;
		while (round < 31) {
	
			if (round < 10) {
				var p_pubs_file = DIR + 'csv/diff/pubs/diff_pubs_players_0' + round + '.csv';
			}
			else {
				var p_pubs_file = DIR + 'csv/diff/pubs/diff_pubs_players_' + round + '.csv';
			}
			var pWriter = csv.createCsvStreamWriter(fs.createWriteStream(p_pubs_file));
			pWriter.writeRecord(pnames);	
			
			// Divided by player
			round_stuff = db.select('state.round', '=', round).sort('player');
	
			for (var R = round-1; R > 0; R--) {
				faces = round_stuff.map(function(p) {
					faceDiff = getAvgDistanceFromPubFaces(p.value, (round-R));
					if (!p.diff) p.diff = {};
					p.diff.pubs = faceDiff;	
					return faceDiff;
				});
				
	//			var players = round_stuff.map(function(p){
	//				return p.player.pc;
	//			}); 
				
				pWriter.writeRecord(faces);
				console.log(faces);
			}
			
	
			round++;
		}
		
		console.log("wrote " + p_pubs_file);
	
	}
	
	function writePreviousRoundStats() {
		
		var round = 2; // IMPORTANT 2
		var old_faces, faces, round_stuff;
		
		var file = DIR + 'csv/diff/previouspub/diff_pubs_players_previous.csv';
		
		var writer = csv.createCsvStreamWriter(fs.createWriteStream(file));
		writer.writeRecord(pnames);	
		
		while (round < 31) {
	
	
			
			// Divided by player
			round_stuff = db.select('state.round', '=', round).sort('player');
	
			//for (var R = 1; R < round; R++) {
				faces = round_stuff.map(function(p) {
					return getAvgDistanceFromPubFaces(p.value, (round-1));		
				});
				
				
				writer.writeRecord(faces);
				console.log(faces);
			//}
			
	
			round++;
		}
		console.log("wrote " + file);
	
	}
	
	function writeCumulativeRoundStats() {
		
		var round = 2; // IMPORTANT 2
		var old_faces, faces, round_stuff;
		
		var file = DIR + 'csv/diff/previouspub/diff_pubs_players_cumulative.csv';
		
		var writer = csv.createCsvStreamWriter(fs.createWriteStream(file));
		writer.writeRecord(pnames);	
		
		while (round < 31) {
	
			// Divided by player
			round_stuff = db.select('state.round', '=', round).sort('player');
	
			faces = round_stuff.map(function(p) {
				faceDiff = getAvgDistanceFromPubFaces(p.value, (round-1), true);
				if (!p.diff) p.diff = {};
				p.diff.pubsCum = faceDiff;	
				return faceDiff;
			});
			
			
			writer.writeRecord(faces);
			//console.log(faces);
			
	
			round++;
		}
		console.log("wrote " + file);
	
	}
	
	function correlateDistanceFromOriginalAndScore() {
		
		var round = 2; // IMPORTANT 2
		var old_faces, faces, round_stuff;
		
		var file = DIR + 'csv/diff/diffandscore/diffandscore.csv';
		
		var writer = csv.createCsvStreamWriter(fs.createWriteStream(file));
		writer.writeRecord(['D','S']);	
		
		while (round < 31) {
	
			// Divided by player
			round_stuff = db.select('state.round', '=', round).sort('player');
	
			var score, distance;
			faces = round_stuff.each(function(p) {
				distance = getAvgDistanceFromPubFaces(p.value, (round-1));
				score = p.avg;
				writer.writeRecord([distance, score]);
			});
			round++;
		}
		console.log("wrote " + file);
	
	}
	
	function correlateDistanceAndScore() {
		
		var round = 2; // IMPORTANT 2
		var old_faces, faces, round_stuff;
		
		var file = DIR + 'csv/diff/diffandscore/diffandscore.csv';
		
		var writer = csv.createCsvStreamWriter(fs.createWriteStream(file));
		writer.writeRecord(['D','S']);	
		
		while (round < 31) {
	
			// Divided by player
			round_stuff = db.select('state.round', '=', round).sort('player');
	
			var score, distance;
			faces = round_stuff.each(function(p) {
				distance = getAvgDistanceFromPubFaces(p.value, (round-1));
				score = p.avg;
				writer.writeRecord([distance, score]);
			});
			round++;
		}
		console.log("wrote " + file);
	
	}
	
	function correlateDistanceAndScoreCopy() {
		
		var round = 2; // IMPORTANT 2
		var old_faces, faces, round_stuff;
		
		var file = DIR + 'csv/diff/diffandscore/diffandscore_copy.csv';
		
		var writer = csv.createCsvStreamWriter(fs.createWriteStream(file));
		writer.writeRecord(['D','S']);	
		
		while (round < 31) {
	
			// Divided by player
			round_stuff = db.select('state.round', '=', round).sort('player');
	
			var score, distance;
			faces = round_stuff.each(function(p) {
				if (!p.copy) return;
				distance = getAvgDistanceFromPubFaces(p.value, (round-1));
				score = p.avg;
				writer.writeRecord([distance, score]);
			});
			round++;
		}
		console.log("wrote " + file);
	
	}
	
	//////////////////////////////
	// SAVE FILE
	
	db.save(DIR + 'pr_full.nddb');
	
	///////////////////////////////
	

	
	function weightedFaceDistance(f1, f2) {
		var features = [
		    'head_radius',
		    'head_scale_x',
		    'head_scale_y',
		    'eye_height',
		    'eye_spacing',
		    'eye_scale_x',
		    'eye_scale_y',
		    'eyebrow_length',
		    'eyebrow_eyedistance',
		    'eyebrow_angle',
		    'eyebrow_spacing',
		    'mouth_top_y',
		    'mouth_bottom_y',
		];
			
		return weightedDistance(features, f1, f2);
	}
	
	// between 0 and 1
	function weightedDistance(features, f1, f2) {
		if (!features || !f1 || !f2) return false;
		
		
		var distance = 0;
		var range, tmp;
		for (var i = 0; i < features.length; i++) {
	//		console.log(features[i]);
			range = cf_features[features[i]].max - cf_features[features[i]].min;
	//		console.log(range);
			tmp = Math.abs(f1[features[i]] - f2[features[i]]) / range;
	//		console.log(tmp)
			distance += tmp;
		}
		return distance / features.length;
	}
	
	function distance(features, f1, f2) {
		if (!features || !f1 || !f2) return false;
		
		var distance = 0;
		for (var i = 0; i < features.length; i++) {
			distance+= Math.pow((f1[features[i]] - f2[features[i]]), 2);
		}
		return Math.sqrt(distance);
	}
	
	
	function generalFaceDistance(f1, f2) {
		var features = [
		    'head_radius',
		    'head_scale_x',
		    'head_scale_y',
		    'eye_height',
		    'eye_spacing',
		    'eye_scale_x',
		    'eye_scale_y',
		    'eyebrow_length',
		    'eyebrow_eyedistance',
		    'eyebrow_angle',
		    'eyebrow_spacing',
		    'mouth_top_y',
		    'mouth_bottom_y',
		];
		
		return distance(features, f1, f2);
	}
	
	function distinctPartsFaceDistance(f1, f2) {
		var distance = 0;
		distance += zoomDistance(f1, f2);
		distance += headDistance(f1, f2);
		distance += eyebrowDistance(f1, f2);
		distance += mouthDistance(f1, f2);
		distance += eyeDistance(f1, f2);
		
		return distance;
	}
	
	function zoomDistance(f1, f2) {
		var features = [
		    'head_radius',
		];
		
		return weightedDistance(features, f1, f2);
	}
	
	
	function headDistance(f1, f2) {
		var features = [
		    'head_scale_x',
		    'head_scale_y',
		];
		
		return weightedDistance(features, f1, f2);
	}
	
	function eyebrowDistance(f1, f2) {
		var features = [
		    'eyebrow_length',
		    'eyebrow_eyedistance',
		    'eyebrow_angle',
		    'eyebrow_spacing',
		];
		
		return weightedDistance(features, f1, f2);
	}
	
	function mouthDistance(f1, f2) {
		var features = [
		    'mouth_top_y',
		    'mouth_bottom_y',
		];
		
		return weightedDistance(features, f1, f2);
	}
	
	function eyeDistance(f1, f2) {
		var features = [
		    'eye_height',
		    'eye_spacing',
		    'eye_scale_x',
		    'eye_scale_y',
		];
		
		return weightedDistance(features, f1, f2);
	}
}