var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	d3 = require('d3');

var DIR = './com_sel/';
///////////////////////

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

db.load(DIR + 'all_cf_sub_eva.nddb');

db.each(function(e){
	e.state.round = Number(e.state.round);
});

db.sort(['player.pc', 'state.round']);
db.rebuildIndexes();

for (var i in db.player) {
	if (db.player.hasOwnProperty(i)) {
		db.player[i].sort('state.round');
		
	}
}

var outs = players = db.groupBy('player.id');

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

var item, border, filename;
var cells = rows.selectAll("td")
    .data(players)
    .enter()
    .append("td")
    	.append('img')
	        .attr('src', function(pl) {
	        	
	        	// BUG
	        	if (pl.nddb_pointer > 29) {
	        		pl.nddb_pointer = 0;
	        	}
	        	item = pl.get();
	        	console.log(pl.nddb_pointer + ' ' + item.state.round);
				//Update pointer
				pl.next();
	        	if (item) {
	        		filename = '../faces/' + item.player.pc + '_' + item.state.round + '.png';
	            	//console.log(filename)
	            	return filename;
	        	}
	        	
	        })
			.attr('width',150)
			.style('margin', '3px')
			.style('border', function(pl){
				// BUG
	        	if (pl.nddb_pointer > 28) {
	        		pl.nddb_pointer = 0;
	        	}
	        	
				item = pl.get();
				
				border = (item.published) ? '3px solid yellow'
										  : '3px solid #CCC';
				
				//Update pointer
				pl.next();
				return border;
			})
		.text(function(pl){
			// BUG
	        	if (pl.nddb_pointer > 29) {
	        		pl.nddb_pointer = 0;
	        	}
	        	item = pl.get();
	        	pl.next();
	        	return item.avg;
		});


fs.writeFile(DIR + 'html/index.htm', window.document.innerHTML, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
}); 