
/**
 * Module dependencies.
 */

var express = require('express')
	,less = require('less');

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
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
  
});

//app.use(express.errorHandler({dumpExceptions: true, showStack: true}));




// Routes

app.post('/', function(req, res) {
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


// Provide our app with the notion of NotFound exceptions

function NotFound(path){
  this.name = 'NotFound';
  if (path) {
    Error.call(this, 'Cannot find ' + path);
    this.path = path;
  } else {
    Error.call(this, 'Not Found');
  }
  Error.captureStackTrace(this, arguments.callee);
}

/**
 * Inherit from `Error.prototype`.
 */

NotFound.prototype.__proto__ = Error.prototype;


// We can call app.error() several times as shown below.
// Here we check for an instanceof NotFound and show the
// 404 page, or we pass on to the next error handler.

// These handlers could potentially be defined within
// configure() blocks to provide introspection when
// in the development environment.

app.error(function(err, req, res, next){
  if (err instanceof NotFound) {
    res.render('404.jade', { status: 404, error: err, title: '404 Error - Page Not Found' });
  } else {
    next(err);
  }
});

// Here we assume all errors as 500 for the simplicity of
// this demo, however you can choose whatever you like

app.error(function(err, req, res){
  res.render('500.jade', { status: 500, error: err, title: '500 Error - Internal Server Error' });
});

// Error Routes

app.get('/404', function(req, res){
  throw new NotFound(req.url);
});

app.get('/500', function(req, res, next){
  next(new Error('keyboard cat!'));
});

app.get('/*', function(req, res){
	res.redirect('home', 301);
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
