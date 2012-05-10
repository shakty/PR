(function (exports, JSUS) {

	var node = parent.node;
	
//	var features = [
//	                {name: 'head_radius',
//	                 min: 10,
//	                 max: 100,
//	                 step: 0.01,
//	                },
//	                {name: 'head_scale_x',
//	                 min: 0.2,
//	                 max: 2,
//	                 step: 0.01,
//	                },
//	                ];
//	
//	
//	function generateAllCombinations(features) {
//		var totCombs = 0;
//		var limits = [];
//		
//		for (var i=0; i<features.length; i++) {
//			var f = features[i];
//			var diff = Math.abs(f.max - f.min);
//			var combs = diff / f.step;
//			totCombs += combs;
//			limits.push({name: f.name, limit: totCombs});
//		}
//		
//		return limits;
//	};
//	
//	function translate(x, features, limits) {
//
//	};
	/*!
	* 
	* A description of a Chernoff Face.
	*
	* This class packages the 11-dimensional vector of numbers from 0 through 1 that completely
	* describe a Chernoff face.  
	*
	*/

	jQuerySlider = exports.Controls.jQuerySlider;
	
	
	exports.CFControls = CFControls;
	
	CFControls.prototype.__proto__ = jQuerySlider.prototype;
	CFControls.prototype.constructor = CFControls;
	
	
	Slider = exports.Controls.Slider;
	
	
	exports.CFControls = CFControls;
	
	CFControls.prototype.__proto__ = Slider.prototype;
	CFControls.prototype.constructor = CFControls;
	
	
	CFControls.id = 'CFControls';
	CFControls.name = 'CF Controls';
	CFControls.version = '0.2';
	
	CFControls.dependencies = {
		Controls: {}
	};
	
	CFControls.defaults = {
			// Head
//			head_radius: {
//				// id can be specified otherwise is taken head_radius
//				min: 10,
//				max: 100,
//				step: 0.01,
//				value: 30,
//				label: 'Face radius'
//			},
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
			
//			eye_radius: {
//				min: 2,
//				max: 30,
//				step: 0.01,
//				value: 5,
//				label: 'Eye radius'
//			},
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
//			pupil_radius: {
//				min: 1,
//				max: 9,
//				step: 0.01,
//				value: 1,  //this.eye_radius;
//				label: 'Pupil radius'
//			},
//			pupil_scale_x: {
//				min: 0.2,
//				max: 2,
//				step: 0.01,
//				value: 1,
//				label: 'Scale pupils horizontally'
//			},
//			pupil_scale_y: {
//				min: 0.2,
//				max: 2,
//				step: 0.01,
//				value: 1,
//				label: 'Scale pupils vertically'
//			},
			// Eyebrow
//			eyebrow_length: {
//				min: 1,
//				max: 30,
//				step: 0.01,
//				value: 10,
//				label: 'Eyebrow length'
//			},
//			eyebrow_eyedistance: {
//				min: 0.3,
//				max: 10,
//				step: 0.01,
//				value: 3, // From the top of the eye
//				label: 'Eyebrow from eye'
//			},
			eyebrow_angle: {
				min: -2,
				max: 2,
				step: 0.01,
				value: -0.5,
				label: 'Eyebrow angle'
			},
//			eyebrow_spacing: {
//				min: 0,
//				max: 20,
//				step: 0.01,
//				value: 5,
//				label: 'Eyebrow spacing'
//			},
			
			eye_height: {
				min: 0.1,
				max: 0.9,
				step: 0.01,
				value: 0.4,
				label: 'Eye and Eyebrow height'
			},
			
			// Nose
//			nose_height: {
//				min: 0.4,
//				max: 1,
//				step: 0.01,
//				value: 0.4,
//				label: 'Nose height'
//			},
			nose_length: {
				min: 0.2,
				max: 18,
				step: 0.01,
				value: 15,
				label: 'Nose length'
			},
//			nose_width: {
//				min: 0,
//				max: 30,
//				step: 0.01,
//				value: 10,
//				label: 'Nose width'
//			},
			// Mouth
//			mouth_height: {
//				min: 0.2,
//				max: 2,
//				step: 0.01,
//				value: 0.75, 
//				label: 'Mouth height'
//			},
//			mouth_width: {
//				min: 2,
//				max: 100,
//				step: 0.01,
//				value: 20,
//				label: 'Mouth width'
//			},
//			mouth_top_y: {
//				min: -10,
//				max: 30,
//				step: 0.01,
//				value: -2,
//				label: 'Upper lip'
//			},
//			mouth_bottom_y: {
//				min: -10,
//				max: 30,
//				step: 0.01,
//				value: 20,
//				label: 'Lower lip'
//			}		
			mouth_shape: {
				min: 0,
				max: 30,
				step: 1,
				value: 0,
				label: 'Mouth Shape'
			}		
	};
	
	CFControls.others = {
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
	
	function CFControls (options) {
		jQuerySlider.call(this, options);
	};
	
	
	CFControls.prototype.getAllValues = function() {
		var out = {};
		for (var key in this.features) {	
			if (this.features.hasOwnProperty(key)) {
				var el = node.window.getElementById(key);
				if (el) {
					
					var value = Number(el.value);
					
					
					
					if (key == 'mouth_shape') {
						
						//console.log('KEY: ' + key, 'DEBUG');
						//console.log('VALUE: ' + el.value, 'DEBUG');
						var ms = CFControls.defaults.mouth_shape;
						var span = Math.abs(ms.max - ms.min);
						var x = value * 0.25;
						var y = value;
						
//						if (value < limit) {
//							y = value;
//						}
//						else if (value < 2*limit) {
//							y = limit;
//							x = value - limit;
//						}
//						else if (value < 3*limit) {
//							x = limit;
//							y = 3*limit - value;
//						}
//						else {
//							x = 0;
//							y = value - 4*limit;
//						}
						
						//var values = d2xy(value, CFControls.others.mouth_top_y, CFControls.others.mouth_bottom_y);
						out['mouth_top_y'] = x;
						out['mouth_bottom_y'] = y;
					}
					else {
						
//						console.log('KEY: ' + key);
//						console.log('VALUE: ' + value);
//						
						out[key] = value;
					}
				}
				
			}
		}
		
		out['eyebrow_length'] = 10;
		out['nose_width'] = 5;
		out['eye_radius'] = 5;
		out['pupil_radius'] = 1;
		out['pupil_scale_y'] = 1;
		out['pupil_scale_x'] = 1;
		out['head_radius'] = 30
		out['eyebrow_eyedistance'] = 3;
		out['nose_height'] = 0.4;
		out['eyebrow_spacing'] = 5;
		out['mouth_height'] = 0.75;
		out['mouth_width'] = 20;
		
		
		return out;
	};
	
	//convert (x,y) to d
	function d2xy(d, x_descr, y_descr) {
		var n = 10;
		var xspan = Math.abs(x_descr.min - x_descr.max) / x_descr.step;
		var yspan = Math.abs(y_descr.min - y_descr.max) / y_descr.step;
		
		console.log(xspan);
		console.log(yspan);
		
		
		var x = d / yspan;
		var y = d / xspan;
		var x = 0;
		
		console.log('in: ' + d);
		console.log('out: ' + x + ' ' + y);
		
		return {x: x, y: y};
		
	}
	
	
})(parent.node.window.widgets, parent.node.JSUS);