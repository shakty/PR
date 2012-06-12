var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv');


var options = {
    'separator': ',',
    'quote': '"',
    'escape': '"',       
    'comment': '',
};

var reader = csv.createCsvFileReader('./out/PL.csv', options),
	readerCF = csv.createCsvFileReader('./out/key_CF.csv');

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
 	

reader.addListener('data', function(data) {
	
    console.log(data);
});



//"3","1","1","50","false","11552021611387795746","CF","2.293314986813439","2.293314986813439","green","1","87.21","0.59","0.649","0.47","5","32.21","3.33","1.73","1","1","1","35.26","9.21","-0.76","18.42","0","0","0","0.75","20","54.95","-28.42","1339414035698"

readerCF.setColumnNames([
                        'state',
                       'step',
                       'round',
                       'is',
                       'paused',
                       'player'
                       'key',
                       'sid',
                       'pc',
                       'color',
                       'count',
]);

function loadFaces(player) {
	
}
