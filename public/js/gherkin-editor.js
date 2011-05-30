(function($){
  $.fn.gherkinEditor = function(options) {
    var jq = this;

    var editorCallback = options.callback;
    var stepdefs = options.stepdefs;

    require(['ace/ace', 'ace/mode-gherkin', 'gherkin-editor/lexer', 'gherkin-editor/autocomplete'], function(ace, mg, lexer, Autocomplete) {
      jq.each(function(i, element) {
        // Set up the editor
        var editor = ace.edit(element);
        
        // Enable syntax highlighting
        var GherkinMode = require("ace/mode/gherkin").Mode;
        editor.getSession().setMode(new GherkinMode());

        // Use Java Applet for partial matches. Javascript RegExp don't know how to do that.
        function matches(text) {
          var result = [];
          for(var n in stepdefs) {
            var stepdef = stepdefs[n].source;
            if(PartialMatch.isPartialMatch(stepdef, text)) {
              result.push(stepdef);
            }
          }
          return result;
        }

        // Create autocomplete widget
        var auto = new Autocomplete(editor, matches);

        // Lex the document when the document changes
        editor.getSession().on('change', function(e) {
          // Clear any previous syntax error highlights
          $('#editor .ace_text-layer .ace_line').toggleClass('syntax_error', false);

          var source = editor.getSession().getValue();

          // We're passing in a callback that gets called for each step (or once, if lexing fails because of syntax error)
          lexer(source, function(keyword, name, line, err) {
            if(err) {
              // Make line red
              $('#editor .ace_text-layer .ace_line:nth-child(' + line + ')').toggleClass('syntax_error');
            } else {
              // Successful lexing. Check if step line is current editor line and activate the autocomplete if it is.
              // to do this async to make sure position to be updated.
              setTimeout(function() {
                var range = editor.getSelectionRange();
                if(line == range.start.row + 1) {
                  // Find the column where we want the autocomplete to start
                  range.start.column = 0;
                  editor.selection.setSelectionRange(range);
                  var Search = require("ace/search").Search;
                  editor.$search.set({needle: keyword, scope: Search.SELECTION});
                  var keywordRange = editor.$search.find(editor.session);
                  editor.selection.clearSelection();
                  if(keywordRange) {
                    var keywordColumn = keywordRange.end.column;
                    auto.activate(range.start.row, keywordColumn);
                    auto.suggest(name);
                  }
                }
              }, 0);
            }
          });
        });

        editorCallback(editor);
      });
    });
    return this;
  };
})(jQuery);
