require([
  "jquery",
  "ace/ace",
  "ace/mode-gherkin",
  "ace/theme-twilight",
  "gherkin/lexer/en"
  ], function($, ace, _gm_, _theme_, Lexer) {
  require.ready(function() {
    $(function() {
      var editorElement = $('#editor');
      var currentKeyword, somethingChanged;
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
          var currentLine = editor.getSelectionRange().start.row;
          if(currentLine == line - 1){
            var input = $("#autocomplete_input");
            var cursorPosition = editor.renderer.$cursorLayer.getPixelPosition();
            // move to current line, taking into account the position of the editor element
            var autocompleteOffset = {
              top: cursorPosition.top + editorElement.offset().top,
              left : cursorPosition.left + editorElement.offset().left
            };
            input.offset(autocompleteOffset);
            // show aucotompletion
            input.attr("value",name);
            input.autocomplete("search");
            currentKeyword = keyword;
          }
        },
        py_string: function(string, line) {
        },
        row: function(row, line) {
        },
        eof: function() {
        }
      });

      var editor = ace.edit(editorElement[0]);
      editor.setTheme("ace/theme/twilight");

      var GherkinMode = require("ace/mode/gherkin").Mode;
      editor.getSession().setMode(new GherkinMode());

      var Search = require("ace/search").Search;

      editor.getSession().setTabSize(2);
      editor.getSession().setUseSoftTabs(true);

      editor.getSession().on('change', function(e) {
        somethingChanged = true;
      });

      // we can not use "on change" for autocompletion directly, because when
      // pressing enter, the cursore is moved after the onChange event, so that
      // in the time on change is invoked, we are still on the old line.
      // The problem now is, that when backspacing, onChangeCursor is invoked before
      // onChange, so it does not autocomplete after first backspace.
      editor.selection.on('changeCursor', function(e) {
        if(somethingChanged){
          var source = editor.getSession().getValue();
          jQuery('#editor .ace_text-layer .ace_line').toggleClass('syntax_error', false);
          try {
            lexer.scan(source);
          } catch(exception) {
            var line = exception.match(/Lexing error on line (\d+):/)[1];
            jQuery('#editor .ace_text-layer .ace_line:nth-child(' + line + ')').toggleClass('syntax_error');
          }
          somethingChanged = false;
        }
      });

      // Code completion


      var replaceCurrentStep = function (value) {
        // select current line
        var stepRange = editor.getSelectionRange();
        stepRange.start.column = 0;
        editor.selection.setSelectionRange(stepRange);

        // search for keyword on this line
        editor.$search.set({needle: currentKeyword, scope: Search.SELECTION});
        var keywordRange = editor.$search.find(editor.session);

        // replace the rest after the keyword with selected value
        stepRange.start.column = keywordRange.end.column;
        editor.selection.setSelectionRange(stepRange);
        editor.insert(value);
        editor.focus();
      };

      $( "#autocomplete_input" ).autocomplete({
        autocompleter: undefined,
        source: function (request, response) {
          if(this.options.autocompleter){
            var suggestedSteps = this.options.autocompleter.suggest(request.term);
            var suggestedStepNames = [];
            suggestedSteps.forEach(function (stepDefinition) {
              suggestedStepNames.push({ label: stepDefinition.step(), value: stepDefinition.step()});
              stepDefinition.examples.forEach(function (example) {
                suggestedStepNames.push({ label: '<div class="autocomplete-indent">'+example+'</div>', value: example});
              });
            });
            response.call(this, suggestedStepNames);
          }
        },
        select: function (event, ui) {
          replaceCurrentStep(ui.item.value);
        },
        html: true,
        autoFocus: true
      });

      require(["gherkin-editor/autocomplete"], function(autocomplete) {
        console.log(autocomplete);
      });
      //editor.setKeyboardHandler(new AutocompleteHandler($( "#autocomplete_input" )));

      // editor.getSession().on('change', function(e) {
      //   var line = editor.getSession().getDocument().getLine(editor.getCursorPosition().row);
      //   console.log(line);
      //   var pos = editor.renderer.$cursorLayer.pixelPos;
      //   var gutterWidth = editor.renderer.$gutterLayer.element.clientWidth;
      //   pos.left += gutterWidth;
      //   $('#autocomplete').show().offset(pos);
      // });
    });
  });
});
