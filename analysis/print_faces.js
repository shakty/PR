var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	NodeCanvas = require('canvas');

function Canvas() {

	
	this.canvas = new NodeCanvas(500,500),
	
	// 2D Canvas Context 
	this.ctx = this.canvas.getContext('2d');
	
	this.centerX = this.canvas.width / 2;
	this.centerY = this.canvas.height / 2;
	
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	
	////////////////////////////////////////
	// ADDED TO HAVE WHITE BACKGROUND
	//set background color
	this.ctx.fillStyle = '#FFF';
	//draw background / rect on entire canvas
	this.ctx.fillRect(0,0,this.width,this.height);
	///////////////////////////////////////
	
	
//	console.log(canvas.width);
//	console.log(canvas.height);		
}

Canvas.prototype = {
			
	constructor: Canvas,
	
	drawOval: function (settings) {
	
		// We keep the center fixed
		var x = settings.x / settings.scale_x;
		var y = settings.y / settings.scale_y;
	
		var radius = settings.radius || 100;
		//console.log(settings);
		//console.log('X,Y(' + x + ', ' + y + '); Radius: ' + radius + ', Scale: ' + settings.scale_x + ',' + settings.scale_y);
		
		this.ctx.lineWidth = settings.lineWidth || 1;
		this.ctx.strokeStyle = settings.color || '#000000';
		
		this.ctx.save();
		this.ctx.scale(settings.scale_x, settings.scale_y);
		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, Math.PI*2, false);
		this.ctx.stroke();
		this.ctx.closePath();
		this.ctx.restore();
	},
	
	drawLine: function (settings) {
	
		var from_x = settings.x;
		var from_y = settings.y;
	
		var length = settings.length;
		var angle = settings.angle;
			
		// Rotation
		var to_x = - Math.cos(angle) * length + settings.x;
		var to_y =  Math.sin(angle) * length + settings.y;
		//console.log('aa ' + to_x + ' ' + to_y);
		
		//console.log('From (' + from_x + ', ' + from_y + ') To (' + to_x + ', ' + to_y + ')');
		//console.log('Length: ' + length + ', Angle: ' + angle );
		
		this.ctx.lineWidth = settings.lineWidth || 1;
		this.ctx.strokeStyle = settings.color || '#000000';
		
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.moveTo(from_x,from_y);
		this.ctx.lineTo(to_x,to_y);
		this.ctx.stroke();
		this.ctx.closePath();
		this.ctx.restore();
	},
	
	scale: function (x,y) {
		this.ctx.scale(x,y);
		this.centerX = this.canvas.width / 2 / x;
		this.centerY = this.canvas.height / 2 / y;
	},
	
	clear: function() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		// For IE
		var w = this.canvas.width;
		this.canvas.width = 1;
		this.canvas.width = w;
	}
	
};


// FacePainter
// The class that actually draws the faces on the Canvas
function FacePainter (canvas, settings) {
		
	this.canvas = new Canvas(canvas);
	
	this.scaleX = this.canvas.width / 100;
	this.scaleY = this.canvas.height / 100;
};

//Draws a Chernoff face.
FacePainter.prototype.draw = function (face, x, y) {
	if (!face) return;
	this.face = face;
	// TODO: check the difference here with CF normal
	this.fit2Canvas(face);
	this.canvas.scale(face.scaleX, face.scaleY);
	
	//console.log('Face Scale ' + face.scaleY + ' ' + face.scaleX );
	
	var x = x || this.canvas.centerX;
	var y = y || this.canvas.centerY;
	
	this.drawHead(face, x, y);
	//console.log('Head Done');
	
	this.drawEyes(face, x, y);
	//console.log('Eyes Done');

	this.drawPupils(face, x, y);
	//console.log('Pupils Done');

	this.drawEyebrow(face, x, y);
	//console.log('Eyebrow Done');

	this.drawNose(face, x, y);
	//console.log('Nose Done');
	
	this.drawMouth(face, x, y);
	//console.log('Mouth Done');
	
};		
	
FacePainter.prototype.redraw = function (face, x, y) {
	this.canvas.clear();
	this.draw(face,x,y);
};

FacePainter.prototype.scale = function (x, y) {
	this.canvas.scale(this.scaleX, this.scaleY);
};

// TODO: Improve. It eats a bit of the margins
FacePainter.prototype.fit2Canvas = function(face) {
	if (!this.canvas) {
	console.log('No canvas found');
		return;
	}
	
	if (this.canvas.width > this.canvas.height) {
		var ratio = this.canvas.width / face.head_radius ;
	}
	else {
		var ratio = this.canvas.height / face.head_radius;
	}
	
	face.scaleX = ratio / 2.5;
	face.scaleY = ratio / 2.5;
};

FacePainter.prototype.drawHead = function (face, x, y) {
	
	var radius = face.head_radius;
	
	this.canvas.drawOval({
				   x: x, 
				   y: y,
				   radius: radius,
				   scale_x: face.head_scale_x,
				   scale_y: face.head_scale_y,
				   color: face.color,
				   lineWidth: face.lineWidth
	});
};

FacePainter.prototype.drawEyes = function (face, x, y) {
	
	var height = FacePainter.computeFaceOffset(face, face.eye_height, y);
	var spacing = face.eye_spacing;
		
	var radius = face.eye_radius;
	//console.log(face);
	this.canvas.drawOval({
					x: x - spacing,
					y: height,
					radius: radius,
					scale_x: face.eye_scale_x,
					scale_y: face.eye_scale_y,
					color: face.color,
					lineWidth: face.lineWidth
					
	});
	//console.log(face);
	this.canvas.drawOval({
					x: x + spacing,
					y: height,
					radius: radius,
					scale_x: face.eye_scale_x,
					scale_y: face.eye_scale_y,
					color: face.color,
					lineWidth: face.lineWidth
	});
};

FacePainter.prototype.drawPupils = function (face, x, y) {
		
	var radius = face.pupil_radius;
	var spacing = face.eye_spacing;
	var height = FacePainter.computeFaceOffset(face, face.eye_height, y);
	
	this.canvas.drawOval({
					x: x - spacing,
					y: height,
					radius: radius,
					scale_x: face.pupil_scale_x,
					scale_y: face.pupil_scale_y,
					color: face.color,
					lineWidth: face.lineWidth
	});
	
	this.canvas.drawOval({
					x: x + spacing,
					y: height,
					radius: radius,
					scale_x: face.pupil_scale_x,
					scale_y: face.pupil_scale_y,
					color: face.color,
					lineWidth: face.lineWidth
	});

};

FacePainter.prototype.drawEyebrow = function (face, x, y) {
	
	var height = FacePainter.computeEyebrowOffset(face,y);
	var spacing = face.eyebrow_spacing;
	var length = face.eyebrow_length;
	var angle = face.eyebrow_angle;
	
	this.canvas.drawLine({
					x: x - spacing,
					y: height,
					length: length,
					angle: angle,
					color: face.color,
					lineWidth: face.lineWidth
				
					
	});
	
	this.canvas.drawLine({
					x: x + spacing,
					y: height,
					length: 0-length,
					angle: -angle,	
					color: face.color,
					lineWidth: face.lineWidth
	});
	
};

FacePainter.prototype.drawNose = function (face, x, y) {
	
	var height = FacePainter.computeFaceOffset(face, face.nose_height, y);
	var nastril_r_x = x + face.nose_width / 2;
	var nastril_r_y = height + face.nose_length;
	var nastril_l_x = nastril_r_x - face.nose_width;
	var nastril_l_y = nastril_r_y; 
	
	this.canvas.ctx.lineWidth = face.lineWidth;
	this.canvas.ctx.strokeStyle = face.color;
	
	this.canvas.ctx.save();
	this.canvas.ctx.beginPath();
	this.canvas.ctx.moveTo(x,height);
	this.canvas.ctx.lineTo(nastril_r_x,nastril_r_y);
	this.canvas.ctx.lineTo(nastril_l_x,nastril_l_y);
	//this.canvas.ctx.closePath();
	this.canvas.ctx.stroke();
	this.canvas.ctx.restore();

};
		
FacePainter.prototype.drawMouth = function (face, x, y) {
	
	var height = FacePainter.computeFaceOffset(face, face.mouth_height, y);
	var startX = x - face.mouth_width / 2;
    var endX = x + face.mouth_width / 2;
	
	var top_y = height - face.mouth_top_y;
	var bottom_y = height + face.mouth_bottom_y;
	
	// Upper Lip
	this.canvas.ctx.moveTo(startX,height);
    this.canvas.ctx.quadraticCurveTo(x, top_y, endX, height);
    this.canvas.ctx.stroke();
	
    //Lower Lip
    this.canvas.ctx.moveTo(startX,height);
    this.canvas.ctx.quadraticCurveTo(x, bottom_y, endX, height);
    this.canvas.ctx.stroke();
   
};	


//TODO Scaling ?
FacePainter.computeFaceOffset = function (face, offset, y) {
	var y = y || 0;
	//var pos = y - face.head_radius * face.scaleY + face.head_radius * face.scaleY * 2 * offset;
	return y - face.head_radius + face.head_radius * 2 * offset;
};

FacePainter.computeEyebrowOffset = function (face, y) {
	y = y || 0;
	var eyemindistance = 2;
	return FacePainter.computeFaceOffset(face, face.eye_height, y) - eyemindistance - face.eyebrow_eyedistance;
};


/*!
* 
* A description of a Chernoff Face.
*
* This class packages the 11-dimensional vector of numbers from 0 through 1 that completely
* describe a Chernoff face.  
*
*/


FaceVector.defaults = {
		// Head
		head_radius: {
			// id can be specified otherwise is taken head_radius
			min: 10,
			max: 100,
			step: 0.01,
			value: 30,
			label: 'Face radius'
		},
		head_scale_x: {
			min: 0.2,
			max: 2,
			step: 0.01,
			value: 0.5,
			label: 'Scale head horizontally'
		},
		head_scale_y: {
			min: 0.2,
			max: 2,
			step: 0.01,
			value: 1,
			label: 'Scale head vertically'
		},
		// Eye
		eye_height: {
			min: 0.1,
			max: 0.9,
			step: 0.01,
			value: 0.4,
			label: 'Eye height'
		},
		eye_radius: {
			min: 2,
			max: 30,
			step: 0.01,
			value: 5,
			label: 'Eye radius'
		},
		eye_spacing: {
			min: 0,
			max: 50,
			step: 0.01,
			value: 10,
			label: 'Eye spacing'
		},
		eye_scale_x: {
			min: 0.2,
			max: 2,
			step: 0.01,
			value: 1,
			label: 'Scale eyes horizontally'
		},
		eye_scale_y: {
			min: 0.2,
			max: 2,
			step: 0.01,
			value: 1,
			label: 'Scale eyes vertically'
		},
		// Pupil
		pupil_radius: {
			min: 1,
			max: 9,
			step: 0.01,
			value: 1,  //this.eye_radius;
			label: 'Pupil radius'
		},
		pupil_scale_x: {
			min: 0.2,
			max: 2,
			step: 0.01,
			value: 1,
			label: 'Scale pupils horizontally'
		},
		pupil_scale_y: {
			min: 0.2,
			max: 2,
			step: 0.01,
			value: 1,
			label: 'Scale pupils vertically'
		},
		// Eyebrow
		eyebrow_length: {
			min: 1,
			max: 30,
			step: 0.01,
			value: 10,
			label: 'Eyebrow length'
		},
		eyebrow_eyedistance: {
			min: 0.3,
			max: 10,
			step: 0.01,
			value: 3, // From the top of the eye
			label: 'Eyebrow from eye'
		},
		eyebrow_angle: {
			min: -2,
			max: 2,
			step: 0.01,
			value: -0.5,
			label: 'Eyebrow angle'
		},
		eyebrow_spacing: {
			min: 0,
			max: 20,
			step: 0.01,
			value: 5,
			label: 'Eyebrow spacing'
		},
		// Nose
		nose_height: {
			min: 0.4,
			max: 1,
			step: 0.01,
			value: 0.4,
			label: 'Nose height'
		},
		nose_length: {
			min: 0.2,
			max: 30,
			step: 0.01,
			value: 15,
			label: 'Nose length'
		},
		nose_width: {
			min: 0,
			max: 30,
			step: 0.01,
			value: 10,
			label: 'Nose width'
		},
		// Mouth
		mouth_height: {
			min: 0.2,
			max: 2,
			step: 0.01,
			value: 0.75, 
			label: 'Mouth height'
		},
		mouth_width: {
			min: 2,
			max: 100,
			step: 0.01,
			value: 20,
			label: 'Mouth width'
		},
		mouth_top_y: {
			min: -10,
			max: 30,
			step: 0.01,
			value: -2,
			label: 'Upper lip'
		},
		mouth_bottom_y: {
			min: -10,
			max: 30,
			step: 0.01,
			value: 20,
			label: 'Lower lip'
		}					
};

//Constructs a random face vector.
FaceVector.random = function () {
  var out = {};
  for (var key in FaceVector.defaults) {
    if (FaceVector.defaults.hasOwnProperty(key)) {
      if (!JSUS.in_array(key,['color','lineWidth','scaleX','scaleY'])) {
        out[key] = FaceVector.defaults[key].min + Math.random() * FaceVector.defaults[key].max;
      }
    }
  }
  
  out.scaleX = 1;
  out.scaleY = 1;
  
  out.color = 'green';
  out.lineWidth = 1; 
  
  return new FaceVector(out);
};

function FaceVector (faceVector) {
	  var faceVector = faceVector || {};

	this.scaleX = faceVector.scaleX || 1;
	this.scaleY = faceVector.scaleY || 1;


	this.color = faceVector.color || 'green';
	this.lineWidth = faceVector.lineWidth || 1;
	  
	  // Merge on key
	 for (var key in FaceVector.defaults) {
	   if (FaceVector.defaults.hasOwnProperty(key)){
	     if (faceVector.hasOwnProperty(key)){
	       this[key] = faceVector[key];
	     }
	     else {
	       this[key] = FaceVector.defaults[key].value;
	     }
	   }
	 }
	  
	};

//Constructs a random face vector.
FaceVector.prototype.shuffle = function () {
	for (var key in this) {
		if (this.hasOwnProperty(key)) {
			if (FaceVector.defaults.hasOwnProperty(key)) {
				if (key !== 'color') {
					this[key] = FaceVector.defaults[key].min + Math.random() * FaceVector.defaults[key].max;
					
				}
			}
		}
	}
};

//Computes the Euclidean distance between two FaceVectors.
FaceVector.prototype.distance = function (face) {
	return FaceVector.distance(this,face);
};
	
	
FaceVector.distance = function (face1, face2) {
	var sum = 0.0;
	var diff;
	
	for (var key in face1) {
		if (face1.hasOwnProperty(key)) {
			diff = face1[key] - face2[key];
			sum = sum + diff * diff;
		}
	}
	
	return Math.sqrt(sum);
};

FaceVector.prototype.toString = function() {
	var out = 'Face: ';
	for (var key in this) {
		if (this.hasOwnProperty(key)) {
			out += key + ' ' + this[key];
		}
	};
	return out;
};


// BEGIN
////////////




var db = new NDDB();

db.h('player', function(gb) {
	return gb.player;
});
//db.h('state', function(gb) {
//	return GameState.toHash(gb.state, 'S.s.r');
//});
db.h('key', function(gb) {
	return gb.key;
});

db.load('./all_cf.nddb');

db.rebuildIndexes();

(function printFace(e) {
	if (!e) return;
	var fp = new FacePainter();
	//console.log(e);
	var filename = e.player + '_' + e.state.round + '.png';
	var face = e.value;
	var out = fs.createWriteStream(__dirname + '/faces/' + filename);
	var stream = fp.canvas.canvas.createPNGStream();

	stream.on('data', function(chunk){
		out.write(chunk);
//		console.log(chunk);
	});

	stream.on('end', function(){
		console.log('saved ' + filename);
		//setTimeout(function(){
			printFace(db.key.CF.next());
		//},200);
		
	});
	
	
	fp.draw(face);
})(db.key.CF.first());	






