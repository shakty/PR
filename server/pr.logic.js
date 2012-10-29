function PeerReview () {
	
	this.name = 'Peer Review Logic';
	this.description = 'Peer review logic';
	this.version = '0.3';
	
	this.minPlayers = 1;
	this.maxPlayers = 10;
	
	this.automatic_step = true;
	
	this.init = function() {
		this.threshold = 5;
		this.reviewers = 3;
		
		node.env('com', function() {
			node.game.payoff = 3;
		});
		
		node.env('coo', function() {
			node.game.payoff = 2;
		});
		
		this.exhibitions = {
			A: 0,
			B: 1,
			C: 2,
		};
		
		this.last_reviews;
		this.last_submissions;
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
		
	var quiz = function () {	
//		node.game.pl.save('./out/PL.nddb');
//		node.game.plids = node.game.pl.keep('id').fetch();
		console.log('Quiz');
	};
	
	var creation = function () {		
		console.log('creation');
	};
	
	var evaluation = function(){
		var that = this;
		
		var R =  (this.pl.length > 3) ? this.reviewers
									  : (this.pl.length > 2) ? 2 : 1;
		
		
		var dataRound = this.memory.select('state', '=', this.previous())
							   .join('player', 'player', 'CF', 'value')
							   .select('key', '=', 'SUB');
							
		
		var subByEx = dataRound.groupBy('value');
		
		this.last_submissions = [[], [], []];
		var idEx;
		J.each(subByEx, function(e) {
			e.each(function(s) { 
				idEx = that.exhibitions[s.value];
				node.game.last_submissions[idEx].push(s.player);
			});
		});
		
		var matches;
		node.env('review_random', function(){
			faces = dataRound.fetch();
			matches = J.latinSquareNoSelf(faces.length, R);
			
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
			
			var pool = that.nextround_reviewers;
			var elements = that.last_submissions;
			
			// First round
			if (!pool) {
				pool = J.map(elements, function(ex) { return [ex]; });
			}
		
//			console.log('pool');
//			console.log(pool);
//			
//			console.log('elements');
//			console.log(elements);
			
			var rm = new RMatcher();
			rm.init(elements, pool);
			
			var matches = rm.match();
			
//			console.log('Matches');
//			console.log(matches);
			
			var data = {};
			for (var i = 0; i < elements.length; i++) {
				for (var j = 0; j < elements[i].length; j++) {
					
					for (var h = 0; h < matches[i][j].length; h++) {
						
						var face = dataRound.select('player', '=', elements[i][j]).first();
						if (!data[face.value]) data[face.value] = [];

						data = {
							face: face.CF.value,
							from: face.player,
							ex: face.value,
						};
						node.say(data, 'CF', matches[i][j][h]);
					}
					
				}
			
			}
		});
		
		this.last_reviews = {};
		// Build reviews index
		node.onDATA('EVA', function(msg) {
			if (!that.last_reviews[msg.data.for]) {
				that.last_reviews[msg.data.for] = [];
			}
			that.last_reviews[msg.data.for].push(msg.data.eva);
		});

		console.log('evaluation');
	};
	
	var dissemination = function() {
		var exids = ['A', 'B', 'C'];
		var submissionRound = this.previous(2);
		
		this.nextround_reviewers = [ [[], []], [[], []], [[], []] ];
		

		// array of all the selected works (by exhibition);
		var selected = [];
		
		// results of the round (by author) 
		var player_results = [];
		
		var ex, author, cf, mean, player, works, nPubs, nextRoundReviewer, player_result;
		
		var subRound = this.memory.select('state', '=', submissionRound);
		
		for (var i=0; i < this.last_submissions.length; i++) {
			// Groups all the reviews for an artist
			works = this.last_submissions[i];
			
			// Evaluations Loop
			for (var j=0; j < works.length; j++) {
				player = works[j];
				author = this.pl.select('id', '=', player).first();
				
				if (!author) {
					node.err('No author found. This should not happen. Some results are missing.');
					continue;
				}
				
				if (!this.last_reviews[player]) {
					node.err('No reviews for player: ' + player + '. This should not happen. Some results are missing.');
					continue;
				}
				
				mean = 0;
				J.each(this.last_reviews[player], function(r) {
					mean+= r; 
				});
				
				mean = mean / this.last_reviews[player].length;
				
				
				
				cf = subRound.select('player', '=', player)
							 .select('key', '=', 'CF')
							 .first().value;

				ex = exids[i];
				
				nextRoundReviewer = 1; // player is a submitter: second choice reviewer
				
				player_result = {
						player: player,
						author: author.name,
						mean: mean.toFixed(2),
						scores: this.last_reviews[player],
						ex: ex,
						round: submissionRound,
						payoff: 0, // will be updated later
				};
				
				
				// Threshold
				if (mean > this.threshold) {	
					
					J.mixin(player_result, {
						cf: cf,
						id: author.name,
						round: node.game.state.toHash('S.r'),
						pc: author.pc,
						published: true,
					});
					
					selected.push(player_result);
					
					// Player will be first choice as a reviewer
					// in exhibition i
					nextRoundReviewer = 0;
				}
				
				// Add player to the list of next reviewers for the 
				// exhibition where he submitted / published
				this.nextround_reviewers[i][nextRoundReviewer].push(player);		
				
				//console.log('Color ' + author.color + ' submitted to ' + ex + '(' + i + ') ' + 'round: ' + node.game.state.round);
				
				// Add results for single player
				player_results.push(player_result);
			}
		}
				
		// Dispatch exhibition results to ALL
		node.say(selected, 'WIN_CF', 'ALL');
		// Dispatch detailed individual results to each single player
		J.each(player_results, function(r) {
			node.env('com', function(){
				if (r.published) {
					idEx = node.game.exhibitions[r.ex];
					nPubs = node.game.nextround_reviewers[idEx][0].length;
					r.payoff = (node.game.payoff / nPubs).toFixed(2);
				}
			});
			node.env('coo', function(){
				if (r.published) {
					r.payoff = node.game.payoff;
				}
			});
			node.say(r, 'PLAYER_RESULT', r.player);
		});
		
		// Save to file
		var filename;
		try {
			filename = './out/pr_' + node.game.state.toHash('S.s.r') + '.nddb';
			node.game.memory.save(filename);
		}
		catch(e){
			console.log(e.msg);
		}
		

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
				
				3: {state: quiz,
					name: 'Quiz',
				},
				
//				3: {state: 	testloop,
//					name: 	'Test Game'
//				},
					
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
		com: true,
	},
};

node.play(conf, new PeerReview());
