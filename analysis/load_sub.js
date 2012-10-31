var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB;

module.exports = load;

function load(DIR) {

	if (!DIR) {
		console.err('You need to specify a directory as parameter');
		return false;
	}
	
	var options = {
	    'separator': ',',
	    'quote': '"',
	    'escape': '"',       
	    'comment': '',
	};
	
	
	
	
	var reader = csv.createCsvFileReader(DIR + 'key_SUB.csv', options);
	
		
	
	// "3","1","1","50","false","9213583151195859635","SUB","A","1339414034576"
	reader.setColumnNames([
	                       'state',
	                       'step',
	                       'round',
	                       'is',
	                       'paused',
	                       'player',
	                       'SUB',
	                       'ex',
	                       'time',
	]);
	 	
	
	
	// BEGIN
	/////////////
	
	
	var db = new NDDB();
	db.load(DIR + 'all_cf.nddb');
	
	db.h('player', function(gb) {
		return gb.player.id;
	});
	
	
	//db.h('state', function(gb) {
	//	return GameState.toHash(gb.state, 'S.s.r');
	//});
	
	
	db.h('key', function(gb) {
		return gb.key;
	});
	
	db.rebuildIndexes();
	
	//console.log(db.player['9132212711841317531'].first());
	
	//console.log(db.player);
	
	
	reader.on('data', function(data) {
		
		if (data.SUB === 'SUB') {
		
		    var face = db.player[data.player]
					    	.select('state.round', '=', data.round)
					    	.fetch();
		    
		    if (face.length !== 1) {
		    	console.log('Error!');
		    }
		    else {
		    	face[0].ex = data.ex;
		    	console.log(face[0])
		    }
		}
	    
	    //console.log(face);
	});
	
	
	reader.on('end', function(){
		//console.log(db.player['9132212711841317531'].first());
		db.save(DIR + 'all_cf_sub.nddb');
		console.log('wrote file.');
	});
}










