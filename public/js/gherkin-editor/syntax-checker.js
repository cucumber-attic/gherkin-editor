define(['gherkin/lexer/en'], function(Lexer) {
  var lexer = new Lexer({
    comment: function(value, line) {
    },
    tag: function(value, line) {
    },
    feature: function(keyword, name, description, line) {
    },
    background: function(keyword, name, description, line) {
    },
    scenario: function(keyword, name, description, line) {
    },
    scenario_outline: function(keyword, name, description, line) {
    },
    examples: function(keyword, name, description, line) {
    },
    step: function(keyword, name, line) {
    },
    py_string: function(string, line) {
    },
    row: function(row, line) {
    },
    eof: function() {
    }
  });

  return function(source, callback) {
    try {
      lexer.scan(source);
      callback(null);
    } catch(exception) {
      var line = exception.match(/Lexing error on line (\d+):/)[1];
      callback(line);
    }
  }
});