// TODO: Look at cursor.js - use same style?
// Look at default_commands.js for hints on how to take over keys to navigate selection popup while showing...
// Show up automatically for undefined steps
// renderer.textToScreenCoordinates
define(["pilot/canon"], function(canon) {
  var golinedown = canon.getCommand('golinedown').exec;
  var golineup = canon.getCommand('golineup').exec;

  return function(editor) {
    var self = this;

    // Create the suggest list
    var element = document.createElement('ul');
    element.className = 'ace_autocomplete';
    element.style.display = 'none';
    element.style.listStyleType = 'none';
    element.style.padding = '2px';
    element.style.position = 'absolute';
    element.style.zIndex = '1000';
    element.innerHTML = "<li>One</li><li>Two</li><li>Three</li><li>Four</li><li>Five</li>";
    editor.container.appendChild(element);
    
    function focusNext(env, args, request) {
      console.log('next');
    }
    function focusPrev(env, args, request) {
      console.log('prev');
    }
    function hide() {
      // Hide list
      element.style.display = 'none';
      
      // Restore keyboard
      canon.getCommand('golinedown').exec = golinedown;
      canon.getCommand('golineup').exec = golineup;

      self.active = false;
    }
    
    // Shows the list and reassigns up/down keys
    this.activate = function(afterText) {
      if(this.active) return;
      self.active = true;

      // Find the column by searching for afterText on current line
      var range = editor.getSelectionRange();
      range.start.column = 0;
      editor.selection.setSelectionRange(range);
      var Search = require("ace/search").Search;
      editor.$search.set({needle: afterText, scope: Search.SELECTION});
      var foundRange = editor.$search.find(editor.session);
      var column = foundRange.end.column;
      editor.selection.clearSelection();
      
      // Position the list
      var row = range.start.row;
      var coords = editor.renderer.textToScreenCoordinates(row, column);
      element.style.top = coords.pageY + 'px';
      element.style.left = coords.pageX + 'px';      
      element.style.display = 'block';

      // Take over the keyboard
      canon.getCommand('golinedown').exec = focusNext;
      canon.getCommand('golineup').exec   = focusPrev;
      canon.addCommand({
        name: "hideautocomplete",
        bindKey: {win: "Esc", mac: "Esc", sender: "editor"},
        exec: function(env, args, request) {
          hide();
        }
      });
    };
    
    // Sets the text the suggest should be based on.
    // afterText indicates the position where the suggest box should start.
    this.suggest = function(afterText, suggestText) {
      // select current line
    }
  };
});