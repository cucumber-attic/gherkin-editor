var StepDefinition = function (regexp, examples) {
  this.regexp = regexp;
  this.examples = examples;
};

StepDefinition.prototype = {
  match : function (enteredText) {
    var exampleMatches = this.exampleMatches(enteredText);
    if(this.regexpMatch(enteredText) || exampleMatches.length > 0){
      return new StepDefinition(this.regexp, exampleMatches);
    } else {
      return false;
    }
  },

  step : function () {
    return this.regexp.replace(/^\^/g,'').replace(/\$$/g,'');
  },

  regexpMatch : function (enteredText) {
    return this.regexp.indexOf(enteredText)>= 0;
  },

  exampleMatches : function (enteredText) {
    if(this.regexpMatch(enteredText)) {
      return this.examples;
    } else {
      var matches = [];
      this.examples.forEach( function (example) {
        if(example.indexOf(enteredText) >= 0){
          matches.push(example);
        }
      });
      return matches;
    }
  }
};
if(typeof exports != 'undefined'){
  exports.StepDefinition = StepDefinition;
}


var Autocomplete = function (stepDefinitions) {
  this.stepDefinitions = [];
  for(regexp in stepDefinitions){
    this.stepDefinitions.push(new StepDefinition(regexp, stepDefinitions[regexp]));
  }
};

Autocomplete.prototype = {
  suggest : function(enteredText) { 
    var foundStepDefinitions = [];
    this.stepDefinitions.forEach(function (stepDefinition) {
      var match = stepDefinition.match(enteredText);
      if(match){
        foundStepDefinitions.push(match);
      }
    });
    return foundStepDefinitions;
  }
};
if(typeof exports != 'undefined'){
  exports.Autocomplete = Autocomplete;
}
