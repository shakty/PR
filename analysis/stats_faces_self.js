var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3'),
	pr_stats = require('./pr_stats');

module.exports = stats_faces_self;

function stats_faces_self(DIR, ACTION) {

	
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
	
	
	writeRoundStats();
	
	function writeRoundStats() {
		
	
		// PLAYER STATS SELF
		var round = 2; // IMPORTANT 2
		var old_faces, faces, round_stuff, face, faceDiff;
		while (round < 31) {
	
			if (round < 10) {
				var p_self_file = DIR + 'csv/diff/self/diff_players_0' + round + '.csv';
			}
			else {
				var p_self_file = DIR + 'csv/diff/self/diff_players_' + round + '.csv';
			}
			var pWriter = csv.createCsvStreamWriter(fs.createWriteStream(p_self_file));
			pWriter.writeRecord(pnames);	
			
			// Divided by player
			round_stuff = db.select('state.round', '=', round).sort('player');
	
			for (var R = round-1; R > 0; R--) {
				faces = round_stuff.map(function(p) {
					var face = db.select('state.round','=',(round - R))
									.select('player.id', '=', p.player.id).first('value');
			
					faceDiff = weightedFaceDistance(face, p.value);
					if (!p.diff) p.diff = {};
					p.diff.self = faceDiff;	
					return faceDiff;
				});
				
				var players = round_stuff.map(function(p){
					return p.player.pc;
				}); 
				
//				console.log(players);
				pWriter.writeRecord(faces);
//				console.log(faces);
			}
			
	
			round++;
		}
		
		db.save(DIR + 'pr_full.nddb');
		console.log("wrote " + p_self_file);
		
		
	
	}
	//
	//function computeAllSingleFeaturesDistance() {
	//	
	//	var file, writer, row, round_stuff, round;
	//	for (var f in cf_features) {
	//		if (cf_features.hasOwnProperty(f)) {
	//			round = 1;
	//			file = './csv/single/diff_' + f + '_x_round_x_player_mean.csv';
	//			writer = csv.createCsvStreamWriter(fs.createWriteStream(file));
	//			writer.writeRecord(pnames);	
	//			while (round < 31) {
	//				
	//				round_stuff = db.select('state.round','=',round).sort('player');
	//				row = round_stuff.map(function(p){
	//					
	//					var face = db.select('state.round', '=', round)
	//									.select('player.id', '=', p.player.id).first('value');
	//			
	//					round_diff = round_stuff.map(function(r) {
	//						if (r.player.id === p.player.id) return;
	//						return weightedDistance([f], face, r.value);
	//					});
	//					
	//					var meanRoundDiff = 0;
	//					J.each(round_diff, function(d){
	//						meanRoundDiff += d;
	//					});
	//					
	//					return meanRoundDiff / 8;
	//				});
	//				
	//				writer.writeRecord(row);
	//				
	//				round++;
	//			}
	//		}
	//	}
	//}
	
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
