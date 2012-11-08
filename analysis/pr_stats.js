var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3'),
	pr_stats = require('./pr_stats');

var pr = {};

module.exports = pr;

// CF FEATURES

pr.features = {
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

///


pr.pl = function (DIR) {
	var pl = this.pl = new NDDB();	
	pl.h('id', function(gb) { return gb.id;});
	pl.load(DIR + 'PL.nddb');
	pl.sort('pc');
	pl.rebuildIndexes();
	return pl;
}


pr.db = function (DIR, file) {
	file = file || 'all_cf_sub_eva_copy.nddb';
	
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
	
	
	db.load(DIR + file);
	// Cast to number
	db.each(function(e){
		e.state.round = Number(e.state.round);
	});
	db.sort(['player.pc', 'state.round']);
	db.rebuildIndexes();
	//console.log(db.first());
	
	return db;
}

// rnames
/////////

var rnames = J.seq(1,30,1,function(e){
	if (e < 10) {
		e = '0' + e;
	}
	return 'R_' + e;
});

pr.rnames = rnames;


// featnames
////////////

pr.featnames = {};

pr.featnames.all = [
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
			
pr.featnames.zoom = [
	'head_radius',
];
	
pr.featnames.head = [
	'head_scale_x',
	'head_scale_y',
];          
	
pr.featnames.eyes = [
    'eyebrow_length',
    'eyebrow_eyedistance',
    'eyebrow_angle',
    'eyebrow_spacing',
];
		
pr.featnames.mouth = [
    'mouth_top_y',
    'mouth_bottom_y',
];
		
pr.featnames.eyedistance = [
    'eye_height',
    'eye_spacing',
    'eye_scale_x',
    'eye_scale_y',
];
	
