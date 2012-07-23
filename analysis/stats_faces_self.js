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


db.load('./all_cf_sub_eva.nddb');
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

// CF FEATURES

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

///


writeRoundStats();

function writeRoundStats() {
	

	// PLAYER STATS SELF
	var round = 2; // IMPORTANT 2
	var old_faces, faces, round_stuff;
	while (round < 31) {

		if (round < 10) {
			var p_self_file = './csv/diff/self/diff_players_0' + round + '.csv';
		}
		else {
			var p_self_file = './csv/diff/self/diff_players_' + round + '.csv';
		}
		var pWriter = csv.createCsvStreamWriter(fs.createWriteStream(p_self_file));
		pWriter.writeRecord(pnames);	
		
		// Divided by player
		round_stuff = db.select('state.round', '=', round).sort('player');

		for (var R = round-1; R > 0; R--) {
			faces = round_stuff.map(function(p) {
				var face = db.select('state.round','=',(round - R))
								.select('player.id', '=', p.player.id).first('value');
		
				return weightedFaceDistance(face, p.value);		
			});
			
			var players = round_stuff.map(function(p){
				return p.player.pc;
			}); 
			
			console.log(players);
			pWriter.writeRecord(faces);
			console.log(faces);
		}
		

		round++;
	}
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
