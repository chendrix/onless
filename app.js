
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
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'OnLess',
    description: 'Your online compiler for LESS.js'
  });
});

app.post('/compile', function(req, res) {
	var tocompile = req.body.lessinput;
	less.render(tocompile, function(e, css) {
		res.render('compiled', {
			title: 'OnLess Compiled CSS',
			uncompiled: tocompile,
			compiledcss: css
		});
	
	});
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
