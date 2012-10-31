var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS;



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
	
	var reader = csv.createCsvFileReader(DIR + 'key_EVA.csv', options);
	
	// "3","2","1","50","false","12052993911915214583","EVA","1683040809488965968","3.9","1339414084622"
	
	var colnames = [
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
	];
	
	reader.setColumnNames(colnames);
	 	
	
	//PL
	var pl = new NDDB();	
	pl.h('id', function(gb) { return gb.id;});
	pl.load(DIR + 'PL.nddb');
	pl.sort('pc');
	pl.rebuildIndexes();
	
	// HEADERS
	var pnames = pl.map(function(p){
		return "P_" + p.pc;
	});
	
	
	// BEGIN
	/////////////
	
	
	var db = new NDDB();
	
	db.h('player', function(gb) {
		return gb.id;
	});
	
	
	//db.h('state', function(gb) {
	//	return GameState.toHash(gb.state, 'S.s.r');
	//});
	
	
	db.h('key', function(gb) {
		return gb.key;
	});
	
	db.rebuildIndexes();
	
	//console.log(db.player['9132212711841317531'].first());
	var countRevs = {};
	
	reader.on('data', function(data) {
		
		if (data.EVA === 'EVA') {
			// Assumption: data is ordered by round already
			if (!countRevs[data.player] || countRevs[data.player] === 3) {
				countRevs[data.player] = 1;
			}
			else {
				countRevs[data.player]++;
			}
		    
			data.pc = pl.id[data.player].first().pc;
		    data.score = Number(data.score);
		    data.round = Number(data.round);
			data.rev = countRevs[data.player];  
			data.incolor = pl.id[data.player].first().color;
			data.outcolor = pl.id[data.who].first().color;
			data.samecolor = (data.outcolor === data.incolor) ? 1 : 0; 
			
		    db.insert(data);
		}
	  
	});
	
	
	
	
	reader.on('end', function(){
		db.save(DIR + 'all_reviews.nddb');
		
		var pfile = 'ingroup/all_reviews.csv'; 
	
		colnames.push('pc');
		colnames.push('rev');
		colnames.push('incolor');
		colnames.push('outcolor');
		colnames.push('same');
		
		// PLAYER STATS
		var pWriter = csv.createCsvStreamWriter(fs.createWriteStream( DIR + 'csv/' + pfile));
		pWriter.writeRecord(colnames);	
		
		db.each(function(p){
			var data = J.obj2Array(p);
			console.log(data);
			pWriter.writeRecord(data);
		});
		
		console.log("wrote " + pfile);
	
		
		console.log('wrote files.');
	});
}
