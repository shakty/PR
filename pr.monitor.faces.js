function Monitor_Example () {
	
	this.name = 'Peer Review Game Observer';
	this.description = 'General Description';
	this.version = '0.3';
	
	this.observer = true;	
	
	// TODO: Check auto_step = false
	this.automatic_step = false;
	
	
	
	this.init = function() {
		
		var that = this;
		
		var renderCF = function (cell) {
			// Check if it is really CF obj
			if (cell.content.head_radius) {
				var cf_options = { id: 'cf_' + cell.x,
						   width: 200,
						   height: 200,
						   features: cell.content,
						   controls: false
				};
				var cf = node.window.getWidget('ChernoffFacesSimple', cf_options);
				return cf.getCanvas();
			}
		};
		
		this.summary = node.window.addWidget('GameTable', document.body, {render: {
			pipeline: renderCF,
		 	returnAt: 'first',
		}});
		
//		var html = d3.select('html');
//		
//		this.table = html.append('table').style('width','98%');
//		 	
//		this.thead = this.table.append("thead");
//		this.tbody = this.table.append("tbody");
//		
//		
//		
//		var players_objects = {};
//
//		var that = this;
//		
//		node.onPLIST(function(msg) {
//			var o = new node.PlayerList();
//			o.importDB(msg.data);
//			var players = o.fetch();
//			console.log(o.length);
//			that.thead.append("tr")
//			    .selectAll("th")
//			    .data(players)
//			    .enter()
//			    .append("th")
//			    	.text(function(e){
//			    		console.log('AAA ' + e.name);
//			    		return e.name;
//			    	});
//		});
//		
//		node.on('in.set.DATA', function(msg) {
//		
//			
//			
//			// TODO: bug of onDATA
//			if (msg.text !== 'CF') return;
//			
//			console.log('received CF');
//			
//			
//			// create a row for each object in the data
//						
//			// create a row for each object in the data
//			var rows = that.tbody.append("tr")
//			    .style('border','1px solid #CCC');
//			
//			console.log('Appended TR');
//			
//			var cells = rows.selectAll("td")
//		    .data(msg.data)
//		    .enter()
//		    .append("td")
//		    .style('border','1px solid #CCC')
//		    	.html(function(ex) {
//		    		console.log(ex);
//		    		var cf_options = { id: 'cf_' + Math.random(),
//							   width: 200,
//							   height: 200,
//							   features: ex.value,
//							   controls: false
//					};
//					var cf = W.getWidget('ChernoffFacesSimple', cf_options);
//					return cf.getCanvas();
//		    	});
//		
//			console.log('Appended TDs');
//	});
		
		
	};
	
	

	
	
	function printGameState () {
		var name = node.game.gameLoop.getName(node.state);
		console.log(name);
	};
	
	
	
	var pregame = function(){
		console.log('Pregame');
	};
	
	var instructions = function() {		
		console.log('Instructions');
	};
		
	var creation = function() {
		console.log('creation');
	};
	
	var submission = function() {
		//document.body.appendChild(this.summary.parse());
		console.log('submission');
	};
	
	var evaluation = function(){
		console.log('evaluation');
	};
	
	var dissemination = function(){
		console.log('dissemination');
	};
	
	var questionnaire = function() {
		console.log('Postgame');
	};
	
	var endgame = function() {
		console.log('Game ended');
	};
	
	var waiting = function(){
		console.log('Waiting');
	};
		
	var gameloop = { // The different, subsequent phases in each round
			
			1: {state: creation,
				name: 'Creation'
			},
			
			2: {state: submission,
				name: 'Submission'
			},
			
			3: {state: evaluation,
				name: 'Evaluation'
			},
			
			4: {state: dissemination,
				name: 'Exhibition'
			}
	};
		
	// LOOPS
	this.loops = {
			
			
			1: {state:	pregame,
				name:	'Game will start soon'
			},
			
			2: {state: 	instructions,
				name: 	'Instructions'
			},
				
			3: {rounds:	10, 
				state: 	gameloop,
				name: 	'Game'
			},
			
			4: {state:	questionnaire,
				name: 	'Questionnaire'
			},
				
			5: {state:	endgame,
				name: 	'Thank you'
			}
			
	};	
}