var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	d3 = require('d3');


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

db.load('./all_cf.nddb');
db.sort('player.pc');
db.rebuildIndexes();

var outs =  players = db.groupBy('player.id');

//for (var i=0; i < outs.length; i++) {
//	console.log('??????????????????????')
//	console.log(outs[i].nddb_pointer);
//	console.log(outs[i])
//}

var states = db.groupBy('state');

console.log(states.length);

var html = d3.select('html');

var table = html.append('table');
    thead = table.append("thead"),
    tbody = table.append("tbody");

// append the header row
thead.append("tr")
    .selectAll("th")
    .data(players)
    .enter()
    .append("th")
        .text(function(pl) { 
        	return pl.first().player.pc; 
        });

// create a row for each object in the data
var rows = tbody.selectAll("tr")
    .data(states)
    .enter()
    .append("tr");

//// create a cell in each row for each column
var cells = rows.selectAll("td")
    .data(players)
    .enter()
    .append("td")
    	.append('img')
	        .attr('src', function(pl) {
	        	
	        	if (pl.nddb_pointer > 29) {
	        		pl.nddb_pointer = 0;
	        	}
	
	//        	console.log('L: ' + pl.length);
	//        	console.log('Pointer: ' + pl.nddb_pointer);
	//        	console.log('--------------------')
	//        	console.log(pl.nddb_pointer)
	        	var item = pl.get();
	        	//console.log('got')
	        	//console.log(item)
	        	if (item) {
	        		var filename = './faces/' + item.player.pc + '_' + item.state.round + '.png';
	            	//console.log(filename)
	            	pl.next();
	            	return filename;
	        	}
	        	else {
	        		return pl.nddb_pointer;
	        	}
	        })
			.attr('width',150)
			.style('margin', '3px')
			.style('border', '3px solid #CCC');







fs.writeFile('./index.htm', window.document.innerHTML, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
}); 