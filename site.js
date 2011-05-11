var less = require('less');

exports.compileLess = function(req, res) {
	var textToCompile = req.body.lessinput;
	var minifyIt = req.body.minify;
	
	if(typeof(minifyIt) == "undefined") { minifyIt = "false"}
	
	var parser = new(less.Parser);
	parser.parse(textToCompile, function(err, tree) {
		var css;
		var desc;
		
	  if (minifyIt == "false") {
	    try {
	 		  css = tree.toCSS({ compress: false });
	 		} catch(error) {
	 		  err = error;
	 		}
	 		desc = "Unminified";
	 	} 
	 	else {
	 		try {
	 		  css = tree.toCSS({ compress: true});
	 		} catch(error) {
	 		  err = error;
	 		}
	 		desc = "Minified";
	 	}
	 			
	 	req.session.uncompiled = textToCompile;
	 	req.session.compiledcss = css;
	 	req.session.err = err;
	 	req.session.minified = desc;

		res.redirect('back');
	});
};

exports.view = function(req, res){
    res.render('index', {
      title: 'OnLess',
      description: 'Your online compiler for LESS.js',
      uncompiled: req.session.uncompiled,
  		compiledcss: req.session.compiledcss,
  		err: req.session.err,
  		minified: req.session.minified
    });
};
