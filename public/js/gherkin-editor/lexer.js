define(['gherkin/lexer/en'], function(Lexer) {
  var listener = {
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
    step: function(keyword, name, line) {
    },
    scenario_outline: function(keyword, name, description, line) {
    },
    examples: function(keyword, name, description, line) {
    },
    py_string: function(string, line) {
    },
    row: function(row, line) {
    },
    eof: function() {
    }
  };
  var lexer = new Lexer(listener);

  return function(source, stepFunction) {
    try {
      // Reassign the step function
      listener.step = stepFunction;
      lexer.scan(source);
    } catch(exception) {
      var line = exception.match(/Lexing error on line (\d+):/)[1];
      stepFunction(null, null, line, true);
    }
  }
});