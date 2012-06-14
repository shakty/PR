var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB;





var options = {
    'separator': ',',
    'quote': '"',
    'escape': '"',       
    'comment': '',
};

var reader = csv.createCsvFileReader('./out/key_SUB.csv', options);

	

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
db.load('./all_cf.nddb');

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

reader.on('data', function(data) {
	
    var face = db.player[data.player]
			    	.select('state.round', '=', data.round)
			    	.fetch();
    
    if (face.length !== 1) {
    	console.log('Error!');
    }
    else {
    	face[0].ex = data.ex;
    }
    
    //console.log(face);
});


reader.on('end', function(){
	console.log(db.player['9132212711841317531'].first());
	db.save('./all_cf_sub.nddb');
	console.log('wrote file.');
});










