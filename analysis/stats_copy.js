var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3');


module.exports = stats_copy;

function stats_copy(DIR, ACTION) {
	

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
	
	
	db.load(DIR + 'all_cf_sub_eva_copy.nddb');
	
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
	
	
	
	//CF FEATURES
	
	var cf_features = {
			// Head
	
			head_scale_x: {
				min: 0.001,
				max: 2,
				step: 0.001,
				value: 0.5,
				label: 'Scale head horizontally'
			},
			head_scale_y: {
				min: 0.01,
				max: 2,
				step: 0.001,
				value: 1,
				label: 'Scale head vertically'
			},
			
			// Eye
			
			eye_height: {
				min: 0,
				max: 2,
				step: 0.01,
				value: 0.4,
				label: 'Eye and Eyebrow height'
			},	
			
			eye_spacing: {
				min: 0,
				max: 40,
				step: 0.01,
				value: 10,
				label: 'Eye spacing'
			},
			eye_scale_x: {
				min: 0.01,
				max: 4,
				step: 0.01,
				value: 1,
				label: 'Scale eyes horizontally'
			},
			eye_scale_y: {
				min: 0.01,
				max: 4,
				step: 0.01,
				value: 1,
				label: 'Scale eyes vertically'
			},
			
			// Eyebrow
			eyebrow_length: {
				min: 0,
				max: 50,
				step: 0.01,
				value: 10,
				label: 'Eyebrow length'
			},
			
			eyebrow_angle: {
				min: -3.14,
				max: 3.14,
				step: 0.01,
				value: -0.5,
				label: 'Eyebrow angle'
			},
			
			eyebrow_eyedistance: {
				min: 0,
				max: 50,
				step: 0.01,
				value: 3, // From the top of the eye
				label: 'Eyebrow from eye'
			},
			
			eyebrow_spacing: {
				min: 0,
				max: 50,
				step: 0.01,
				value: 5,
				label: 'Eyebrow spacing'
			},
	
			// Mouth 
	
			mouth_top_y: {
				min: -60,
				max: 60,
				step: 0.01,
				value: -2,
				label: 'Upper lip'
			},
			mouth_bottom_y: {
				min: -60,
				max: 60,
				step: 0.01,
				value: 20,
				label: 'Lower lip'
			},
			
			// Head
	
			head_radius: {
				min: 10,
				max: 100,
				step: 0.01,
				value: 30,
				label: 'Zooom in'
			},
			
	
	};
	
	
	if (ACTION === 'ROUND_STATS') {
		writeRoundStats();
	}
	else if (ACTION === 'ROUND_STATS_NORM') {
		writeRoundStats(true);
	}
	else if (ACTION === 'DISTANCE_VS_SCORE') {
		correlateDistanceFromOriginalAndScore();
	}
	
	
	
	
	
	function writeRoundStats(normalize) {
		
		var pfile = (normalize) ? 'copy/copy_x_round_x_player_norm.csv'
								: 'copy/copy_x_round_x_player.csv'; 
						
		var rfile = 'copy/copy_x_round.csv';
		
	//	var efile = 'copy/sub_x_ex_round.csv';
	//	
	//	var prfile = 'sub_x_player_x_round.csv';
		
		// PLAYER STATS
		var pWriter = csv.createCsvStreamWriter(fs.createWriteStream(DIR + 'csv/' + pfile));
		pWriter.writeRecord(pnames);	
		var round = 1;
		while (round < 31) {
			
			// Divided by player
			var round_stuff = db.select('state.round','=',round).sort('player');
			var copies = round_stuff.map(function(p){
				if (p.copy) {
					return (normalize) ? (p.state.round - p.copy.copied_round) / (p.state.round - 1)
							   		   : p.state.round - p.copy.copied_round;
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
		var rWriter = csv.createCsvStreamWriter(fs.createWriteStream(DIR + 'csv/' + rfile));
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
	
	
	function correlateDistanceFromOriginalAndScore() {
		
		var round = 2; // IMPORTANT 2
		var old_faces, faces, round_stuff;
		
		var file = DIR + 'csv/diff/diffandscore/copy_from_original_andscore.csv';
		
		var writer = csv.createCsvStreamWriter(fs.createWriteStream(file));
		writer.writeRecord(['D','S']);	
		
	
		var ldb = db.select('copy');
		
		
		var score, distance;
		var faces = ldb.each(function(p) {
			var orig = db.select('player.id', '=', p.copy.copied_from.id)
			.select('state.round', '=',  p.copy.copied_round).first();
			
			distance = weightedFaceDistance(orig.value, p.value);
			score = p.avg;
			writer.writeRecord([distance, score]);
		});
		
		console.log("wrote " + file);
	
	}
	
	
	
	
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
	
	
	
	var avgDiffCopy = db.map(function(e){
		if (!e.copy) return;
		
		var orig = db.select('player.id', '=', e.copy.copied_from.id)
						.select('state.round', '=',  e.copy.copied_round).first();
		
		return weightedFaceDistance(orig.value, e.value);
	});
	
	
	var avgDiffCopyWriter = csv.createCsvStreamWriter(fs.createWriteStream(DIR + 'csv/copy/copy_diffs.csv'));
	avgDiffCopyWriter.writeRecord(['DIFFS']);
	J.each(avgDiffCopy, function(e){
		avgDiffCopyWriter.writeRecord([e]);
	});
}
