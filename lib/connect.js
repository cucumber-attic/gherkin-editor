exports.connect = function(path) {
  var gherkingEditorFiles = require('connect').static(__dirname);

  return function(req, res, next) {
    if(req.url.indexOf(path) == 0) {
      req.url = req.url.slice(path.length);
      gherkingEditorFiles(req, res, next);
    } else {
      next();
    }
  };
};
