var getKeys = function(obj){
   var keys = [];
   for(var key in obj){
      keys.push(key);
   }
   return keys;
}
window.onload = function() {
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
        currentKeyword = keyword;
        var cursorPosition = editor.renderer.$cursorLayer.getPixelPosition();
        // move to current line
        $("#autocomplete_input").offset(cursorPosition);
        // show aucotompletion
        $("#autocomplete_input").attr("value",name);
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

  // sample step definitions, to be loaded from external sources
  var stepDefinitions = {
    '^I am in a ([^"]*)$' : ['I am in a browser', 'I am in a bar'],
    '^I make a syntax error$' : [],
    '^stuff should be red$' : []
  };

  var autocomplete = new Autocomplete(stepDefinitions);

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
  };

  $( "#autocomplete_input" ).autocomplete({
    source: function (request, response) {
      var suggestedSteps = autocomplete.suggest(request.term);
      var suggestedStepNames = [];
      suggestedSteps.forEach(function (stepDefinition) {
        suggestedStepNames.push({ label: stepDefinition.step(), value: stepDefinition.step()});
        stepDefinition.examples.forEach(function (example) {
          suggestedStepNames.push({ label: '<div class="autocomplete-indent"/>'+example, value: example});
        });
      });
      response.call(this, suggestedStepNames);
    },
    select: function (event, ui) {
      replaceCurrentStep(ui.item.value);
    },
    html : true
  });

  editor.setKeyboardHandler(new AutocompleteHandler($( "#autocomplete_input" )));

  // editor.getSession().on('change', function(e) {
  //   var line = editor.getSession().getDocument().getLine(editor.getCursorPosition().row);
  //   console.log(line);
  //   var pos = editor.renderer.$cursorLayer.pixelPos;
  //   var gutterWidth = editor.renderer.$gutterLayer.element.clientWidth;
  //   pos.left += gutterWidth;
  //   $('#autocomplete').show().offset(pos);
  // });
};
