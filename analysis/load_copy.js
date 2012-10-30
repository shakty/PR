var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3');


var DIR = './com_sel/';
///////////////////////


var options = {
    'separator': ',',
    'quote': '"',
    'escape': '"',       
    'comment': '',
};

var reader = csv.createCsvFileReader(DIR + 'key_COPIED.csv', options);

	

// "3","2","1","50","false","12052993911915214583","EVA","1683040809488965968","3.9","1339414084622"
reader.setColumnNames([
                       'state',
                       'step',
                       'round',
                       'is',
                       'paused',
                       'player',
                       'COPIED',
                       'from',
                       'ex',
                       'score',
                       'copy_round',
                       'time',
]);
 	


// BEGIN
/////////////

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


db.load(DIR + 'all_cf_sub_eva.nddb');
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

// DB_COPY

var dbcopy = new NDDB();

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


//console.log(db.player);
//
//sw

reader.on('data', function(data) {

	//player: pl.select('id', '=', data.player).first(),
	
	if (data.COPIED === 'COPIED') {
	
		var copy = {
				copied_from: pl.select('name', '=', data.from).first(),
				copied_score: data.score,
				copied_round: data.copy_round.split('.')[1],
				copied_ex: data.ex,
		};
	
		//console.log(copy);
		
	    var face = db.player[data.player]
	     			    	.select('state.round', '=', data.round)
	     			    	.first();
	         
	     if (!face) {
	     	console.log('Error!');
	     }
	     else {
	     	face.copy = copy;
	     }
				
	    dbcopy.insert(copy);
	}
});




reader.on('end', function(){
	//console.log(db.fetch('copy'));
	db.save(DIR + 'all_cf_sub_eva_copy.nddb');
	dbcopy.save( DIR + 'all_copy.nddb');
	console.log('wrote files.');
});










