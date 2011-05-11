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




// Export Error Types for use in other middleware
exports.NotFound = NotFound;


// Error Throwing

exports.throw404 = function(req, res){
  throw new NotFound(req.url);
};

exports.throw500 = function(req, res, next){
  next(new Error('keyboard cat!'));
};


// Error Handling

exports.handle404 = function(err, req, res, next){
  if (err instanceof NotFound) {
    res.render('404', { status: 404, error: err, title: '404 Error - Page Not Found' });
  } else {
    next(err);
  }
};

// Here we assume all errors as 500 for the simplicity of
// this demo, however you can choose whatever you like

exports.handle500 = function(err, req, res) {
	res.render('500', {status: 500, error: err, title: '500 Error - Internal Server Error'});
}

