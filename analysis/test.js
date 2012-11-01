var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3');

module.exports = stats_faces_pub;

var DIR = './data/sample/'

	stats_faces_pub(DIR);
	
function stats_faces_pub(DIR, ACTION) {

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
	
	/// BEGIN
	
	// Every round with all the previous ones
	 writeRoundStats();
	

	
	
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
	

	
	function writeRoundStats() {
		
		
		// PLAYER STATS SELF
		var round = 2; // IMPORTANT 2
		var old_faces, faces, round_stuff;
		var faces = [];
		while (round < 31) {
	
//			if (round < 10) {
//				var p_pubs_file = DIR + 'csv/diff/pubs/diff_pubs_players_0' + round + '.csv';
//			}
//			else {
//				var p_pubs_file = DIR + 'csv/diff/pubs/diff_pubs_players_' + round + '.csv';
//			}
//			var pWriter = csv.createCsvStreamWriter(fs.createWriteStream(p_pubs_file));
//			pWriter.writeRecord(pnames);	
			
			// Divided by player
			round_stuff = db.select('state.round', '=', round).sort('player')
							.select('published', '=', true);
			
			
			console.log(round);
			round_stuff.each(function(p){
				console.log(p.player.id)
				console.log(p.ex);
			})
			
//			console.log(round_stuff)
			
	
			round++;
		}
//		console.log("wrote " + p_pubs_file);
	
	}
	

}