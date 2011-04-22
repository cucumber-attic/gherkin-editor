window.onload = function() {
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
  
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/twilight");

  var GherkinMode = require("ace/mode/gherkin").Mode;
  editor.getSession().setMode(new GherkinMode());

  editor.getSession().setTabSize(2);
  editor.getSession().setUseSoftTabs(true);

  editor.getSession().on('change', function(e) {
    var source = editor.getSession().getValue();
    jQuery('#editor .ace_text-layer .ace_line').toggleClass('syntax_error', false);
    try {
      lexer.scan(source);
    } catch(exception) {
      var line = exception.match(/Lexing error on line (\d+):/)[1];
      jQuery('#editor .ace_text-layer .ace_line:nth-child(' + line + ')').toggleClass('syntax_error');
    }
  });
};
