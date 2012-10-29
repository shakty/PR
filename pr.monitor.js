function Monitor_Example () {
	
	this.name = 'Peer Review Game Observer';
	this.description = 'General Description';
	this.version = '0.3.1';
	
	this.observer = true;	
	
	// TODO: Check auto_step = false
	this.automatic_step = false;
	
	
//	this.minPlayers = 2;
//	this.maxPlayers = 10;
	
	window.App = Ember.Application.create();
	
	this.init = function() {
		node.window.setup('MONITOR');
		
		// Create the Ember objects and bindings.
		App.Player = DS.Model.extend({
			id: DS.attr('string'),
			balance: DS.attr('string')
		});

		App.players = Ember.ArrayController.create();

		var paymentView = Ember.View.create({
			templateName: 'PaymentWidget'
		});
		paymentView.appendTo('#root');
		
				
	};
	
	var players_objects = {};

	node.on('UPDATED_PLIST', function(){
		var playerlist = node.game.pl.db;

		// For each of those objects, is the user already in the system? - getting an initial credit
		if(playerlist.length >= 0){
			_.each(playerlist, function(player){

				if(typeof players_objects[player.pc] === 'undefined'){

					// Add the initial amount to the players balance.
					players_objects[player.pc] = {balance: 10};

				} 
				
			});

			var playerlist_for_view = _.map(_.keys(players_objects), function(key){
				return {id: key, balance: players_objects[key].balance};
			});

			App.players.set('content', playerlist_for_view);
		}
	});
	
	
	node.onDATA('PLAYER_RESULT', function(msg) {
		
		var winner = msg.data;
		
		//console.log(winner);
		if ('undefined' !== typeof players_objects[winner.pc]) {
			// Add the initial amount to the players balance.
			players_objects[winner.pc].balance += parseFloat(winner.payoff);
		}
		
		
		var playerlist_for_view = _.map(_.keys(players_objects), function(key){
			return {id: key, balance: players_objects[key].balance};
		});

		App.players.set('content', playerlist_for_view);			
		
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
	
	var quiz = function() {		
		console.log('quiz');
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
			
			3: {state: 	quiz,
				name: 	'Quiz'
			},
				
			4: {rounds:	30, 
				state: 	gameloop,
				name: 	'Game'
			},
			
			5: {state:	questionnaire,
				name: 	'Questionnaire'
			},
				
			6: {state:	endgame,
				name: 	'Thank you'
			}
			
	};	
}