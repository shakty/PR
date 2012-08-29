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
		
	};
	
	var players_objects = {};

	node.onDATA('WIN_CF', function(msg) {
		
		// TODO: bug of onDATA
		if (msg.text !== 'WIN_CF') return;
		
		if (msg.data.length) {
			var playerlist = node.game.pl.db;
			var db = new node.NDDB(null, msg.data);
			
			db.each(function(winner){
				if ('undefined' !== typeof players_objects[winner.pc]){
					// Add the initial amount to the players balance.
					players_objects[winner.pc].balance += 0.75;
				}
			});
			
			var playerlist_for_view = _.map(_.keys(players_objects), function(key){
				return {id: key, balance: players_objects[key].balance};
			});

			App.players.set('content', playerlist_for_view);			
		}
	});
	
	
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