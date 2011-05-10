
/**
 * Module dependencies.
 */

var express = require('express');
var less = require('less');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  
  app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat" }));

  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});



// Routes

app.post('/', function(req, res) {
	var textToCompile = req.body.lessinput;
	var minifyIt = req.body.minify;
	
	var parser = new(less.Parser);
	parser.parse(textToCompile, function(err, tree) {
		var css;
		var desc;
		
	  if (!minifyIt) {
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

});

app.get('/', function(req, res){
    res.render('index', {
      title: 'OnLess',
      description: 'Your online compiler for LESS.js',
      uncompiled: req.session.uncompiled,
  		compiledcss: req.session.compiledcss,
  		err: req.session.err,
  		minified: req.session.minified
    });

});

app.post('/compile', function(req, res) {
	var textToCompile = req.body.lessinput;
	var minifyIt = req.body.minify;
	
	var parser = new(less.Parser);
	parser.parse(textToCompile, function(e, tree) {
		var css;
		var desc;
		
	 	if (!minifyIt) {
	 		css = tree.toCSS({ compress: false });
	 		desc = "Unminified";
	 	} 
	 	else {
	 		css = tree.toCSS({ compress: true });
	 		desc = "Minified";
	 	}

		res.render('compiled', {
			title: 'OnLess Compiled CSS',
			uncompiled: textToCompile,
			compiledcss: css,
			err: e,
			minified: desc
		});
	});
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
