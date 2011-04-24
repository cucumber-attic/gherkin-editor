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
      var current_line = editor.getSelectionRange().start.row;
      if(current_line == line - 1){
        var cursorPosition = editor.renderer.$cursorLayer.getPixelPosition();
        $("#autocomplete_input").offset(cursorPosition);
        // we can put step being completed to autocomplete input field
        //$("#autocomplete").attr("value",name);
        $("#autocomplete_input").attr("value","r");
        $("#autocomplete_input").autocomplete("search");
      }
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

  // this is just a sample to demonstrate functionality
  var availableTags = [
    "ActionScript",
    "AppleScript",
    "Asp",
    "BASIC",
    "C",
    "C++",
    "Clojure",
    "COBOL",
    "ColdFusion",
    "Erlang",
    "Fortran",
    "Groovy",
    "Haskell",
    "Java",
    "JavaScript",
    "Lisp",
    "Perl",
    "PHP",
    "Python",
    "Ruby",
    "Scala",
    "Scheme"
  ];
  $( "#autocomplete_input" ).autocomplete({
    source: availableTags
  });
  var AutocompleteHandler = require("gherkin-editor/autocomplete").AutocompleteHandler;
  editor.setKeyboardHandler(new AutocompleteHandler($( "#autocomplete_input" )));

  // Code completion
  // editor.getSession().on('change', function(e) {
  //   var line = editor.getSession().getDocument().getLine(editor.getCursorPosition().row);
  //   console.log(line);
  //   var pos = editor.renderer.$cursorLayer.pixelPos;
  //   var gutterWidth = editor.renderer.$gutterLayer.element.clientWidth;
  //   pos.left += gutterWidth;
  //   $('#autocomplete').show().offset(pos);
  // });
};
