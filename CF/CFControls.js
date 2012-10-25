//(function (exports, JSUS) {

	var node = parent.node;
	
	/*!
	* 
	* A description of a Chernoff Face.
	*
	* This class packages the 11-dimensional vector of numbers from 0 through 1 that completely
	* describe a Chernoff face.  
	*
	*/

	Controls.defaults = {};
	Controls.defaults.id = 'controls';
	
	
	Controls.name = 'Controls'
	Controls.version = '0.2';
	Controls.description = 'Wraps a collection of user-inputs controls.'
		
	function Controls (options) {
		this.options = options;
		this.id = options.id;
		this.root = null;
		
		this.listRoot = null;
		this.fieldset = null;
		this.submit = null;
		
		this.changeEvent = this.id + '_change';
		
		this.init(options);
	}

	Controls.prototype.add = function (root, id, attributes) {
		// TODO: node.window.addTextInput
		//return node.window.addTextInput(root, id, attributes);
	};
	
	Controls.prototype.getItem = function (id, attributes) {
		// TODO: node.window.addTextInput
		//return node.window.getTextInput(id, attributes);
	};
	
	Controls.prototype.init = function (options) {

		this.hasChanged = false; // TODO: should this be inherited?
		if ('undefined' !== typeof options.change) {
			if (!options.change){
				this.changeEvent = false;
			}
			else {
				this.changeEvent = options.change;
			}
		}
		this.list = new node.window.List(options);
		this.listRoot = this.list.getRoot();
		
		if (!options.features) return;
		if (!this.root) this.root = this.listRoot;
		this.features = options.features;
		this.populate();
	};
	
	Controls.prototype.append = function (root) {
		this.root = root;
		var toReturn = this.listRoot;
		this.list.parse();
		root.appendChild(this.listRoot);
		
		if (this.options.submit) {
			var idButton = 'submit_' + this.id;
			if (this.options.submit.id) {
				var idButton = this.options.submit.id;
				delete this.options.submit.id;
			}
			this.submit = node.window.addButton(root, idButton, this.options.submit, this.options.attributes);
			
			var that = this;
			this.submit.onclick = function() {
				if (that.options.change) {
					node.emit(that.options.change);
				}
			};
		}		
		
		return toReturn;
	};
	
	Controls.prototype.parse = function() {
		console.log('I am parsing...')
		return this.list.parse();
	};
	
//	Controls.prototype.populate = function () {
//		var that = this;
//		
//		function addAttributes(attributes) {}
//		
//		
//		for (var key in this.features) {
//			if (this.features.hasOwnProperty(key)) {
//				// Prepare the attributes vector
//				var attributes = this.features[key];
//				
//				if ('object' == typeof attributes) {
//					if ('object' == typeof attributes[0]) {
//						this.addDT(document.createTextNode(attributes[0]));
//						
//					}
//					
//				
//				
//					var id = key;
//					if (attributes.id) {
//						var id = attributes.id;
//						delete attributes.id;
//					}
//								
//					var container = document.createElement('div');
//					// Add a different element according to the subclass instantiated
//					var elem = this.add(container, id, attributes);
//									
//					// Fire the onChange event, if one defined
//					if (this.changeEvent) {
//						elem.onchange = function() {
//							node.emit(that.changeEvent);
//						};
//					}
//					
//					if (attributes.label) {
//						node.window.addLabel(container, elem, null, attributes.label);
//					}
//					
//					// Element added to the list
//					this.list.addDT(container);
//				}
//				
//			}
//		}
//	};
	
	Controls.prototype.populate = function () {
		var that = this;
		
		for (var key in this.features) {
			if (this.features.hasOwnProperty(key)) {
				// Prepare the attributes vector
				var attributes = this.features[key];
				var id = key;
				if (attributes.id) {
					var id = attributes.id;
					delete attributes.id;
				}
							
				var container = document.createElement('div');
				// Add a different element according to the subclass instantiated
				var elem = this.add(container, id, attributes);
								
				// Fire the onChange event, if one defined
				if (this.changeEvent) {
					elem.onchange = function() {
						node.emit(that.changeEvent);
					};
				}
				
				if (attributes.label) {
					node.window.addLabel(container, elem, null, attributes.label);
				}
				
				// Element added to the list
				this.list.addDT(container);
			}
		}
	};
	
	Controls.prototype.listeners = function() {	
		var that = this;
		// TODO: should this be inherited?
		node.on(this.changeEvent, function(){
			that.hasChanged = true;
		});
				
	};

	Controls.prototype.refresh = function() {
		for (var key in this.features) {	
			if (this.features.hasOwnProperty(key)) {
				var el = node.window.getElementById(key);
				if (el) {
//					node.log('KEY: ' + key, 'DEBUG');
//					node.log('VALUE: ' + el.value, 'DEBUG');
					el.value = this.features[key].value;
					// TODO: set all the other attributes
					// TODO: remove/add elements
				}
				
			}
		}
		
		return true;
	};
	
	Controls.prototype.getAllValues = function() {
		var out = {};
		for (var key in this.features) {	
			if (this.features.hasOwnProperty(key)) {
				var el = node.window.getElementById(key);
				if (el) {
//					node.log('KEY: ' + key, 'DEBUG');
//					node.log('VALUE: ' + el.value, 'DEBUG');
					out[key] = Number(el.value);
				}
				
			}
		}
		
		return out;
	};
	
	Controls.prototype.highlight = function (code) {
		return node.window.highlight(this.listRoot, code);
	};
	
// Slider 
	
	SliderControls.prototype.__proto__ = Controls.prototype;
	SliderControls.prototype.constructor = SliderControls;
	
	SliderControls.id = 'slidercontrols';
	SliderControls.name = 'Slider Controls';
	SliderControls.version = '0.2';
	
	SliderControls.dependencies = {
		Controls: {}
	};
	
	
	function SliderControls (options) {
		Controls.call(this, options);
	};
	
	SliderControls.prototype.add = function (root, id, attributes) {
		return node.window.addSlider(root, id, attributes);
	};
	
	SliderControls.prototype.getItem = function (id, attributes) {
		return node.window.getSlider(id, attributes);
	};
	
	/////
	
	
	//////////////
	
// jQuerySlider
    
    jQuerySliderControls.prototype.__proto__ = Controls.prototype;
    jQuerySliderControls.prototype.constructor = jQuerySliderControls;
    
    jQuerySliderControls.id = 'jqueryslidercontrols';
    jQuerySliderControls.name = 'Experimental: jQuery Slider Controls';
    jQuerySliderControls.version = '0.13';
    
    jQuerySliderControls.dependencies = {
        jQuery: {},
        Controls: {},
    };
    
    
    function jQuerySliderControls (options) {
        Controls.call(this, options);
    };
    
    jQuerySliderControls.prototype.add = function (root, id, attributes) {
        var slider = jQuery('<div/>', {
    	    id: id,
    	}).slider();
        
        
    	var s = slider.appendTo(root);
    	return s[0];
    };
    
    jQuerySliderControls.prototype.getItem = function (id, attributes) {
    	var slider = jQuery('<div/>', {
     	    id: id,
     		}).slider();
    	
    	return slider;
    };


    ///////////////////////////
	
	
	CFControls.prototype.__proto__ = jQuerySliderControls.prototype;
//	CFControls.prototype.__proto__ = SliderControls.prototype;

	CFControls.prototype.constructor = CFControls;
	
	
	CFControls.id = 'CFControls';
	CFControls.name = 'CF Controls';
	CFControls.version = '0.2';
	
	CFControls.dependencies = {
		Controls: {}
	};
	
	CFControls.defaults = {
			// Head

			head_scale_x: {
				min: 0.001,
				max: 2,
				step: 0.001,
				value: 0.5,
				label: 'Scale head horizontally'
			},
			head_scale_y: {
				min: 0.01,
				max: 2,
				step: 0.001,
				value: 1,
				label: 'Scale head vertically'
			},
			
			// Eye
			
			eye_height: {
				min: 0,
				max: 2,
				step: 0.01,
				value: 0.4,
				label: 'Eye and Eyebrow height'
			},	
			
			eye_spacing: {
				min: 0,
				max: 40,
				step: 0.01,
				value: 10,
				label: 'Eye spacing'
			},
			eye_scale_x: {
				min: 0.01,
				max: 4,
				step: 0.01,
				value: 1,
				label: 'Scale eyes horizontally'
			},
			eye_scale_y: {
				min: 0.01,
				max: 4,
				step: 0.01,
				value: 1,
				label: 'Scale eyes vertically'
			},
			
			// Eyebrow
			eyebrow_length: {
				min: 0,
				max: 50,
				step: 0.01,
				value: 10,
				label: 'Eyebrow length'
			},
			
			eyebrow_angle: {
				min: -3.14,
				max: 3.14,
				step: 0.01,
				value: -0.5,
				label: 'Eyebrow angle'
			},
			
			eyebrow_eyedistance: {
				min: 0,
				max: 50,
				step: 0.01,
				value: 3, // From the top of the eye
				label: 'Eyebrow from eye'
			},
			
			eyebrow_spacing: {
				min: 0,
				max: 50,
				step: 0.01,
				value: 5,
				label: 'Eyebrow spacing'
			},

			// Mouth 

			mouth_top_y: {
				min: -60,
				max: 60,
				step: 0.01,
				value: -2,
				label: 'Upper lip'
			},
			mouth_bottom_y: {
				min: -60,
				max: 60,
				step: 0.01,
				value: 20,
				label: 'Lower lip'
			},
			
			// Head

			head_radius: {
				min: 10,
				max: 100,
				step: 0.01,
				value: 30,
				label: 'Zoom in'
			},
			

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
		},
	};
	
	
	CFControls.fixed = {
			
			// Eye
			eye_radius: {
				min: 2,
				max: 30,
				step: 0.01,
				value: 5,
				label: 'Eye radius'
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
			
		// Nose
		nose_length: {
			min: 0.2,
			max: 18,
			step: 0.01,
			value: 0, //15,
			label: 'Nose length'
		},
		
		nose_height: {
			min: 0.4,
			max: 1,
			step: 0.01,
			value: 0, //0.4,
			label: 'Nose height'
		},

		nose_width: {
			min: 0,
			max: 30,
			step: 0.01,
			value: 0, //5,
			label: 'Nose width'
		},
	};
	
	
	
	function CFControls (options) {
		jQuerySliderControls.call(this, options);
	};
	
	CFControls.normalizeFeatures = function (input) {
		if (!input) return CFControls.defaults;
		var defaults = node.JSUS.clone(CFControls.defaults);
		for (var key in input) {
			if (input.hasOwnProperty(key)) {
				if (defaults.hasOwnProperty(key)){		
					defaults[key].value = input[key];
				}
				
//				if (key === 'mouth_bottom_y') {
//					defaults.mouth_shape.value = input[key]; 
//				}
//				else if (defaults.hasOwnProperty(key)){		
//					defaults[key].value = input[key];
//				}
			}	
		}
		return defaults;
	}
	
	CFControls.pinDownFeatures = function (input) {
		if (!input) return input;
		for (var key in input) {
			if (input.hasOwnProperty(key)) {
//				if (key === 'mouth_top_y') {
//					if (input.mouth_bottom_y > 0) {
//						input[key] = input.mouth_bottom_y * 0.25; 
//					}
//					else {
//						input[key] = 0;
//						input.mouth_bottom_y = 0;
//					}
//				}
//				else if (CFControls.fixed.hasOwnProperty(key)) {
//					input[key] = CFControls.fixed[key].value;
//					//console.log(key + ' ' + input[key]);
//				}
				
				if (CFControls.fixed.hasOwnProperty(key)) {
					input[key] = CFControls.fixed[key].value;
					//console.log(key + ' ' + input[key]);
				}
				
			}	
		}
		return input;
	}	
	
	CFControls.prototype.parse = function() {
		return this.list.parse();
	};
	
	CFControls.prototype.getAllValues = function() {
		var out = {};
		for (var key in this.features) {	
			if (this.features.hasOwnProperty(key)) {
				var el = node.window.getElementById(key);
				
				if (el) {
					
					//var value = Number(el.value);
					var value = $(el).slider('value');
//					console.log('key');
//					console.log(value);
					out[key] = value;
					
//					if (key == 'mouth_shape') {
//						
//						//console.log('KEY: ' + key, 'DEBUG');
//						//console.log('VALUE: ' + el.value, 'DEBUG');
//						var ms = CFControls.defaults.mouth_shape;
//						var span = Math.abs(ms.max - ms.min);
//						var x = value * 0.25;
//						var y = value;
//						
////						if (value < limit) {
////							y = value;
////						}
////						else if (value < 2*limit) {
////							y = limit;
////							x = value - limit;
////						}
////						else if (value < 3*limit) {
////							x = limit;
////							y = 3*limit - value;
////						}
////						else {
////							x = 0;
////							y = value - 4*limit;
////						}
//						
//						//var values = d2xy(value, CFControls.others.mouth_top_y, CFControls.others.mouth_bottom_y);
//						out['mouth_top_y'] = x;
//						out['mouth_bottom_y'] = y;
//					}
//					else {
//						
////						console.log('KEY: ' + key);
////						console.log('VALUE: ' + value);
////						
//						out[key] = value;
//					}
				}
				
			}
		}
		
		// Face color
		out.color = node.player.color;
		
		out['eye_radius'] = 5;
		out['pupil_radius'] = 1;
		out['pupil_scale_y'] = 1;
		out['pupil_scale_x'] = 1;
		//out['head_radius'] = 30;
		//out['eyebrow_length'] = 10;
		//out['eyebrow_eyedistance'] = 3;
		//out['eyebrow_spacing'] = 5;
		out['nose_height'] = 0; //0.4;
		out['nose_width'] = 0; //5;
		out['nose_length'] = 0;
		//out['mouth_height'] = 0.75;
		//out['mouth_width'] = 20;
	
		
		return out;
	};
	
	//convert (x,y) to d
	function d2xy(d, x_descr, y_descr) {
		var n = 10;
		var xspan = Math.abs(x_descr.min - x_descr.max) / x_descr.step;
		var yspan = Math.abs(y_descr.min - y_descr.max) / y_descr.step;
		
//		console.log(xspan);
//		console.log(yspan);
		
		
		var x = d / yspan;
		var y = d / xspan;
		var x = 0;
		
//		console.log('in: ' + d);
//		console.log('out: ' + x + ' ' + y);
		
		return {x: x, y: y};
		
	}
	
	
//})(parent.node.window.widgets, parent.node.JSUS);