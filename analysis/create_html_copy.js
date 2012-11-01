var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	J = require('./../node_modules/NDDB/node_modules/JSUS/jsus.js').JSUS,
	d3 = require('d3');

module.exports = create_html_copy;

function create_html_copy(DIR) {
	
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
	
	
	db.load(DIR + 'all_cf_sub_eva_copy.nddb');
	
	db.each(function(e){
		e.state.round = Number(e.state.round);
	});
	
	db.sort(['state.round', 'player.pc']);
	
	db.h('copies', function(e){
		if (!e.copy) return;
		return e.copy.copied_from.id + '_' + e.copy.copied_round;
	});
	
	db.rebuildIndexes();
	
	
	
	var copies = J.obj2Array(db.copies,1); 
	
	var thcopies = J.keys(db.copies);
//	console.log(thcopies);
	
	
	var outs =  players = db.groupBy('player.id');
	
	
	var states = db.groupBy('state');
	
	
	function displayFace(item, player) {
		var item, border, filename, pub, avg, style, content;
		
		filename = '../faces/' + item.player.pc + '_' + item.state.round + '.png';
		//console.log(filename)
		pub = item.published ? 'P' : 'NP';
		avg = item.avg;
		
//		console.log(avg)
		
		style =  "width: 150px; margin: 3px; border: 3px solid ";
		style+= item.published ? "yellow;" : "#CCC";
		content = '<img src="' + filename + '" style="' + style + '"/>';
		content += '<br/>';
		content += '<span style="text-align: center;">' + avg + '</span>';
		content += '<span style="text-align: center;">' + item.ex + '</span>';
		content += '&nbsp;<span >' + item.state.round + '</span>';
		
		if (player) {
			content += '&nbsp;<span>' + item.player.pc + '</span>';
		}
		
		return content;
	}
	
	
	// BEGIN
	
	var html = d3.select('html');
	
	html.append('style')
			.attr('type', 'text/css')
			.text('.copies {border: 1px solid #CCC; vertical-align: top; width: 100px}');
	
	
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
	
	var item, content;
	var cells = rows.selectAll("td")
	    .data(players)
	    .enter()
	    .append("td")
	    	.html(function(pl) {
		        	
		        	// BUG
		        	if (pl.nddb_pointer > 29) {
		        		pl.nddb_pointer = 0;
		        	}
		        	item = pl.get();
					//Update pointer
					pl.next();
		        	
	//        		filename = './faces/' + item.player.pc + '_' + item.state.round + '.png';
	//            	//console.log(filename)
	//        		pub = item.published ? 'P' : 'NP';
	//        		avg = item.avg;
	//        		style =  "width: 150px; margin: 3px; border: 3px solid ";
	//        		style+= item.published ? "yellow;" : "#CCC";
	//        		content = '<img src="' + filename + '" style="' + style + '"/>';
	//        		content += '<br/>';
	//        		content += '<span style="text-align: center;">' + avg + '</span>';
	//        		content += '<span style="text-align: center;">' + item.ex + '</span>';
	//        		content += '&nbsp;<span >' + item.state.round + '</span>';
					
					content = displayFace(item);
	        		if (item.copy) {
	        			var copy = '[' + item.copy.copied_from.pc + ' R_' + item.copy.copied_round + ']';
	        			content += '&nbsp;<span style="font-weight: bold">' + copy + '</span>';
	        		}
	        		return content;
	        		
		        		
		        });
	//			.attr('width',150)
	//			.style('margin', '3px')
	
	
	fs.writeFile(DIR + 'html/index_copy.htm', window.document.innerHTML, function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file copy was saved!");
	    }
	}); 
	
	
	// ONLY COPIES
	
	d3.selectAll('table').remove();
	
	table = html.append('table');
	thead = table.append("thead"),
	tbody = table.append("tbody");
	
	//append the header row
	thead.append("tr")
	    .selectAll("th")
	    .data(thcopies)
	    .enter()
	    .append("th")
	        .html(function(who_round) {
	        	var tokens = who_round.split('_');
//	        	console.log(tokens)
//	        	console.log(db.first())
	        	var face = db.select('player.id', '=', tokens[0])
	        				 .select('state.round', '=', tokens[1]).first();
	        	return displayFace(face, true);
	        });
	
	
	// create a row for each object in the data
	var rows = tbody.append("tr");
	
	
	// create a cell in each row for each column
	var cells = rows.selectAll("td")
	    .data(copies)
	    .enter()
	    .append("td")
	    	.classed('copies', true)
	    	.html(function(e) {
	    		e.sort('state.round');
	    		
	    		var content = '';
	    		e.each(function(item) {
	    			content += displayFace(item, true);
	    			//console.log(item);
	    		});
	    		return content;
	    	});
	
	fs.writeFile(DIR + 'html/index_copies.htm', window.document.innerHTML, function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file copies was saved!");
	    }
	}); 
}