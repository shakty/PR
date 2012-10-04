function PeerReviewGame () {
	
	this.name = 'Peer Review Game';
	this.description = 'Create, submit, and evaluate contributions from your peers.';
	this.version = '0.3';
	
	this.auto_step = false;
	this.auto_wait = true;
	
	this.minPlayers = 2;
	this.maxPlayers = 10;
	
	this.init = function() {			
//		node.window.setup('PLAYER');
//		node.window.addWidget('MoneyTalks', node.window.header, {currency: 'CHF', money: 10});
//		
		//node.window.addWidget('WaitScreen');
		
		this.money = 2;
		
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
					      
							var cf = node.window.getWidget('ChernoffFacesSimple', cf_options);
							

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
			
			var cf = node.window.addWidget('ChernoffFacesSimple', container, cf_options);
			
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
		node.window.loadFrame('html/instructions.html');
		// Auto Play
		node.env('auto', function(){
			node.emit('DONE');
		});
		console.log('Instructions');
	};
	
	var creation = function() {
		node.window.loadFrame('html/creation.html', function(){
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
		node.window.loadFrame('html/dissemination.html', function() {
			
			var dt_header = 'Round: ' + node.state.round;
//			if (node.game.gameState.state === 3) {	
//				dt_header = 'Test Round';
//			}
			
			this.all_ex.addDT(dt_header);
			
			var table = new node.window.Table({ className: 'exhibition',
												render: {
													pipeline: this.renderCF,
												 	returnAt: 'first',
												},
										
										 	   
			});
			
			table.setHeader(['A','B','C']);
			
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
				
			});
			
			node.onDATA('PLAYER_RESULT', function(msg){
				if (!msg.data) return;
				//var resultDiv = W.getDiv('resultDiv');
//				var table = new W.Table();
				var str = '';
				if (msg.data.published) {
//					table.addRow(['Congratulations!','']);
//					table.addRow(['You published in exhibition:', msg.data.ex]);
					str += 'Congratulations! You published in exhibition: <strong>' + msg.data.ex + '</strong>. ';
					node.emit('MONEYTALKS', node.game.money);
				}
				else {
//					table.addColumn(['Sorry.','']);
//					table.addColumn(['You were rejected by exhibition:', msg.data.ex]);
					str += 'Sorry, you got rejected by exhibition: <strong>' + msg.data.ex + '</strong>. ';
				}
				str += 'Your average review score was: <strong>' + msg.data.mean + '</strong>.</br></br>';
				W.getElementById('results').innerHTML = str;
				
//				table.addColumn(['Your average review score was:', msg.data.mean]);
//				table.select('y', '>=', 1).addClass('strong');
				
				//resultDiv.appendChild(table.parse());
//				W.getElementById('results').appendChild(table.parse());
			});
			
			
			// Auto play
			node.env('auto', function(){
				node.random.emit('DONE', 12000);
			});
			
		});
		

		
		
		console.log('Dissemination');
	};
	
	var questionnaire = function() {
		node.window.loadFrame('html/postgame.html');		
		console.log('Postgame');

		// AutoPlay
		//node.random.emit('DONE');
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
				console.log('executing eva done');
				for (var i in this.evas) {
					if (this.evas.hasOwnProperty(i)) {
						node.set('EVA', {'for': i,
										 eva: Number(this.evas[i].value)
						});
					}
				}
				this.evas = {};
				return true;
			}
		},
		
		3: {state: dissemination,
			name: 'Exhibition',
			timer: 15000,
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
			
//			3: {state: testloop,
//				name: 'TEST: Game',
//			},
				
			3: {rounds:	30, 
				state: 	gameloop,
				name: 	'Game',
			},
			
			4: {state:	questionnaire,
				name: 	'Questionnaire',
				timer: 	600000,
			},
				
			5: {state:	endgame,
				name: 	'Thank you',
			}
			
	};	
}
