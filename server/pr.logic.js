function PeerReview () {
	
	this.name = 'Peer Review Logic';
	this.description = 'Peer review logic';
	this.version = '0.3';
	
	this.minPlayers = 1;
	this.maxPlayers = 10;
	
	this.automatic_step = true;
	
	this.init = function() {
		this.threshold = 1;
		this.reviewers = 3;
		
		this.exhibitions = {
				A: 0,
				B: 1,
				C: 2,
		};
		
		this.results = new node.NDDB();
		
		this.nextround_reviewers;
		this.plids = [];
	};
	
	var pregame = function () {
		console.log('Pregame');
	};
	
	var instructions = function () {	
		node.game.pl.save('./out/PL.nddb');
		node.game.plids = node.game.pl.keep('id').fetch();
		console.log('Instructions');
	};
		
	var creation = function () {		
		console.log('creation');
	};
	
	var evaluation = function(){
		var that = this;
		
		var R =  (this.pl.length > 3) ? this.reviewers
									  : (this.pl.length > 2) ? 2 : 1;
		
		console.log('R = ' + R);
		console.log('********')
		
		var dataRound = this.memory.select('state', '=', this.previous())
							   .join('player', 'player', 'CF', 'value')
							   .select('key', '=', 'SUB');
							
		
		var subByEx = dataRound.groupBy('value');
		
		var matches;
		node.env('review_random', function(){
			faces = dataRound.fetch();
			matches = J.latinSquareNoSelf(faces.length, R);
			
			console.log('MATCHES: ');
			console.log(matches);

			for (var i=0; i < faces.length; i++) {
				var data = {};
				for (var j=0; j < matches.length; j++) {
					var face = faces[matches[j][i]];

					if (!data[face.value]) data[face.value] = [];
					
					data[face.value].push({
						face: face.CF.value,
						from: face.player,
						ex: face.value,
					});
				}

				// Sort by exhibition and send them
				J.each(['A','B','C'], function(ex){
					if (!data[ex]) return;
					for (var z = 0; z < data[ex].length; z++) {
						node.say(data[ex][z], 'CF', faces[i].player);
					} 
				});
			}
			
		});
		
		node.env('review_select', function() {
				
			var elements = [[], [], []], idEx;
			J.each(subByEx, function(e) {
				e.each(function(s) { 
					idEx = that.exhibitions[s.value];
					elements[idEx].push(s.player);
				});
			});
			
			var pool = that.nextround_reviewers;
			
			// First round
			if (!pool) {
				console.log('init pool from same round');
				pool = J.map(elements, function(ex) { return [ex]; });
			}
		
			console.log('pool');
			console.log(pool);
			
			console.log('elements');
			console.log(elements);
			
			var rm = new RMatcher();
			rm.init(elements, pool);
			
			var matches = rm.match();
			
			console.log('Matches');
			console.log(matches);
			
			var data = {};
			for (var i = 0; i < elements.length; i++) {
				for (var j = 0; j < elements[i].length; j++) {
					
					for (var h = 0; h < matches[i][j].length; h++) {
						
						var face = dataRound.select('player', '=', elements[i][j]).first();
						if (!data[face.value]) data[face.value] = [];
						
//						data[face.value].push({
//							face: face.CF.value,
//							from: face.player,
//							ex: face.value,
//						});

						data = {
							face: face.CF.value,
							from: face.player,
							ex: face.value,
						};
						node.say(data, 'CF', matches[i][j][h]);
					}
					
//					J.each(['A','B','C'], function(ex){
//						if (!data[ex]) return;
//						for (var z = 0; z < data[ex].length; z++) {
//							node.say(data[ex][z], 'CF', elements[i][j]);
//						} 
//					});
				}
			
			}
		});
		
		

		console.log('evaluation');
	};
	
	var dissemination = function() {
		
		var submissionRound = this.previous(2);
		
		this.nextround_reviewers = [ [[], []], [[], []], [[], []] ];
		
		
		// For each exhibition
		// get all the evaluations for each submission
		var exhibs = this.memory.select('state', '>=', submissionRound)
								.join('player', 'value.for', 'EVA2', ['value'])
								.select('EVA2') 
								.select('key','=','SUB')
								.sort('value')
								.groupBy('value');
		
		
		// array of all the selected works (by exhibition);
		var selected = [];
		
		// results of the round (by author) 
		var player_results = [];
		
		var idEx, ex, author, cf, mean, player, works;
		
		// Exhibitions Loop
		for (var i=0; i < exhibs.length; i++) {
			
			// Get the list of works per exhibition
			works = exhibs[i].groupBy('EVA2.value.for');
						
			// Evaluations Loop
			for (var j=0; j < works.length; j++) {
	
				player = works[j].first().player;
				
				mean = works[j].mean('EVA2.value.eva'); 
				
				cf = this.memory.select('state', '=', submissionRound)
									.select('player', '=', player)
									.select('key', '=', 'CF');


				
				author = this.pl.select('id', '=', player).first();
				
				ex = works[j].first().value;
				idEx = this.exhibitions[ex];
				nextRoundReview = 1; // player is a submitter: second choice reviewer
				
				var player_result = {
						player: player,
						author: author.name,
						mean: mean.toFixed(2),
						scores: works[j].fetch('EVA2.value.eva'),
						ex: ex,
						round: submissionRound,
				};
				
				
				// Threshold
				if (mean > this.threshold) {	
					
					player_result.published = true;
					
					selected.push(J.merge(player_result, {
						cf: cf.first().value,
						id: author.name,
						round: node.game.state.toHash('S.r'),
						pc: author.pc,
					}));
					
					// Player will be first choice as a reviewer
					// in exhibition idEx
					nextRoundReviewer = 0;
					
				} 
				
				// Add player to the list of next reviewers for the 
				// exhibition where he submitted / published
				this.nextround_reviewers[idEx][nextRoundReviewer].push(player);		
				
				console.log('Color ' + author.color + ' submitted to ' + ex + '(' + idEx + ') ' + 'round: ' + node.game.state.round);
				
				// Add results for single player
				player_results.push(player_result);
				
				// Add it to the local DB of results
				this.results.insert(player_result);
			}
		}

		
		var filename = './out/pr_' + node.game.state.toHash('S.s.r') + '.nddb';
		
		try {
			node.game.memory.save(filename);
		}
		catch(e){
			console.log(e.msg);
		}

		
		// Dispatch exhibition results to ALL
		node.say(selected, 'WIN_CF', 'ALL');
		// Dispatch detailed individual results to each single player
		J.each(player_results, function(r){
			node.say(r, 'PLAYER_RESULT', r.player);
		});
		
		

		console.log('dissemination');
	};
	
	var questionnaire = function() {
		console.log('Postgame');
	};
	
	var endgame = function() {
		console.log('Game ended');
		node.memory.dumpAllIndexes('./out/');
		
	};
	
	var gameloop = { // The different, subsequent phases in each round
			
			1: {state: creation,
				name: 'Creation',
			},
			
			2: {state: evaluation,
				name: 'Evaluation',
			},
			
			3: {state: dissemination,
				name: 'Exhibition',
			}
		};

//	var testloop = J.clone(gameloop);
//	testloop[4] = {name: 'Test completed',
//				   state: function() {
//						console.log('Test round completed');
//					},
//	};

		
		// LOOPS
		this.loops = {
				
				
				1: {state:	pregame,
					name:	'Game will start soon'
				},
				
				2: {state: 	instructions,
					name: 	'Instructions'
				},
				
//				3: {state: 	testloop,
//					name: 	'Test Game'
//				},
					
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

if ('object' === typeof module && 'function' === typeof require) {
	var node = require('nodegame-client');
	var RMatcher = require('./rmatcher.js');
	var J = node.JSUS;
	
	module.exports.node = node;
	module.exports.PeerReview = PeerReview;
}


var conf = {
	name: "PeerReview_Logic",
	url: "http://localhost:8080/pr/admin",
	verbosity: 0,
	io: {				 
	     reconnect: false
	},
	env: {
		review_select: true,
	},
};

node.play(conf, new PeerReview());
