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

exports.createErrors = NotFound;