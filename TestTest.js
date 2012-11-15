

window.onload = function() {
	
	W.restoreOnleave()

//var a = document.createTextNode('aaa aa aa');
//var b = document.createTextNode('bb bbb bb');
//
//var s = document.createElement('span');
//s.appendChild(a);
//s.appendChild(b);
//document.body.appendChild(s)

function format_string(string, args, root) {
		
	var text, textNode, span, idx_start, idx_finish, idx_replace, idxs, spans = {};
	
	if (!args) {
		return document.createTextNode(string);
	}
	
	root = root || document.createElement('span');
	
	// Transform arguments before inserting them.
	for (var key in args) {
		if (args.hasOwnProperty(key)) {
			
			idx_start = string.indexOf(key);

			// pattern not found
			if (idx_start === -1) continue;
			
			switch(key[0]) {
			
			case '%': // span
			
				idx_replace = idx_start + key.length;
				idx_finish = string.indexOf(key, idx_replace);
				
				if (idx_finish === -1) {
					console.log('Error. Could not find closing key: ' + key);
					continue;
				}

				span = W.getElement('span', null, args[key]);

				spans[idx_start] = key;
				
				spans[idx_start] = {
						span: span,
						idx_finish: idx_finish,
						idx_replace: idx_replace,
						marker_length: key.length,
				};
				
				break;
			
			case '@': // replace and sanitize
				
				string = string.replace(key, escape(args[key]));
				break;
				
			case '!': // replace and not sanitize
				string = string.replace(key, args[key]);
				break;
				
			default:
				console.log('Identifier not in [!,@,%]: ' + key[0]);
		
			}
		}
	}
	
	// No substitution was made
	if (!JSUS.size(spans)) {
		return document.createTextNode(string);
	}
	
	// Re-assamble the string
	
	idxs = JSUS.keys(spans).sort(function(a,b){return a-b});
	
	console.log('BEFORE SPAN')
	
	console.log()
	
	idx_start = -1;
	for (var i = 0; i < idxs.length; i++) {
		
		// add fragments of string
		if (idx_start !== idxs[i]-1) {
			root.appendChild(document.createTextNode(string.substring(idx_start, idxs[i])));
		}
		
		// add span
		key = spans[idxs[i]];
		
		idx_replace = idx_start + key.length;
		idx_finish = string.indexOf(key, idx_replace);
		
		if (idx_finish === -1) {
			console.log('Error. Could not find closing key: ' + key);
			continue;
		}

		span = W.getElement('span', null, args[key]);

		spans[idx_start] = key;
		
		spans[idx_start] = {
				span: span,
				idx_finish: idx_finish,
				idx_replace: idx_replace,
				marker_length: key.length,
		};
		
		
		text = string.substring(spanInfo.idx_replace, spanInfo.idx_finish);
		
		spanInfo.span.appendChild(document.createTextNode(text));
		
		root.appendChild(spanInfo.span);
		idx_start = spanInfo.idx_finish + spanInfo.marker_length;
		//idx_start = spans[idxs[i]].finish + spans[idxs[i]].marker_length;
	}
	
	// add the final part of the string
	if (idx_start !== string.length) {
		root.appendChild(document.createTextNode(string.substring(idx_start)));
	}
	
	return root;
}
//
//
var tn = format_string('%s!xxx%s, adesso vai a %ucasa%u!!%nono no non ci vado!%nono.', {
	'%nono': {
		id: 'nono',
	},
	'%u': {
		id: 'casa',
	},
	'%s': {
		id: 'mamma',
		style: 'font-size: 20px; font-family: courier;',
	},
	'!xxx': 'Bravo',
}, document.body);

var s = '%s!xxx%s, adesso vai a %ucasa%u!!%nono no non ci vado!%nono.';
console.log(s.replace('!xxx', 'Bravo'));

//console.log(tn);
//console.log('aaa')
//
//document.body.appendChild(tn);

}
