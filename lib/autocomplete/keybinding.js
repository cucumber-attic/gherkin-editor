function AutocompleteHandler(autocomplete_input){
  this.autocomplete_input = autocomplete_input;
}

AutocompleteHandler.prototype = {

  $simulateAutocompleteKey: function(keyCode) {
    e = jQuery.Event("keydown");
    e.keyCode = keyCode;
    this.autocomplete_input.trigger(e);
    e = jQuery.Event("keypress");
    e.keyCode = keyCode;
    this.autocomplete_input.trigger(e);
  },

  $autocompleteBindings: function(data, symbolicName, hashId, key) {
    var keyCode = $.ui.keyCode;
    var r = false;
    var autocompleteActive = this.autocomplete_input.autocomplete("widget").is(":visible");
    if(autocompleteActive) {
      switch(symbolicName){
        case "esc":
          this.autocomplete_input.autocomplete("close");
          r = null;
        break;
        case "return":
          this.$simulateAutocompleteKey(keyCode.ENTER);
          r = null;
        break;
        case "up":
          this.$simulateAutocompleteKey(keyCode.UP);
          r = null;
        break;
        case "down":
          this.$simulateAutocompleteKey(keyCode.DOWN);
          r = null;
        break;
      }
    }
    if(symbolicName == "esc") {
    }
    if(r === null){
      // mask input
      return {command: "null"};
    } else {
      return false;
    }
  },

  /**
   * This function is called by keyBinding.
   */
  handleKeyboard: function(data, hashId, key) {
    var keyArray = [];
    if (hashId & 1) keyArray.push("ctrl");
    if (hashId & 8) keyArray.push("command");
    if (hashId & 2) keyArray.push("option");
    if (hashId & 4) keyArray.push("shift");
    if (key)        keyArray.push(key);

    var symbolicName = keyArray.join("-");
    var r = this.$autocompleteBindings(data, symbolicName, hashId, key);
    return r;
  }

};

if(typeof exports != 'undefined'){
  exports.AutocompleteHandler = AutocompleteHandler;
}

