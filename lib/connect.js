exports.connect = function(path) {
  var gherkinEditorFiles = require('connect').static(__dirname);

  return function(req, res, next) {
    if(req.url.indexOf(path) == 0) {
      req.url = req.url.slice(path.length);
      gherkinEditorFiles(req, res, next);
    } else {
      next();
    }
  };
};
