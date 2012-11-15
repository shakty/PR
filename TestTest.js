

window.onload = function() {
	
	W.restoreOnleave()

//var a = document.createTextNode('aaa aa aa');
//var b = document.createTextNode('bb bbb bb');
//
//var s = document.createElement('span');
//s.appendChild(a);
//s.appendChild(b);
//document.body.appendChild(s)

function sprintf(string, args, root) {
		
	var text, textNode, span, idx_start, idx_finish, idx_replace, idxs, spans = {};
	
	if (!args) {
		return document.createTextNode(string);
	}
	
	root = root || document.createElement('span');
	
	// Transform arguments before inserting them.
	for (var key in args) {
		if (args.hasOwnProperty(key)) {
			
			

			// pattern not found
			if (idx_start === -1) continue;
			
			switch(key[0]) {
			
			case '%': // span
				
				idx_start = string.indexOf(key);
				idx_replace = idx_start + key.length;
				idx_finish = string.indexOf(key, idx_replace);
				
				if (idx_finish === -1) {
					console.log('Error. Could not find closing key: ' + key);
					continue;
				}
				
				spans[idx_start] = key;
				
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
	
	// No span to creates
	if (!JSUS.size(spans)) {
		return document.createTextNode(string);
	}
	
	// Re-assamble the string
	
	idxs = JSUS.keys(spans).sort(function(a,b){return a-b;});
	idx_finish = 0;
	for (var i = 0; i < idxs.length; i++) {
		
		// add span
		key = spans[idxs[i]];
		idx_start = string.indexOf(key);
		
		// add fragments of string
		if (idx_finish !== idx_start-1) {
			root.appendChild(document.createTextNode(string.substring(idx_finish, idx_start)));
		}
		
		idx_replace = idx_start + key.length;
		idx_finish = string.indexOf(key, idx_replace);
		
		span = W.getElement('span', null, args[key]);

		text = string.substring(idx_replace, idx_finish);
		
		span.appendChild(document.createTextNode(text));
		
		root.appendChild(span);
		idx_finish = idx_finish + key.length;
	}
	
	// add the final part of the string
	if (idx_finish !== string.length) {
		root.appendChild(document.createTextNode(string.substring(idx_finish)));
	}
	
	return root;
}
	
	
//
//
	
	var s = '%s!xxx%s, adesso vai a %ucasa%u!!%nono no non ci vado!%nono.';
	var s = '%s!xxx %s, adesso vai a %ucasa%u!!%nono no non ci vado!%nono.'
	
var tn = sprintf(, {
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
	'!xxx': '<strong>Bravo<strong>',
}, document.body);


console.log(s.replace('!xxx', 'Bravo'));

//console.log(tn);
//console.log('aaa')
//
//document.body.appendChild(tn);

}
