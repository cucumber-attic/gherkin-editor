var StepDefinition = function (regexp) {
  this.regexp = regexp;
};

StepDefinition.prototype = {
  doesMatch : function (enteredText) {
    if(this.regexp.indexOf(enteredText)>= 0){
      return true;
    } else {
      return false;
    }
  },

  step : function () {
    return this.regexp.replace(/^\^/g,'').replace(/\$$/g,'');
  }
};
if(typeof exports != 'undefined'){
  exports.StepDefinition = StepDefinition;
}


var Autocomplete = function (stepDefinitions) {
  var self = this;
  this.stepDefinitions = [];
  stepDefinitions.forEach(function (stepDefinitionRegexp) {
    self.stepDefinitions.push(new StepDefinition(stepDefinitionRegexp));
  });
};

Autocomplete.prototype = {
  suggest : function(enteredText) { 
    var foundStepDefinitions = this.stepDefinitions.filter(function (stepDefinition) {
      return stepDefinition.doesMatch(enteredText);
    });
    return foundStepDefinitions;
  }
};
if(typeof exports != 'undefined'){
  exports.Autocomplete = Autocomplete;
}
