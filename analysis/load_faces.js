var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB;


var options = {
    'separator': ',',
    'quote': '"',
    'escape': '"',       
    'comment': '',
};

var reader = csv.createCsvFileReader('./out/PL.csv', options),
	readerCF = csv.createCsvFileReader('./out/key_CF.csv', options);
	

// "McCotton","0","0","0","25","false","15491801221753552529","15491801221753552529","06","red","0"
reader.setColumnNames([
                       'name', 
                       'state',
                       'step',
                       'round',
                       'is',
                       'paused',
                       'id',
                       'sid',
                       'pc',
                       'color',
                       'count',
]);
 	
//"3","1","1","50","false","11552021611387795746","CF","2.293314986813439","2.293314986813439","green","1","87.21","0.59","0.649","0.47","5","32.21","3.33","1.73","1","1","1","35.26","9.21","-0.76","18.42","0","0","0","0.75","20","54.95","-28.42","1339414035698"
var columnsCF = [
                 'state',
                 'step',
                 'round',
                 'is',
                 'paused',
                 'player',
                 'key',
                 'scaleX',
                 'scaleY',
                 'color',
                 'lineWidth',
                 'head_radius',
                 'head_scale_x',
                 'head_scale_y',
                 'eye_height',
                 'eye_radius',
                 'eye_spacing',
                 'eye_scale_x',
                 'eye_scale_y',
                 'pupil_radius',
                 'pupil_scale_x',
                 'pupil_scale_y',
                 'eyebrow_length',
                 'eyebrow_eyedistance',
                 'eyebrow_angle',
                 'eyebrow_spacing',
                 'nose_height',
                 'nose_length',
                 'nose_width',
                 'mouth_height',
                 'mouth_width',
                 'mouth_top_y',
                 'mouth_bottom_y',
                 'time',
];

readerCF.setColumnNames(columnsCF);

// "3","1","1","50","false","11552021611387795746","SUB","B","1339414035686"


// BEGIN
/////////////


var nddb = new NDDB();

nddb.h('player', function(gb) {
	return gb.pc;
});


nddb.h('state', function(gb) {
	return GameState.toHash(gb.state, 'S.s.r');
});


nddb.h('key', function(gb) {
	return gb.key;
});

var read = 0;

reader.on('data', function(data) {
	
    //console.log(data);
    var readerPL = csv.createCsvFileReader('./out/player_' + data.id + '.csv', options);
    
    readerPL.on('data', function(cf) {

    	if (cf[6] === 'CF') {
    		//console.log(cf);
    		var face = {};
    		//console.log(cf.length)
    		for (var i=7; i<33; i++) {
    			if (columnsCF[i] !== 'color') {
    				face[columnsCF[i]] = Number(cf[i]);
    			}
    			else {
    				face[columnsCF[i]] = cf[i];
    			}
    			
    		}
    		//console.log(face);
    		var gameBit = {
    				state: {
    					state: cf[0],
    					step: cf[1],
    					round: cf[2],
    					is: cf[3],
    					paused: cf[4],
    				},
		    		player: {
		    			name: data.name,
		    			id: data.id,
		    			pc: data.pc,
		    			color: data.color,
		    		},
					key: 'CF',
					value: face,
					time: cf[33],
    		};
    		//console.log(gameBit);
    		
        	nddb.insert(gameBit);
    	}
    	
    });
    
    readerPL.on('end', function(){
    	read++;
    	if (read == 9) {
//    		console.log(nddb);
    		console.log(nddb.length);
    		nddb.save('./all_cf.nddb');
    	}
    });
    
   
});



//
//reader.on('end', function(){
//	reader.end();
//	 console.log(nddb);
//	 console.log(nddb.length);
//})




//{ scaleX: 2.0308842601759634,
//    scaleY: 2.0308842601759634,
//    color: 'red',
//    lineWidth: 1,
//    head_radius: 98.47927029710263,
//    head_scale_x: 0.4676801634952426,
//    head_scale_y: 0.8455916943959891,
//    eye_height: 0.5225065590115264,
//    eye_radius: 5,
//    eye_spacing: 28.259897499810904,
//    eye_scale_x: 0.6694200600497424,
//    eye_scale_y: 1.8340390141122043,
//    pupil_radius: 1,
//    pupil_scale_x: 1,
//    pupil_scale_y: 1,
//    eyebrow_length: 12.227798664476722,
//    eyebrow_eyedistance: 8.437721000239254,
//    eyebrow_angle: -1.660272927954793,
//    eyebrow_spacing: 18.180740955285728,
//    nose_height: 0,
//    nose_length: 0,
//    nose_width: 0,
//    mouth_height: 0.75,
//    mouth_width: 20,
//    mouth_top_y: -2.790895744692534,
//    mouth_bottom_y: -3.4790710965171456 },
// time: 1339571760363 }







