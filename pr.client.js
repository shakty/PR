function PeerReviewGame () {
	
	this.name = 'Peer Review Game';
	this.description = 'Create, submit, and evaluate contributions from your peers.';
	this.version = '0.3';
	
	this.auto_step = false;
	this.auto_wait = true;
	
	this.minPlayers = 2;
	this.maxPlayers = 8;
	
	this.init = function() {			
		node.window.setup('PLAYER');
		//node.window.addWidget('WaitScreen');
		
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
		
		// DTABLE
//		this.dtable = node.window.addWidget('DynamicTable', document.body, {name: 'Summary',
//																			replace: true});
//		this.dtable.setLeft(['Mean', 'N. of shows', 'Money Won']);
//					
//		var bindings = {
//				x: function (msg) {
//				if (msg.text === 'WIN_CF') {
//					var out = [];
//					for (var i=0; i< msg.data.length; i++) {
//						var author = msg.data[i].author;
//						var x = node.game.pl.select('name', '=', author).first().count;
//						if ('undefined' !== typeof x) {
//							out.push(x);
//						}
//					}
//				}
//				return out;
//			},
//				
//			y: function (msg) {
//				if (msg.text === 'WIN_CF') {
//					return [1,2,3];
//				}
//			},
//
//			cell: function (msg, cell) {
//				if (msg.text === 'WIN_CF') {
//					if (cell.y === 1) {
//						console.log(cell);
//						console.log('header');
//						console.log(this.header);
//						console.log('cell.x');
//						console.log(cell.x);
//						var idx = this.header[cell.x].content;
//						if (!cell.history) cell.history = [];
//						for (var i=0; i< msg.data.length; i++) {
//							if (msg.data[i].author === idx) {
//								cell.history.push(msg.data[i].mean);
//							}
//						}
//						var mean = 0;
//						for (var i=0; i < cell.history.length; i++) {
//							mean += new Number(cell.history[i]); 
//						}
//						cell.content = (mean / cell.history.length).toFixed(2);
//						
//						
//					}
//					else if (cell.y === 2) {
//						if (!cell.content) {
//							cell.content = 1;
//						}
//						else {
//							cell.content += 1;
//						}
//					
//					}
//					else {
//						if (!cell.content) {
//							cell.content = 1;
//						}
//						else {
//							cell.content += 1;
//						}
//					}
//					return cell;	
//				}
//			}
//		};
//		
//		
//		this.dtable.bind('in.say.DATA', bindings);
//		
//		this.dtable.bind('in.say.PLIST', {
//									header: function (msg) {
//										if (msg.data.length === 0) return;
//										var plist = new node.PlayerList({}, msg.data);
//										var out = plist.map(function(player){
//											return player.name;
//										});
//										return out;
//									}
//		});
		// End TABLE
		
		this.renderCF = function (cell) {
			
			var w = 250;
			var h = 250;
			
			if (node.game.gameLoop.getName() == 'Creation') {	
				w = 100;
				h = 100;
			}
			
			// Check if it is really CF obj
			if (cell.content.cf) {
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
				    	          
				    	          div.dialog({
				    	            width: 460,
				    	            height: 560,
				    	            show: "blind",
				    	            hide: "explode",
				    	            buttons: {
				    	              "Copy": function() {				    	        	  	
				    	            	node.emit('COPIED', f);
				    	                $( this ).dialog( "close" );
				    	              },
				    	              Cancel: function() {
				    	                $( this ).dialog( "close" );
				    	              }
				    	          }
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
			}
		};
		
	};
	
	
	
	var pregame = function() {
		var frame = node.window.loadFrame('html/pregame.html');
		node.emit('DONE');
		console.log('Pregame');
	};
	
	var instructions = function() {
		node.window.loadFrame('html/instructions.html');
		//node.emit('DONE');
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
			
			var dt_header = 'Round: ' + node.game.gameState.round;
//			if (node.game.gameState.state === 3) {	
//				dt_header = 'Test Round';
//			}
			
			this.all_ex.addDT(dt_header);
			
			var table = new node.window.Table({className: 'exhibition',
										 	   render: this.renderCF,
			});
			
			table.setHeader(['A','B','C']);
			
			node.onDATA('WIN_CF', function(msg) {
				
				if (msg.data.length > 0) {
					var db = new node.NDDB(null,msg.data);
					
					for (var j=0; j < this.exs.length; j++) {
						var winners = db.select('ex','=',this.exs[j])
										.sort('mean')
										.reverse()
										.fetch();
					
						if (winners.length > 0) {
							table.addColumn(winners);
						}
						else {
							table.addColumn([' - ']);
						}
					}

					node.window.getElementById('container_exhibition').appendChild(table.parse());
					this.all_ex.addDD(table);

				}
				
				else {
					var str = 'No painting was considered good enough to be put on display';
					node.window.write(str);
					this.all_ex.addDD(str);
				}
				
			});
			node.random.emit('DONE');
		});
		
		
		
		console.log('Dissemination');
	};
	
	var questionnaire = function() {
		node.window.loadFrame('html/postgame.html');
		node.random.emit('DONE');
		console.log('Postgame');
	};
	
	var endgame = function() {
		node.window.loadFrame('html/ended.html');
		console.log('Game ended');
	};
	
	
// Assigning Functions to Loops
	
	var gameloop = { // The different, subsequent phases in each round
		
		1: {name: 'Creation',
			state: creation,
			timer: 100000,
			done: function (ex) {
				//console.log('executing crea done');
		
				if (!JSUS.in_array(ex, ['A','B','C'])) {
					alert('You must select an outlet for your creation NOW!!');
					if (this.timer.timeLeft <= 0) { 
						this.timer.restart({timer: 5000});
					};
					return false;
				}
				else {
					// Close any open dialog box
					$( ".copyorclose" ).dialog('close');
					this.last_cf = this.cf.getAllValues();
					node.set('SUB', ex);
					node.set('CF', this.last_cf);
					return true;
				}
			}
				
		
		},
		
		2: {name: 'Evaluation',
			state: evaluation,
			timer: 200000,
			done: function () {
				console.log('executing eva done');
				for (var i in this.evas) {
					if (this.evas.hasOwnProperty(i)) {
						node.set('EVA', {'for': i,
										 eva: this.evas[i].value
						});
					}
				}
				this.evas = {};
				return true;
			}
		},
		
		3: {state: dissemination,
			name: 'Exhibition',
			timer: 100000,
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
				timer: 	60000,
			},
			
//			3: {state: testloop,
//				name: 'TEST: Game',
//			},
				
			3: {rounds:	10, 
				state: 	gameloop,
				name: 	'Game',
			},
			
			4: {state:	questionnaire,
				name: 	'Questionnaire',
				timer: 	1200,
			},
				
			5: {state:	endgame,
				name: 	'Thank you',
			}
			
	};	
}