/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Julian Viereck (julian.viereck@gmail.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define("gherkin-editor/autocomplete",["require","exports","module"],function(require, exports, module) {


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
    // If we pressed any command key but no other key, then ignore the input.
    // Otherwise "shift-" is added to the buffer, and later on "shift-g"
    // which results in "shift-shift-g" which doesn't make senese.
    if (hashId != 0 && (key == "" || String.fromCharCode(0))) {
      return null;
    }

    // Compute the current value of the keyboard input buffer.
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

exports.AutocompleteHandler = AutocompleteHandler;

});
