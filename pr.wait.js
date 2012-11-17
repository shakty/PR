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
		
		//node.window.setup('PLAYER');
		
		node.onDATA('FULL', function(msg){
			console.log('I have excluded');
			console.log(msg);
			W.getElementById('h2title').innerHTML = 'I am sorry but the game has already started, and for the moment you cannot join it. Please try again later.'
		});
	};

	var testing = function() {
		node.window.loadFrame('html/room/testing.html', function(){
			
			var wh = $(window).height();   // returns height of browser viewport
		    var dh = $(document).height(); // returns height of HTML document
		    var ww = $(window).width();   // returns width of browser viewport
		    var dw = $(document).width(); // returns width of HTML document
		    
		    console.log(wh, ww, dh, dw);
		    
		    if (wh > 500 && ww > 500) {
		    	node.DONE();
		    } 
		    else {
		    	node.window.loadFrame('html/room/sorry.html');
		    }
		});
		node.log('Test page loaded');
		
	};
	
	
	var waiting = function() {
		console.log(node);
		node.window.loadFrame('html/room/waiting.html');
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