sys = require('sys');
require.paths.unshift(__dirname + '/../lib');
beforeEach(function() {
  this.addMatchers({
    toBeArray: function(expectedArray) { 
      if(expectedArray.length != this.actual.length){
        return false;
      }
      for(i = 0; i < this.actual.length; i++){
        if(this.actual[i] != expectedArray[i]) {
          return false;
        }
      }
      return true;
    }
  });
});

var Autocomplete = require('autocomplete/autocomplete').Autocomplete;

describe("Steps Autocompletion", function(){
  describe("on simple step defintions", function () {
    beforeEach(function(){
      var stepDefinitions = {
        '^I press "([^"]*)"$' : ['I press "Apply"','I press "Save"'],
        '^he presses button$' : [],
        '^I am on ([^"]*)$' : ['I am on home page', 'I am on login page']
      };
      autocomplete = new Autocomplete(stepDefinitions);
    });

    it("suggest suitable steps for entered text", function(){
      var expectedSuggestions = [
        'I press "([^"]*)"',
        '** I press "Apply"',
        '** I press "Save"',
        'he presses button'];
      var suggestedSteps = autocomplete.suggest("pre");
      var suggestedStepNames = [];
      suggestedSteps.forEach(function (stepDefinition) {
        suggestedStepNames.push(stepDefinition.step());
        stepDefinition.examples.forEach(function (example) {
          suggestedStepNames.push("** "+example);
        });
      });
      expect(suggestedStepNames).toBeArray(expectedSuggestions);
    });

    describe("Entered text matches an example", function () {
      it("suggests this example, including it's step definition", function () {
      var expectedSuggestions = [
        'I press "([^"]*)"',
        '** I press "Apply"'];
      var suggestedSteps = autocomplete.suggest('I press "App');
      var suggestedStepNames = [];
      suggestedSteps.forEach(function (stepDefinition) {
        suggestedStepNames.push(stepDefinition.step());
        stepDefinition.examples.forEach(function (example) {
          suggestedStepNames.push("** "+example);
        });
      });
      expect(suggestedStepNames).toBeArray(expectedSuggestions);
      });
    });
  });
});
