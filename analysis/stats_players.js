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

var db = new NDDB();

db.h('player', function(gb) {
	return gb.player;
});
db.h('state', function(gb) {
	return gb.state.state + '.' + gb.state.step +  '.' + gb.state.round;
});
db.h('key', function(gb) {
	return gb.key;
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

	var dbeva = new NDDB();
	
	var players = db.groupBy('player');
	
	J.each(players, function(p){
		var rounds = p.groupBy('round');
		J.each(rounds, function(r){
			var player = r.first().player;
			var round = r.first().round;
			var mean_eva = r.mean('eva');
			var stddev_eva = r.stddev('eva');
			dbeva.insert({
				player: player,
				round: round,
				eva_mean: mean_eva,
				eva_stddev: stddev_eva,
			});
			console.log(player + ' - ' + round + ': ' + mean_eva + ' | ' + stddev_eva);
		});
	});
	
	db.save('./nddbs/mean_eva_per_round.nddb');
	console.log('wrote file.');
});



/**
 * Takes an obj and write it down to a csv file;
 */
//node.fs.writeCsv = function (path, obj) {
//	var writer = csv.createCsvStreamWriter(fs.createWriteStream( path, {'flags': 'a'}));
//	var i;
//    for (i=0;i<obj.length;i++) {
//		writer.writeRecord(obj[i]);
//	}
//};
//
//node.fs.writeCsv(path, node.game.memory.split().fetchValues());
//
//fs.writeFile('./csv/eva_rounds.csv', window.document.innerHTML, function(err) {
//    if(err) {
//        console.log(err);
//    } else {
//        console.log("The file was saved!");
//    }
//}); 