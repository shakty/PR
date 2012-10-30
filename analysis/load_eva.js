var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB;


var DIR = './com_sel/';
///////////////////////


var options = {
    'separator': ',',
    'quote': '"',
    'escape': '"',       
    'comment': '',
};

var reader = csv.createCsvFileReader(DIR + 'key_EVA.csv', options);

	

// "3","2","1","50","false","12052993911915214583","EVA","1683040809488965968","3.9","1339414084622"
reader.setColumnNames([
                       'state',
                       'step',
                       'round',
                       'is',
                       'paused',
                       'player',
                       'EVA',
                       'who',
                       'score',
                       'time',
]);
 	


// BEGIN
/////////////


var db = new NDDB();
db.load(DIR + 'all_cf_sub.nddb');

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

var threshold = 5;

reader.on('data', function(data) {
	
	if (data.EVA === 'EVA') {
		
	    var face = db.player[data.who]
				    	.select('state.round', '=', data.round)
				    	.fetch();
	    
	    if (face.length !== 1) {
	    	console.log('Error!');
	    }
	    else {
	    	face = face[0];
	    	if (!face.reviewers) face.reviewers = [];
	    	face.reviewers.push(data.player);
	    	
	    	if (!face.scores) face.scores = [];
	    	face.scores.push(data.score);
	    }
	    
	}
    
//    console.log(face);
});




reader.on('end', function(){
	db.each(function(e){
		//console.log(e);
		if (!e.scores) {
			console.log('Error, no scores');
			return;
		}
		console.log(e.scores)
		if (e.scores.length !== 3) {
			console.log('Error, not enough scores');
			return;
		}
		
		var avg = (Number(e.scores[0]) + Number(e.scores[1]) + Number(e.scores[2])) / 3;
		e.avg = avg.toFixed(2);
		e.published =  (e.avg > threshold) ? true : false; 
		//console.log(e);
	})
	
	db.save(DIR + 'all_cf_sub_eva.nddb');
	console.log('wrote file.');
});
