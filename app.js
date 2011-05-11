
/**
 * Module dependencies.
 */

var express = require('express')
	,site = require('./site')
	,errors = require('./errors');

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
  
  app.use(express.favicon());
  app.use(express.static(__dirname + '/public'));
  
  app.use(app.router);
  
  
});



// Routes

app.post('/', site.compileLess);

app.get('/', site.view);

// Error Routes

app.get('/404', errors.throw404);

app.get('/500', errors.throw500);


// Error Handling

app.error(errors.handle404);

app.error(errors.handle500);


// When no more middleware require execution, aka
// our router is finished and did not respond, we
// can assume that it is "not found". Instead of
// letting Connect deal with this, we define our
// custom middleware here to simply pass a NotFound
// exception

app.use(function(req, res, next){
	res.redirect('home', 301);
});



// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
