(function($){
  $.fn.gherkinEditor = function(editorCallback) {
    var jq = this;
    require(['ace/ace', 'ace/mode-gherkin', 'gherkin-editor/lexer'], function(ace, g, lexer) {
      jq.each(function(i, element) {
        // Set up the editor
        var editor = ace.edit(element);
        
        // Syntax highlighting
        var GherkinMode = require("ace/mode/gherkin").Mode;
        editor.getSession().setMode(new GherkinMode());

        // Lex the document when the document changes
        editor.getSession().on('change', function(e) {
          // Clear any previous syntax error highlights
          $('#editor .ace_text-layer .ace_line').toggleClass('syntax_error', false);

          var source = editor.getSession().getValue();
          lexer(source, function(keyword, name, line, err) {
            if(err) {
              // Make line red
              jQuery('#editor .ace_text-layer .ace_line:nth-child(' + line + ')').toggleClass('syntax_error');
            } else {
              // Successful lexing. Check if line is current editor line.
              var currentLine = editor.getSelectionRange().start.row + 1;
              if(line == currentLine) {
                console.log("STEP", keyword, name, line);
              }
            }
          });
        });

        editorCallback(editor);
      });
    });
    return this;
  };
})(jQuery);
