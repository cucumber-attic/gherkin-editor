$(function () {
  // sample step definitions, to be loaded from external sources
  var stepDefinitions = {
    '^I am in a ([^"]*)$' : ['I am in a browser', 'I am in a bar'],
    '^I make a syntax error$' : [],
    '^stuff should be red$' : []
  };

  var autocompleter = new Autocomplete(stepDefinitions);
  $("#autocomplete_input").autocomplete("option","autocompleter", autocompleter);
});
