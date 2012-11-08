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
		
		var curFace, prevFace, stay;
		
		if (data.SUB === 'SUB') {
		
		    curFace = db.player[data.player]
					    	.select('state.round', '=', data.round)
					    	.fetch();
		    
		    if (curFace.length !== 1) {
		    	console.log('Error curFace!');
		    	return;
		    }
		    
		    curFace = curFace[0];
		    curFace.ex = data.ex;
		    	
		    if (data.round > 1) {
		    	
		    	prevFace = db.player[data.player]
			 					    	.select('state.round', '=', (data.round - 1))
			 					    	.fetch();
		    
		    	
		    	if (prevFace.length !== 1) {
			    	console.log('Error prevFace!');
			    	return;
			    }
		    	prevFace = prevFace[0];
		    	curFace.stay = (prevFace.ex === curFace.ex);
		    	
//		    	console.log(curFace);
		    }
		}
	    
//	    console.log(curFace);
	});
	
	
	reader.on('end', function(){
		//console.log(db.player['9132212711841317531'].first());
		db.save(DIR + 'all_cf_sub.nddb');
		console.log('wrote file.');
	});
}










