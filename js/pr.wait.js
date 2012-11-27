function pr_wait () {
	
	this.name = 'Waiting Room - Client';
	this.description = 'Tests if the browser has the necessary requirement, and then it waits until the game starts....';
	this.version = '0.3';
	
	this.auto_step = true; 
	this.auto_wait = false;
	this.solo_mode = true;

	this.minPlayers = 2;
	this.maxPlayers = 10;
	
	this.init = function() {
		
	
	};

	
	
	
	var testing = function() {
		node.window.loadFrame('/PR4/html/room/testing.html', function(){
			//
		});
		node.log('Test page loaded');
	};
	
	
	var waiting = function() {
		console.log(node);
		node.window.loadFrame('/PR4/html/room/waiting.html', function() {
			// 
		});
		node.log('Waiting room loaded');
	};
	

	this.loop = {
		1: {state: testing,
			name: 'Test page',
		},
		
		2: {state: waiting,
			name: 'Waiting Room',
		},
	};	
}