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
	
	this.shuffle = true;
}

Group.prototype.init = function (elements, pool) {
	this.elements = (this.shuffle) ? J.shuffle(elements)
								   : elements;
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

// If there is a hole, not in the last position, the algorithm fails
Group.prototype.switchIt = function () {
	
	for (var i = 0; i < this.elements.length ; i++) {
		if (this.match[i].length < this.rowLimit) {
			this.completeRow(i);
		}
	}
	
};

Group.prototype.completeRow = function (row) {
	var clone = this.leftOver.slice(0);
	for (var i = 0 ; i < clone.length; i++) {
		for (var j = 0 ; j < this.elements.length; j++) {
			if (this.switchItInRow(clone[i], j, row)){
				this.leftOver.splice(i,1);
				return true;
			}
			this.updatePointer();
		}
	}
	return false;
}


Group.prototype.switchItInRow = function (x, toRow, fromRow) {
	if (!this.canSwitchIn(x, toRow)) {
		//console.log('cannot switch ' + x + ' ' + toRow)
		return false;
	}
	//console.log('can switch: ' + x + ' ' + toRow + ' from ' + fromRow)
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
						
			// Try all positions
			if (!this.addIt(this.pool[i][j])) {
				// if we could not add it as a match, it becomes leftover
				this.leftOver.push(this.pool[i][j]);
			}
		}
	}
	
	if (this.shouldSwitch()) {
		console.log('should switch')
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
var elements = [ 2, 7, 4, 1 ]; // [7, 1, 2, 4];

var g = new Group();
g.init(elements, pool);
g.matchIt();

console.log(g.elements);
console.log(g.match);


