function Monitor_Example () {
	
	this.name = 'Peer Review Game Observer';
	this.description = 'General Description';
	this.version = '0.3';
	
	this.observer = true;	
	
	// TODO: Check auto_step = false
	this.automatic_step = false;
	
	
//	this.minPlayers = 2;
//	this.maxPlayers = 10;
	
	this.init = function() {
		//node.window.setup('MONITOR');
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
				var cf = node.widgets.get('ChernoffFaces', cf_options);
				return cf.getCanvas();
			}
		};
		
		this.summary = node.widgets.append('GameTable', document.body, {render: {
			pipeline: renderCF,
		 	returnAt: 'first',
		}});
		
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
	
	var quiz = function() {		
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
				
			2: {state: 	quiz,
				name: 	'Quiz'
			},
			
			3: {rounds:	30, 
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