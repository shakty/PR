var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3');



var options = {
	    'separator': ',',
	    'quote': '"',
	    'escape': '"',       
	    'comment': '',
	};

var reader = csv.createCsvFileReader('./out/key_EVA.csv', options);

	

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

var pl = new NDDB(),
	db = new NDDB(),
	dbeva = new NDDB();

db.h('player', function(gb) {
	return gb.player;
});

db.h('key', function(gb) {
	return gb.key;
});

pl.h('id', function(gb) {
	return gb.id;
});

pl.load('./out/PL.nddb');
pl.sort('pc');
var pnames = pl.map(function(p){
	return "P_" + p.pc;
});

pl.rebuildIndexes();



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
		
	    var pleva = {
	    		player: data.player,
	    		to: data.who,
	    		eva: Number(data.score),
	    		round: Number(data.round),
	    		rev: countRevs[data.player],
	    };
	    db.insert(pleva);
	    //console.log(face);
	}
});


reader.on('end', function(){
	
	db.rebuildIndexes();
	
	var players = db.groupBy('player');
	
	J.each(players, function(p){
		var rounds = p.groupBy('round');
		
		J.each(rounds, function(r){
			console.log(r.first());
			var player = r.first().player;
			var round = r.first().round;
			var mean_eva = r.mean('eva');
			var stddev_eva = r.stddev('eva');
			dbeva.insert({
				player: 'P_' + pl.id[player].first().pc,
				round: round,
				eva_mean: mean_eva,
				eva_stddev: stddev_eva,
			});
			//console.log(player + ' - ' + round + ': ' + mean_eva + ' | ' + stddev_eva);
		});
	});
	
	db.save('./nddb/mean_eva_per_round.nddb');
	console.log('wrote nddb file.');
	
	
	
	
	writeRoundStats();
	console.log('wrote csv files');
});


function writeRoundStats(path) {
	var round = 1;
	
	var writer = csv.createCsvStreamWriter(fs.createWriteStream('./csv/eva/eva_x_player.csv'));
	writer.writeRecord(pnames);

	var rWriter = csv.createCsvStreamWriter(fs.createWriteStream('./csv/eva/eva_x_round.csv'));
	
	while (round < 31) {
		
		// Divided by player
		var round_stuff = dbeva.select('round','=',round).sort('player');
		var evas = round_stuff.map(function(p){
			return p.eva_mean;
		});
		writer.writeRecord(evas);
	
		round++;
	}


	var header = J.seq(1,30,1,function(e){
		if (e < 10) {
			e = '0' + e;
		}
		return 'R_' + e;
	});
	rWriter.writeRecord(header);
	
	for (var pl in db.player) {
		if (db.player.hasOwnProperty(pl)) {
			
			db.player[pl].sort(['round','rev']);
			for (var i = 1; i < 4; i++) { 
				var evas_pl = db.player[pl].map(function(p) {
					if (p.rev === i) return p.eva;
				});
				rWriter.writeRecord(evas_pl);
			}
		}
	}
	
	
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



//
//fs.writeFile('./csv/eva_rounds.csv', window.document.innerHTML, function(err) {
//    if(err) {
//        console.log(err);
//    } else {
//        console.log("The file was saved!");
//    }
//}); 