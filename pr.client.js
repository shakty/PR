function PeerReviewGame () {
	
	this.name = 'Peer Review Game';
	this.description = 'Create, submit, and evaluate contributions from your peers.';
	this.version = '0.5';
	
	this.auto_step = false;
	this.auto_wait = true;
	
	this.minPlayers = 2;
	this.maxPlayers = 10;
	
	this.init = function() {			
		node.window.setup('PLAYER');
		node.widgets.append('MoneyTalks', node.window.header, {currency: 'CHF', money: 10});
		
		this.html = {};
		
		node.env('review_select', function(){
			
			node.game.html.creation = 'html/creation_SEL.html';
			
			node.env('coo', function(){ 
				node.game.html.q = 'html/questionnaire_SEL_COO.html';
				node.game.html.instructions = 'html/instructions_SEL_COO.html';
			});
			node.env('com', function(){ 
				node.game.html.q = 'html/questionnaire_SEL_COM.html';
				node.game.html.instructions = 'html/instructions_SEL_COM.html';
			});
		});
		node.env('review_random', function(){
			
			node.game.html.creation = 'html/creation_RND.html';
			
			node.env('coo', function(){ 
				node.game.html.q = 'html/questionnaire_RND_COO.html'; // won't be played now
				node.game.html.instructions = 'html/instructions_RND_COO.html';
			});
			node.env('com', function(){ 
				node.game.html.q = 'html/questionnaire_RND_COM.html';
				node.game.html.instructions = 'html/instructions_RND_COM.html';
			});
		});
		
		
		this.cf = null;
		this.outlet = null;
		this.exs = ['A','B','C'];
		this.donetxt = 'Done!';
		this.milli = 1000;
		this.milli_short = 1000;

		
		this.evaAttr = {
				min: 1,
				max: 9,
				step: 0.5,
				value: 4.5
		};
		
		this.evas = {};
		this.evasChanged = {};
		
		this.all_ex = new node.window.List({ id: 'all_ex',
											 lifo: true,
		});
		
		this.personal_history = null;
		
		this.last_cf = null;
		
		this.renderCF = function (cell) {
//			console.log('renderCF');
			
			// Check if it is really CF obj
			if (!cell.content || !cell.content.cf) {
				return;
			}

			var w = 200;
			var h = 200;
			
			if (node.game.gameLoop.getName() == 'Creation') {	
				w = 100;
				h = 100;
			}
			
			var cf_options = { id: 'cf_' + cell.x,
					   width: w,
					   height: h,
					   features: cell.content.cf,
					   controls: false,
					   change: false,
					   onclick: function() {
							var that = this;
							var f = that.getAllValues();
	
							var cf_options = { id: 'cf',
					                 width: 400,
					                 height: 400,
					                 features: f,
				                 	 controls: false,
							};
					      
							var cf = node.widgets.get('ChernoffFacesSimple', cf_options);
							

			    	          var div = $('<div class="copyorclose">');
			    	          $(cf.canvas).css('background', 'white');
			    	          $(cf.canvas).css('border', '3px solid #CCC'); 
			    	          $(cf.canvas).css('padding', '5px');

			    	          div.append(cf.canvas);
			    	          
			    	          var buttons = [];
			    	          if (node.game.gameLoop.getName() !== 'Exhibition') {
			    	        	  buttons.push({
			    	        		  text: 'copy',
			    	        		  click: function() {	
					    	            	node.emit('COPIED', f);
					    	            	node.set('COPIED', {
					    	            		author: cell.content.author,
					    	            		ex: cell.content.ex,
					    	            		mean: cell.content.mean,
					    	            		round: cell.content.round,
					    	            	});
					    	                $( this ).dialog( "close" );
					    	              },
			    	        	  });
			    	          }
			    	          
			    	          buttons.push({
			    	        	  text: 'Cancel',
			    	        	  click: function() {
			    	                $( this ).dialog( "close" );
			    	              },
			    	          });
			    	          
			    	          div.dialog({
			    	            width: 460,
			    	            height: 560,
			    	            show: "blind",
			    	            hide: "explode",
			    	            buttons: buttons,
			    	          });
					   }
			};
			
			var container = document.createElement('div');
			
			var cf = node.widgets.append('ChernoffFacesSimple', container, cf_options);
			
				var details_tbl = new node.window.Table();
				details_tbl.addColumn(['Author: ' + cell.content.author,
				                       'Score: ' + cell.content.mean
				]);
				container.appendChild(details_tbl.parse());
			
			return container;
			
		};
		
	};
	
	
	
	var pregame = function() {
		var frame = node.window.loadFrame('html/pregame.html');
		node.emit('DONE');
		console.log('Pregame');
	};
	
	var instructions = function() {
		
		
		node.window.loadFrame(this.html.instructions);
		// Auto Play
		node.env('auto', function(){
			node.emit('DONE');
		});
		
		console.log('Instructions');
	};
	
	var quiz = function () {	
		node.window.loadFrame('html/quiz.html');
		console.log('Quiz');
	};
	
	var creation = function() {
		
		node.window.loadFrame(this.html.creation, function(){
			node.on('CLICKED_DONE', function(){
				$( ".copyorclose" ).dialog('close');
				$( ".copyorclose" ).dialog('destroy');
			});
		});
		console.log('Creation');
	};
	
	
	var evaluation = function() {
		node.window.loadFrame('html/evaluation.html');
		console.log('Evaluation');
	};
	
	var dissemination = function(){
		
		var dt_header = 'Round: ' + node.state.round;
//		if (node.game.gameState.state === 3) {	
//			dt_header = 'Test Round';
//		}
		
		this.all_ex.addDT(dt_header);
		
		var table = new node.window.Table({ className: 'exhibition',
											render: {
												pipeline: this.renderCF,
											 	returnAt: 'first',
											},
									
									 	   
		});
		
		table.setHeader(['A','B','C']);
		
		node.window.loadFrame('html/dissemination.html', function() {
			
			node.game.timer.stop();
			
			node.onDATA('WIN_CF', function(msg) {
				
				if (msg.data.length) {
					var db = new node.NDDB(null,msg.data);
					
					for (var j=0; j < this.exs.length; j++) {
						var winners = db.select('ex', '=', this.exs[j])
										.sort('mean')
										.reverse()
										.fetch();
					
//						console.log('WINNERS');
//						console.log(winners);
						
						if (winners.length > 0) {
							table.addColumn(winners);
						}
						else {
							table.addColumn([' - ']);
						}
					}

					//$('#mainframe').contents().find('#done_box').before(table.parse());
					
					node.window.getElementById('container_exhibition').appendChild(table.parse());

					this.all_ex.addDD(table);

				}
				
				else {
					var str = 'No painting was considered good enough to be put on display';
					node.window.write(str, node.window.getElementById("container_exhibition"));
					this.all_ex.addDD(str);
				}
				
				node.game.timer.restart({ 
					milliseconds: 15000,
					timeup: 'DONE',
				});
			});
			
			node.onDATA('PLAYER_RESULT', function(msg){
				if (!msg.data) return;
				var str = '';
				if (msg.data.published) {
					str += 'Congratulations! You published in exhibition: <strong>' + msg.data.ex + '</strong>. ';
					str += 'You earned <strong>' + msg.data.payoff  + ' CHF</strong>. ';
					node.emit('MONEYTALKS', parseFloat(msg.data.payoff));
				}
				else {
					str += 'Sorry, you got rejected by exhibition: <strong>' + msg.data.ex + '</strong>. ';
				}
				str += 'Your average review score was: <strong>' + msg.data.mean + '</strong>.</br></br>';
				W.getElementById('results').innerHTML = str;
				
			});
			
			
			// Auto play
			node.env('auto', function(){
				node.random.emit('DONE', 5000);
			});
			
		});
		

		
		
		console.log('Dissemination');
	};
	
	var questionnaire = function() {
		
		
		node.window.loadFrame(this.html.q);
		
		console.log('Postgame');

		// AutoPlay
		node.random.emit('DONE');
	};
	
	var endgame = function() {
		node.window.loadFrame('html/ended.html');
		
		console.log('Game ended');
	};
	
	
// Assigning Functions to Loops
	
	var gameloop = { // The different, subsequent phases in each round
		
		1: {name: 'Creation',
			state: creation,
			timer: {
					milliseconds: function() {
						if ( node.state.round < 2) return 80000;
						if ( node.state.round < 3) return 60000;
						return 50000;
					},
					timeup: function() {
						$('#mainframe').contents().find('#done_box button').click();
					}
			},
			done: function (ex) {
				//console.log('executing crea done');
				var exs = ['A','B','C'];
				if (!JSUS.in_array(ex, exs)) {
					// time is up without the player 
					//having selected one of the three exhibitions
					node.window.getElementById('done_button_box').click();
					return false;
				}
				else {
					// Close any open dialog box
					$( ".copyorclose" ).dialog('close');
					this.last_cf = this.cf.getAllValues();
					this.last_ex = ex;
					node.set('SUB', ex);
					node.set('CF', this.last_cf);
					return true;
				}
			}
				
		
		},
		
		2: {name: 'Evaluation',
			state: evaluation,
			timer: 30000,
			done: function () {
				for (var i in this.evas) {
					if (this.evas.hasOwnProperty(i)) {
						node.set('EVA', {
							'for': i,
							eva: Number(this.evas[i].value),
							hasChanged: this.evasChanged[i], 
						});
					}
				}
				this.evas = {};
				return true;
			}
		},
		
		3: {state: dissemination,
			name: 'Exhibition',
		}
	};


//	var testloop = JSUS.clone(gameloop);
//	testloop[4] = {name: 'Test completed',
//				   state: function() {
//						node.window.loadFrame('html/testgame_completed.html');
//						node.DONE();
//					},
//	};
	
	
	
	// LOOPS
	this.loops = {
			
			
			1: {state:	pregame,
				name:	'Game will start soon',
			},
			
			2: {state: 	instructions,
				name: 	'Instructions',
				timer: 	300000,
			},
			
			3: {state: quiz,
				name: 'Quiz',
			},
			
//			3: {state: testloop,
//				name: 'TEST: Game',
//			},
				
			4: {rounds:	30, 
				state: 	gameloop,
				name: 	'Game',
			},
			
			5: {state:	questionnaire,
				name: 	'Questionnaire',
				timer: 	600000,
			},
				
			6: {state:	endgame,
				name: 	'Thank you',
			}
			
	};	
}
