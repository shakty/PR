function PeerReview () {
	
	this.name = 'Game Example';
	this.description = 'General Description';
	this.version = '0.3';
	
	this.minPlayers = 1;
	this.maxPlayers = 10;
	
	this.automatic_step = true;
	
	this.init = function() {
		this.threshold = 5;
		this.reviewers = 3;
	};
	
	var pregame = function () {
		console.log('Pregame');
	};
	
	var instructions = function () {	
		node.game.pl.save('./out/PL.nddb');
		console.log('Instructions');
	};
		
	var creation = function () {		
		console.log('creation');
	};
	
	var evaluation = function(){
		
		var R =  (this.pl.length > 3) ? this.reviewers
									  : (this.pl.length > 2) ? 2 : 1;
		
		var faces = this.memory.select('state', '=', this.previous())
							   .join('player', 'player', 'CF', 'value')
							   .select('key', '=', 'SUB')
							   .fetch();
		
//		console.log(faces);
		
		matches = node.JSUS.latinSquareNoSelf(faces.length, R);
//		console.log('STEEEE');
//		console.log(matches);

		for (var i=0; i < faces.length; i++) {
			var data = {};
			for (var j=0; j < matches.length; j++) {
				//console.log(matches[j][i]);
				var face = faces[matches[j][i]];
				//console.log(face);
				if (!data[face.value]) data[face.value] = [];
				data[face.value].push({
					face: face.CF.value,
					from: face.player,
					ex: face.value,
				});
				//console.log(matches[i][0].player + ' ' + matches[i][1].player);
			}
//			console.log('for ' + faces[i].player);
//			console.log(node.JSUS.size(data.length));
			// Sort by exhibition and send them
			JSUS.each(['A','B','C'], function(ex){
				if (!data[ex]) return;
				for (var z = 0; z < data[ex].length; z++) {
					node.say(data[ex][z], 'CF', faces[i].player);
				} 
			});
		}
		
		console.log('evaluation');
	};
	
	var dissemination = function(){
		// For each exhibition
		// get all the evaluations for each submission
		var exhibs = this.memory.select('state', '>=', this.previous(2))
								.join('player', 'value.for', 'EVA2', ['value'])
								.select('EVA2') 
								.select('key','=','SUB')
								.sort('value')
								.groupBy('value');

		
//		console.log(exhibs.fetch())
////		console.log(this.memory.fetch());
//		console.log(node.game.state);
//		console.log(this.previous(2));
////		console.log(exhibs.length);
//		console.log(this.memory.length);
		
		
		// array of all the selected works (by exhibition);
		var selected = [];
		
		// results of the round (by author) 
		var player_results = [];
		
		
		// Exhibitions Loop
		for (var i=0; i < exhibs.length; i++) {
			
			//console.log('EX ' + i);
			//console.log(exhibs[i].first().EVA2);
			
			// Get the list of works per exhibition
			var works = exhibs[i].groupBy('EVA2.value.for');
			
//			 console.log('-------------------------------------------');
//			 console.log('works: ' + works.length);	
//			 console.log(works);
//			 console.log('-------------------------------------------');
			
			// Evaluations Loop
			for (var j=0; j < works.length; j++) {
	
//				console.log('work: ' + works[j].length);
//				for (var k=0; k < works[j].length; k++) {
//					console.log(works[j].get(k));
//				}
//				console.log(works[j].fetchValues());
//				console.log(works[j].first());
//				console.log(works[j].last());
				
				var player = works[j].first().player;
				
				var mean = works[j].mean('EVA2.value.eva'); 
//				console.log('Mean: ' + mean);
//				console.log('T: ' + this.threshold);
				
				var player_result = {
						player: player,
						mean: mean.toFixed(2),
						scores: works[j].fetch('EVA2.value.eva'),
						ex: works[j].first().value
				};
				
				
				// Threshold
				if (mean > this.threshold) {	
					
					player_result.published = true;
					
					var cf = this.memory.select('state', '=', this.previous(2))
										.select('player', '=', player)
										.select('key', '=', 'CF');
				
					
//					console.log('cf');
//					console.log(cf);
					
					var author = this.pl.select('id', '=', player).first();
					
										
					// This should always exist
					if (author) {
						selected.push({ex: works[j].first().value,
								   mean: mean.toFixed(2),
								   author: author.name,
								   cf: cf.first().value,
								   id: author.name,
								   round: node.game.state.toHash('S.r'),
								   pc: author.pc,
						});
					}
					
				}
				
				// Add results for single player
				player_results.push(player_result);
				
				
			}
		}

		
		//console.log(node.game.memory.key.CF.first());
		
		var filename = './out/pr_' + node.game.state.toHash('S.s.r') + '.nddb';
		node.game.memory.save(filename);
//		console.log('SELECTED');
//		console.log(selected);
		//console.log(this.memory.db);
		
		// Dispatch exhibition results to ALL
		node.say(selected, 'WIN_CF', 'ALL');
		// Dispatch detailed individual results to each single player
		JSUS.each(player_results, function(r){
			node.say(r, 'PLAYER_RESULT', r.player);
		});

		console.log('dissemination');
	};
	
	var questionnaire = function() {
		console.log('Postgame');
	};
	
	var endgame = function() {
		console.log('Game ended');
		
//		node.random.exec(function(){
//			node.replay(true);
//		},1000);
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

//	var testloop = JSUS.clone(gameloop);
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
	var node = require('../../../node_modules/nodegame-server/node_modules/nodegame-client');
	module.exports.node = node;
	module.exports.PeerReview = PeerReview;
}


var conf = {
	name: "PeerReview_Logic",
	url: "http://localhost:8080/pr/admin",
	verbosity: 0,
	io: {				 
	     reconnect: false
	} 
};

node.play(conf, new PeerReview());
