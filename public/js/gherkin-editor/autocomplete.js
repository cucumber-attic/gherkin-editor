// TODO: Look at cursor.js - use same style?
// Look at default_commands.js for hints on how to take over keys to navigate selection popup while showing...
// Show up automatically for undefined steps
// renderer.textToScreenCoordinates
define(function() {
  var canon = require("pilot/canon");
  var golinedown = canon.getCommand('golinedown').exec;
  var golineup = canon.getCommand('golineup').exec;

  return function(editor) {
    var self = this;
    var originalOnTextInput = editor.onTextInput;
    
    // Create the suggest list
    var element = document.createElement('ul');
    element.className = 'ace_autocomplete';
    element.style.display = 'none';
    element.style.listStyleType = 'none';
    element.style.padding = '2px';
    element.style.position = 'absolute';
    element.style.zIndex = '1000';
    element.innerHTML = '<li>I make a syntax error</li><li>Two</li><li>Three</li><li>Four</li><li>Five</li>';
    editor.container.appendChild(element);

    function current() {
      var children = element.childNodes;
      for (var i = 0; i < children.length; i++) {
        var li = children[i];
        if(li.className == 'ace_autocomplete_selected') {
          return li;
        }
      };
    }

    function focusNext() {
      var curr = current();
      curr.className = '';
      var focus = curr.nextSibling || curr.parentNode.firstChild;
      focus.className = 'ace_autocomplete_selected';
    }

    function focusPrev() {
      var curr = current();
      curr.className = '';
      var focus = curr.previousSibling || curr.parentNode.lastChild;
      focus.className = 'ace_autocomplete_selected';
    }

    function focusFirst() {
      element.firstChild.className = 'ace_autocomplete_selected';
    }

    function replace() {
      var Range = require('ace/range').Range;
      var range = new Range(self.row, self.column, self.row, self.column + 1000);
      editor.session.replace(range, current().innerText);
      // Deactivate asynchrounously, so that in case of ENTER - we don't reactivate immediately.
      setTimeout(function() {
        deactivate();
      }, 0);
    }

    function deactivate() {
      // Hide list
      element.style.display = 'none';
      
      // Restore keyboard
      canon.getCommand('golinedown').exec = golinedown;
      canon.getCommand('golineup').exec = golineup;
      editor.onTextInput = originalOnTextInput;

      self.active = false;
    }
    
    // Shows the list and reassigns up/down keys
    this.activate = function(afterText) {
      if(this.active) return;

      // Find the column by searching for afterText on current line
      var range = editor.getSelectionRange();
      range.start.column = 0;
      editor.selection.setSelectionRange(range);
      var Search = require("ace/search").Search;
      editor.$search.set({needle: afterText, scope: Search.SELECTION});
      var foundRange = editor.$search.find(editor.session);
      if(foundRange) {
        this.column = foundRange.end.column;
        editor.selection.clearSelection();

        // Position the list
        this.row = range.start.row;
        var coords = editor.renderer.textToScreenCoordinates(this.row, this.column);
        element.style.top = coords.pageY + 'px';
        element.style.left = coords.pageX + 'px';      
        element.style.display = 'block';

        // Select the first one
        focusFirst();

        // Take over the keyboard
        canon.getCommand('golinedown').exec = function(env, args, request) { focusNext(); };
        canon.getCommand('golineup').exec   = function(env, args, request) { focusPrev(); };
        canon.addCommand({
          name: "hideautocomplete",
          bindKey: {win: "Esc", mac: "Esc", sender: "editor"},
          exec: function(env, args, request) {
            deactivate();
          }
        });

        editor.onTextInput = function(text) {
          if(text == '\n') {
            replace();
          } else {
            originalOnTextInput.call(editor, text);
          }
        };
        self.active = true;
      }
    };
    
    // Sets the text the suggest should be based on.
    // afterText indicates the position where the suggest box should start.
    this.suggest = function(afterText, suggestText) {
      // select current line
    }
  };
});