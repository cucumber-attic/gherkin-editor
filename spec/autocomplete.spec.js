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
      var stepDefinitions = [
        '^I press "([^"]*)"$',
        '^he presses button$',
        '^I follow "([^"]*)"$'
      ];
      autocomplete = new Autocomplete(stepDefinitions);
    });

    it("suggest suitable steps for entered text", function(){
      var expectedSuggestions = [
        'I press "([^"]*)"',
        'he presses button'];
      var suggestedSteps = autocomplete.suggest("pre");
      var suggestedStepNames = suggestedSteps.map(function (stepDefinition) {
        return stepDefinition.step();
      });
      expect(suggestedStepNames).toBeArray(expectedSuggestions);
    });
  });
});
