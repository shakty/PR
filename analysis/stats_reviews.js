var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3');

module.exports = stats_reviews;

function stats_reviews(DIR, ACTION) {
	

	// Load DATA
	var db = new NDDB();
	
	db.h('player', function(gb) {
		return gb.player;
	});
	db.h('state', function(gb) {
		return gb.state + '.' + gb.step +  '.' + gb.round;
	});
	db.h('key', function(gb) {
		return gb.key;
	});
	
	
	db.load(DIR + 'all_reviews.nddb');
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
	var pnames = []; 
	pl.each(function(p){
		var p = "P_" + p.pc + '_';
		pnames.push(p + 'score');
		pnames.push(p + 'in');
		pnames.push(p + 'out');
		pnames.push(p + 'same');
	});
	
	var rnames_tmp = J.seq(1,30,1,function(e){
		if (e < 10) {
			e = '0' + e;
		}
		return 'R_' + e;
	});
	
	var rnames = [];
	J.each(rnames_tmp, function(p){
		rnames.push(p + '_score');
		rnames.push(p + '_in');
		rnames.push(p + '_out');
		rnames.push(p + '_same');
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
				min: -4,
				max: 4,
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
		writeRoundStats(pl);
	}
	else if (ACTION === 'DISTANCE_VS_SCORE') {
		correlateDistanceFromOriginalAndScore();
	}
	
	
	
	function writeRoundStats(pl) {
		
		var pfile = 'ingroup/player_reviews.csv'; 					
		var rfile = 'ingroup/round_reviews.csv';
		
		// PLAYER STATS
		var pWriter = csv.createCsvStreamWriter(fs.createWriteStream(DIR + 'csv/' + pfile));
		pWriter.writeRecord(pnames);	
		var round = 1;
		while (round < 31) {
			var rev = 1;
			while (rev < 4) {
				// Divided by player
				var round_stuff = db.select('round','=',round)
										.select('rev', '=', rev).sort('pc');
				
				var reviews = [];
				round_stuff.each(function(p){
					console.log(pl.id[p.player].first().pc);
					reviews.push(p.score);
					reviews.push(p.incolor);
					reviews.push(p.outcolor);
					reviews.push(p.samecolor);
				});
				pWriter.writeRecord(reviews);
				//console.log(subs);
				rev++;
			}
			
			round++;
		}
		console.log("wrote " + pfile);
	
		// ROUND STATS
		var rWriter = csv.createCsvStreamWriter(fs.createWriteStream(DIR + 'csv/' + rfile));
		rWriter.writeRecord(rnames);
	
		for (var pl in db.player) {
			
			if (db.player.hasOwnProperty(pl)) {
				
				db.player[pl].sort('round');
				var reviews = db.player[pl].map(function(p) {
					return [p.score, p.incolor, p.outcolor, p.samecolor];
				});
				rWriter.writeRecord(reviews);
				
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

