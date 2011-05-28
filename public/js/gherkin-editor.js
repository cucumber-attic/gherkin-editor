(function($){
  $.fn.gherkinEditor = function(editorCallback) {
    var jq = this;
    require(['ace/ace', 'ace/mode-gherkin', 'gherkin-editor/syntax-checker'], function(ace, g, syntaxChecker) {
      jq.each(function(i, element) {
        // Set up the editor
        var editor = ace.edit(element);
        
        // Syntax highlighting
        var GherkinMode = require("ace/mode/gherkin").Mode;
        editor.getSession().setMode(new GherkinMode());

        // Detect syntax errors
        editor.getSession().on('change', function(e) {
          // Clear any syntax error highlights
          $('#editor .ace_text-layer .ace_line').toggleClass('syntax_error', false);

          var source = editor.getSession().getValue();
          syntaxChecker(source, function(line) {
            if(line) {
              // Make line red
              jQuery('#editor .ace_text-layer .ace_line:nth-child(' + line + ')').toggleClass('syntax_error');
            }
          });
        });

        editorCallback(editor);
      });
    });
    return this;
  };
})(jQuery);
