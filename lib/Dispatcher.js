(function (node) {
	
	node.widgets.register('Dispatcher', Dispatcher);
	
// ## Defaults
	Dispatcher.defaults = {
			
			fieldset: {  legend: 'Dispatcher' },
			
			selectModes: {
				'RANDOM': 'RANDOM',
				'FIFO': 'FIFO',
				'LIFO': 'LIFO'
			}
	};
	
	Dispatcher.id = 'dispatcher';
	
	  
// ## Dependencies
	Dispatcher.dependencies = {
		JSUS: {},
		Table: {},
		W: {}
	};
	
	
// ## Meta-data
	Dispatcher.name = 'Data Bar';
	Dispatcher.version = '0.3';
	Dispatcher.description = 'Adds a input field to send DATA messages to the players';
		
	function Dispatcher(options) {
		
		
		this.uri = W.getTextInput('uri');
		this.queryString;
		
		this.autoVsManual;
		
		this.pSelectMode = W.getSelect('dispatcher_selection');
		W.populateSelect(this.pSelectMode, Dispatcher.defaults.selectModes);
		
		this.minPlayers = W.getTextInput('dispatcher_minplayers');
		this.maxPlayers = W.getTextInput('dispatcher_maxplayers');
		
		this.queryTA = W.getTextArea('query', {disabled: "disabled" });
		
		this.dispatchButton = null;
		this.previewButton = null;
		
		
		this.previewUri = W.getTextInput('preview_uri');
		
		this.statusBar = W.getDiv('dispatcher_status');
		
		this.root = null;
		
		this.createQueryString = options.createQueryString || function(){}; 
		
		this.queryTA.value = this.createQueryString.toString()
	}
	
	
	Dispatcher.prototype.append = function (root) {
		var that = this;
		
		
		root.appendChild(this.createURITable());
		W.addBreak(root);
		root.appendChild(this.createConditions());
		//root.appendChild(this.createAutoVsManual());
		this.dispatchButton = W.addEventButton('DISPATCH', 'Dispatch', root, 'dispatch');
		this.dispatchButton.onclick = function(){
			that.dispatch();
		};
		
		this.previewButton = W.addButton(root, 'dispatch_preview', 'Preview');
		this.previewButton.onclick = function(){
			that.preview();
		};
		
		root.appendChild(this.statusBar);
		
		return root;
		
	};
		
	Dispatcher.prototype.createURITable = function() {
		var root = new W.Table({id: 'pt_uritable'});
		root.addRow(['Uri', this.uri]);
		root.addRow(['Query', this.queryTA]);
		root.addRow(['Preview', this.previewUri]);
		return root.parse();
	};

	
	Dispatcher.prototype.createConditions = function() {
		var root = new W.Table({id: 'dispatcher_conditions'});
		root.addRow(['MinPlayers', this.minPlayers]);
		root.addRow(['MaxPlayers', this.maxPlayers]);
		root.addRow(['Selection', this.pSelectMode]);
		return root.parse();
	};
	
	Dispatcher.prototype.dispatch = function() {
		var that = this;
		var pl = this.dispatchables(),
			uriBase = this.getUri(),
			uriQuery = null, uri = null;
		
		if (!uriBase) {
			this.status('uri is empty!');
			return false;
		}
		
		if (pl) {
			pl.each(function(p) {
				uri = that.composeURI(uriBase, p); 
				console.log(p.sid)
				node.redirect(uri, p.sid);
			});
		}
		
	};
	
	Dispatcher.prototype.preview = function() {
		var pl = this.dispatchables(),
			uriBase = this.getUri();
		
		if (pl) {
			console.log(uriBase);
			console.log(pl.getRandom());
			this.previewUri.value = this.composeURI(uriBase, pl.getRandom());
		} 
			
	};
	
	
	Dispatcher.prototype.composeURI = function(uriBase, p) {
		var uriQuery = this.createQueryString(p);
		return uriQuery ? uriBase + '?' + uriQuery : uriBase;
	};
	
	Dispatcher.prototype.getPlayerCount = function() {
		if (!node.game || !node.game.pl) return -1;
		return node.game.pl.count();
	};
	
	Dispatcher.prototype.getUri = function() {
		return this.uri.value;
	};
	
	Dispatcher.prototype.getMinPlayers = function() {
		var v = this.minPlayers.value;
		return v || 0;
	};
	
	Dispatcher.prototype.getMaxPlayers = function() {
		var v = this.maxPlayers.value;
		return v || 10000;
	};
	
	Dispatcher.prototype.getPSelectMode = function() {
		return this.pSelectMode.value;
	};
	
	Dispatcher.prototype.status = function(txt) {
		this.statusBar.innerHTML = txt;
	};
	
	Dispatcher.prototype.dispatchables = function() {
		// get players
		var psmode = this.getPSelectMode(), 
			npl = this.getPlayerCount();
		
		if (npl <= 0) {
			this.status('no player connected!');
			return false;
		}
		
		if (npl < this.getMinPlayers()) {
			this.status('not enough players!');
			return false;
		}
		
		if (npl > this.getMaxPlayers()) {
			
			switch(psmode) {
			
			case Dispatcher.defaults.selectModes.RANDOM:
				node.game.pl.shuffle();
				break;
				
			case Dispatcher.defaults.selectModes.FIFO:
				node.game.pl.sort('count');
				break;
			
			case Dispatcher.defaults.selectModes.LIFO:
				node.game.pl.sort('count');
				node.game.pl.reverse();
				break;
			default:
				this.status('Unrecognize option ' + psmode);
				return false;
			};
			
			var o = node.game.pl.limit(this.getMaxPlayers());
			console.log(o.length);
			return o;
		}
		
		return node.game.pl;
	};
	
	
//	function PlayerTable(options) {
//		this.id = options.id || 'playertable';
//		
//		this.pl = options.pl || node.game.pl;
//		
////		this.pl.index('pid', function(p){
////			return p.id;
////		});
//		
////		node.on('', function(p){
////			var p = p[0];
////			W.getElementById(p.id).remove();
////		});
//		
////		this.table.on('insert', function())
//		
//		this.parsePlayer = function(p) {
//			return p.id;
//		};
//		
//		this.root = options.root;
//		
//	};
//		
//	PlayerTable.prototype.createRow = function(line) {
//		var options = {
//				
//		};
//		W.sprintf(line, this.root);
//	};
//	
//	PlayerTable.prototype.destroyRow = function(p) {
//		dv.parentNode.removeChild(dv);
//	};
//	
//	PlayerTable.prototype.listeners = function() {
//		var that = this;
//		
//		node.on('in.say.PCONNECT', function(msg) {
//			var line = that.parsePlayer(msg.data);
//			that.createRow(line);
//		});
//		
//		node.on('in.say.PDISCONNECT', function(msg) {
//			var 
//			that.destroyRow(msg.data);
//		});
//		
//	};
	
//	Dispatcher.prototype.listeners = function() {
//		var that = this;
////		node.on('UPDATED_PLIST', function() {
////			node.window.populateRecipientSelector(that.recipient, node.game.pl);
////		});
//	};
//	
//	Dispatcher.prototype.createManualSelectTable = function() {
//		this.manualSelect = new Table();
//	};
//	
//	Dispatcher.prototype.createAutoVsManual = function() {
//		var root = W.getElement('span', 'autoVsManual');
//		W.write('Auto', root);
//		W.addRadioButton(root, 'auto', { name: 'autoVsmanual', value: 'auto' } );
//		W.write(' Manual', root);
//		W.addRadioButton(root, 'manual', { name: 'autoVsmanual', value: 'manual' } );
//		return root;
//	};
//	
//	Dispatcher.prototype.createAutoDispatch = function() {
//		var root = new W.Table({id: 'auto'});
//		root.addRow(['Enabled', W.getCheckBox('uri')]);
////		W.write('Enabled', root);
////		W.addRadioButton(root, 'auto', { name: 'autoVsmanual', value: 'auto' } );
////		W.write(' Manual', root);
////		W.addRadioButton(root, 'manual', { name: 'autoVsmanual', value: 'manual' } );
//		return root.parse();
//	};
//	
	
})(node);	