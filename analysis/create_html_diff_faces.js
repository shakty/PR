var fs = require('fs'),
	path = require('path'),
	csv = require('ya-csv'),
	NDDB = require('NDDB').NDDB,
	d3 = require('d3');




//filenames = db.fetch();

var html = d3.select('html')
//				.append('span')
//				.text('The following charts show normalized differences between face submissions. Where the parameter is not explicitly mentioned, it is an average over all the 13 parameters of a face.') 
//				.append('br')
//				.append('span')
//					.text('The title ending reveals if the difference is computed against the previous submission of the same player or against the current submission of all the others.')
//				.append('ul')
//					.append('li')
//						.text('_mean.csv: average difference from all the other faces in the same round')
//					.append('li')
//						.text('_self.csv:   difference from the submission of the same player in the previous round')

function createListofImages(imgDir, out) {

	out = './html/' + out;
	var filenames = fs.readdirSync(imgDir);
	filenames.sort();
	
	d3.select('dl').remove();
	var dl = html.append('dl');

	dl.selectAll('dt')
		.data(filenames)
		.enter()
		.append('dt')
			.append('img')
			.attr('src', function(f){
				return '../' + imgDir + f;
			});


	fs.writeFile(out, window.document.innerHTML, function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log(out + " was saved!");
	    }
	}); 

}


// SINGLE FEATURES
// createListofImages('./csv/diff/single/img/', './index_diff_faces_single.htm');

// GROUPED
// createListofImages('./csv/diff/parts/img/', './index_diff_faces_grouped.htm');

// GLOBAL
// createListofImages('./csv/diff/global/img/', './index_diff_faces_global.htm');

// COPY
// createListofImages('./csv/copy/img/', './index_copy_in_time.htm');

// SELF
// createListofImages('./csv/diff/self/img/', './index_diff_faces_self.htm');

// PUBS
// createListofImages('./csv/diff/pubs/img/', './index_diff_faces_pubs.htm');

// DIFF PUBS
// createListofImages('./csv/diff/previouspub/img/', './index_diff_faces_previouspub.htm');

// DIFFs and SCORE
// createListofImages('./csv/diff/diffandscore/img/', './index_diffandscore.htm');

// SUBMISSION DECISION
//createListofImages('./csv/sub/img/', './index_subs.htm');

// INGROUP-OUTGROUP
//createListofImages('./csv/ingroup/img/', './index_ingroup.htm');

// EVALUATIONS
createListofImages('./csv/eva/img/', './index_evas.htm');

