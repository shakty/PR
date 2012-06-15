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
db.h('state', function(gb) {
	return gb.state.state + '.' + gb.state.step +  '.' + gb.state.round;
});
db.h('key', function(gb) {
	return gb.key;
});

pl.h('id', function(gb) {
	return gb.id;
});

pl.load('./pl.nddb');
//pl.sort('pc');
var pnames = pl.map(function(p){
	return "P_" + p.pc;
});



reader.on('data', function(data) {
	
    var pleva = {
    		player: data.player,
    		to: data.who,
    		eva: Number(data.score),
    		round: Number(data.round),
    };
    db.insert(pleva);
    //console.log(face);
});


reader.on('end', function(){
	
	var players = db.groupBy('player');
	
	J.each(players, function(p){
		var rounds = p.groupBy('round');
		
		J.each(rounds, function(r){
			var player = r.first().player;
			var round = r.first().round;
			var mean_eva = r.mean('eva');
			var stddev_eva = r.stddev('eva');
			dbeva.insert({
				player: "" + player,
				round: round,
				eva_mean: mean_eva,
				eva_stddev: stddev_eva,
			});
			//console.log(player + ' - ' + round + ': ' + mean_eva + ' | ' + stddev_eva);
		});
	});
	
	db.save('./nddbs/mean_eva_per_round.nddb');
	console.log('wrote nddb file.');
	
	
	
	
	writeRoundStatsFull('./csv/eva_x_round_x_player.csv');
	
	writeRoundStats('./csv/test.csv');
	//writeCsv('./csv/test.csv', dbeva.fetchValues(), {headers: J.keys(dbeva.first())});
	
	console.log('wrote csv file');
});


function writeRoundStatsFull(path) {
	
	var writer = csv.createCsvStreamWriter(fs.createWriteStream( path, {'flags': 'a'}));
	writer.writeRecord(['round'].concat(pnames));
	
	var rounds = db.groupBy('round');
	
	J.each(rounds, function(r){
		var players = r.groupBy('player');
		
		for (var i = 0; i < 3; i++) {
			var evas = [players[i].first().round];
			for (var j = 0; j < 9; j++) {
				evas.push(players[j].db[i].eva);
			}
			writer.writeRecord(evas);
		}
		
			
			//console.log(player + ' - ' + round + ': ' + mean_eva + ' | ' + stddev_eva);
	});
}

function writeRoundStats(path) {
	var round = 1;
	
	var writer = csv.createCsvStreamWriter(fs.createWriteStream( path, {'flags': 'a'}));
	writer.writeRecord(pnames);
	
	while (round < 31) {
		var round_stuff = dbeva.select('round','=',round);
		var evas = round_stuff.map(function(p){
			return p.eva_mean;
		});
		writer.writeRecord(evas);
		round++;
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