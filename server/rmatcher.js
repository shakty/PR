module.exports = RMatcher;

var J = require('nodegame-client').JSUS;

function RMatcher (options) {
	
	this.groups = [];
	
	
}


function Group() {
	
	this.elements = [];
	this.match = [];

	this.leftOver = [];
	this.pointer = 0;
	
	this.rowLimit = 3;
	
	this.noSelf = true;
	
	this.pool = [];
	
//	this.holes = [];
}

Group.prototype.init = function (elements, pool) {
	this.elements = elements;
	this.pool = pool;
	
	for (var i = 0 ; i < elements.length ; i++) {
		this.match[i] = [];
	}
};

/**
 * The same as canAdd, but does not consider row limit
 */
Group.prototype.canSwitchIn = function (x, row) {
	// Element already matched 
	if (J.in_array(x, this.match[row])) return false;
	// No self
	if (this.noSelf && this.elements[row] === x) return false;
	
	return true;
};


Group.prototype.canAdd = function (x, row) {
	// Row limit reached
	if (this.match[row].length >= this.rowLimit) return false;
	
	return this.canSwitchIn(x, row);
};

Group.prototype.shouldSwitch = function (x, fromRow) {
	if (!this.leftOver.length) return false;
	if (this.match.length < 2) return false;
//	var actualLeftOver = this.leftOver.length;
	return true;
	
};

Group.prototype.switchIt = function () {
	var clone = this.leftOver.slice(0);
	for (var i = 0 ; i < clone.length; i++) {
		for (var j = 0 ; j < this.elements.length; j++) {
			if (this.switchItInRow(clone[i], j, this.pointer)){
				this.leftOver.splice(i,1);
				continue;
			}
		}
	}
	return false;
};


Group.prototype.switchItInRow = function (x, toRow, fromRow) {
	if (!this.canSwitchIn(x, toRow)) return false;
	
	// Check if we can insert any of the element of the 'toRow'
	// inside the 'toRow'
	for (var i = 0 ; i < this.match[toRow].length; i++) {
		var switched = this.match[toRow][i];
		if (this.canAdd(switched, fromRow)) {
			this.match[toRow][i] = x;
			this.match[fromRow].push(switched);
			return true;
		}
	}
	
	return false;
};


Group.prototype.addIt = function(x) {
	var counter = 0, added = false;
	while (counter < this.elements.length && !added) {
		if (this.canAdd(x, this.pointer)) {
			this.match[this.pointer].push(x);
			added = true;
		}
		this.updatePointer();
		counter++;
	}
	return added;
}


Group.prototype.matchIt = function() {
	// Loop through the pools: elements in lower  
	// indexes-pools have more chances to be used
	for (var i = 0 ; i < this.pool.length ; i++) {
		for (var j = 0 ; j < this.pool[i].length ; j++) {
			
			// found: There was an hole and it was filled;
//			var found = false;
//			// Check if have left some holes on the way
//			// If so, can we insert the current element there?
//			if (this.holes.length) {
//				for (var h = 0; h < this.holes.length; h++) {
//					if (this.canAdd(this.pool[i][j], this.holes[h])) {
//						this.match[this.holes[h]].push(this.pool[i][j]);
//						this.updatePointer();
//						// remove the index from array of holes
//						this.holes.splice(h, 1);
//						break;
//					}
//				}
//				
//				if (found) {
//					// if we filled the hole, we go to next loop iteration
//					continue;
//				}
//			}
			
			// No holes, we continue normally
			
			// Try all positions
			if (!this.addIt(this.pool[i][j])) {
				// if we could not add it as a match, it becomes leftover
				this.leftOver.push(this.pool[i][j]);
			}
			
		}
	}
	
	if (this.shouldSwitch()) {
		//console.log('should switch')
		this.switchIt();
	}
	
	if (this.leftOver.length) {
		console.log('Something did not work well..');
	}
};

Group.prototype.updatePointer = function () {
	this.pointer = (this.pointer + 1) % this.elements.length;
}


var pool = [ [1, 1, 1, 2, 2, 2], [3, 3, 3, 4, 4, 4], ];
var elements = [7, 1, 2, 4];

var g = new Group();
g.init(elements, pool);
g.matchIt();

console.log(g.match);


