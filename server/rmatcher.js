module.exports = RMatcher;

var J = require('nodegame-client').JSUS;

function RMatcher (options) {
	
	this.groups = [];
	
	this.maxIteration = 10;

	this.perfectMatch = false;
	
	this.doneCounter = 0;
}

RMatcher.prototype.addGroup = function (group) {
	if (!group) return;
	this.groups.push(group);
};

RMatcher.prototype.match = function() {
	// Do first match
	for (var i = 0; i < this.groups.length ; i++) {
		this.groups[i].match();
		if (this.groups[i].matches.done) {
			this.doneCounter++;
		}
	}	
	
	if (!this.allGroupsDone()) {
		this.assignLeftOvers();
	}
	
	if (!this.allGroupsDone()) {
		this.switchBetweenGroups();
	}
	
	for (var i = 0; i < this.groups.length ; i++) {
		this.groups[i].summary();
	}
};

RMatcher.prototype.allGroupsDone = function() {
	return this.doneCounter === this.groups.length;
};

RMatcher.prototype.tryOtherLeftOvers = function (g) {
	var group;
	for (var i = (g + 1) ; i < (this.groups.length + g) ; i++) {
		group = this.groups[i % this.groups.length];
		leftOver = [];
		if (group.leftOver.length) {
			group.leftOver = this.groups[g].matchBatch(group.leftOver);
			
			if (this.groups[g].matches.done) {
				this.doneCounter++;
			}
		}
		
	}
};

RMatcher.prototype.assignLeftOvers = function() {
	var g;
	for ( var i = 0; i < this.groups.length ; i++) {
		g = this.groups[i]; 
		// Group is full
		if (!g.matches.done) {
			this.tryOtherLeftOvers(i);
		}
		
	} 
};

RMatcher.prototype.switchBetweenGroups = function() {
	var g;
	for ( var i = 0; i < this.groups.length ; i++) {
		g = this.groups[i]; 
		// Group is full
		if (!g.matches.done) {
			this.tryOtherLeftOvers(i);
		}
		
	} 
};

function Group() {
	
	this.elements = [];
	this.matched = [];

	this.leftOver = [];
	this.pointer = 0;
	
	this.matches = {};
	this.matches.total = 0;
	this.matches.requested = 0;
	this.matches.done = false;
	
	this.rowLimit = 3;
	
	this.noSelf = true;
	
	this.pool = [];
	
	this.shuffle = true;
	this.stretch = true;
}

Group.prototype.init = function (elements, pool) {
	this.elements = elements;
	this.pool = J.clone(pool);

	for (var i = 0; i < this.pool.length; i++) {
		if (this.stretch) {
			this.pool[i] = J.stretch(this.pool[i], this.rowLimit);
		}
		if (this.shuffle) {
			this.pool[i] = J.shuffle(this.pool[i]);
		}
	}

	
	for (i = 0 ; i < elements.length ; i++) {
		this.matched[i] = [];
	}
	
	this.matches.requested = this.elements.length * this.rowLimit;
};


/**
 * The same as canAdd, but does not consider row limit
 */
Group.prototype.canSwitchIn = function (x, row) {
	// Element already matched 
	if (J.in_array(x, this.matched[row])) return false;
	// No self
	if (this.noSelf && this.elements[row] === x) return false;
	
	return true;
};


Group.prototype.canAdd = function (x, row) {
	// Row limit reached
	if (this.matched[row].length >= this.rowLimit) return false;
	
	return this.canSwitchIn(x, row);
};

Group.prototype.shouldSwitch = function (x, fromRow) {
	if (!this.leftOver.length) return false;
	if (this.matched.length < 2) return false;
//	var actualLeftOver = this.leftOver.length;
	return true;
	
};

// If there is a hole, not in the last position, the algorithm fails
Group.prototype.switchIt = function () {
	
	for (var i = 0; i < this.elements.length ; i++) {
		if (this.matched[i].length < this.rowLimit) {
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
};


Group.prototype.switchItInRow = function (x, toRow, fromRow) {
	if (!this.canSwitchIn(x, toRow)) {
		//console.log('cannot switch ' + x + ' ' + toRow)
		return false;
	}
	//console.log('can switch: ' + x + ' ' + toRow + ' from ' + fromRow)
	// Check if we can insert any of the element of the 'toRow'
	// inside the 'toRow'
	for (var i = 0 ; i < this.matched[toRow].length; i++) {
		var switched = this.matched[toRow][i];
		if (this.canAdd(switched, fromRow)) {
			this.matched[toRow][i] = x;
			this.addToRow(switched, fromRow);
			return true;
		}
	}
	
	return false;
};

Group.prototype.addToRow = function(x, row) {
	this.matched[row].push(x);
	this.matches.total++;
	if (this.matches.total === this.matches.requested) {
		this.matches.done = true;
	}
};

Group.prototype.addIt = function(x) {
	var counter = 0, added = false;
	while (counter < this.elements.length && !added) {
		if (this.canAdd(x, this.pointer)) {
			this.addToRow(x, this.pointer);
			added = true;
		}
		this.updatePointer();
		counter++;
	}
	return added;
};


Group.prototype.matchBatch = function (pool) {
	var leftOver = [];
	for (var i = 0 ; i < pool.length ; i++) {
		if (this.matches.done || !this.addIt(pool[i])) {
			// if we could not add it as a match, it becomes leftover
			leftOver.push(pool[i]);
		}
	}
	return leftOver;
};

Group.prototype.match = function (pool) {
	pool = pool || this.pool;
	// Loop through the pools: elements in lower  
	// indexes-pools have more chances to be used
	var leftOver;
	for (var i = 0 ; i < pool.length ; i++) {
		leftOver = this.matchBatch(pool[i]);
		if (leftOver.length) {
			this.leftOver = this.leftOver.concat(leftOver);
		}
	}
	
	if (this.shouldSwitch()) {
		this.switchIt();
	}
	
	if (this.leftOver.length) {
		console.log('Something did not work well..');
	}
};

Group.prototype.updatePointer = function () {
	this.pointer = (this.pointer + 1) % this.elements.length;
};

Group.prototype.summary = function() {
	console.log('elements: ', this.elements);
	console.log('pool: ', this.pool);
	console.log('left over: ', this.leftOver);
	console.log('hits: ' + this.matches.total + '/' + this.matches.requested);
	console.log('matched: ', this.matched);
};

var poolA = [ [1, 2], [3, 4], ];
var elementsA = [7, 1, 2, 4];

var poolB = [ [5], [6], ];
var elementsB = [3 , 8];

var poolC = [ [7, 8, 9] ];
var elementsC = [9, 5, 6, ];

var A, B, C;

A = new Group();
A.init(elementsA, poolA);

B = new Group();
B.init(elementsB, poolB);

C = new Group();
C.init(elementsC, poolC);

var rm = new RMatcher();

rm.addGroup(A);
rm.addGroup(B);
rm.addGroup(C);


rm.match();

//console.log(g.elements);
//console.log(g.matched);


