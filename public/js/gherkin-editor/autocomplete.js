define(["pilot/canon","ace/ace"], function(canon) {
  var golinedown = canon.getCommand('golinedown').exec;
  var golineup = canon.getCommand('golineup').exec;

  return function(editor, matches) {
    var self = this;
    var originalOnTextInput = editor.onTextInput;
    var originalSoftTabs = editor.session.getUseSoftTabs();
    
    // Create the suggest list
    var element = document.createElement('ul');
    element.className = 'ace_autocomplete';
    element.style.display = 'none';
    element.style.listStyleType = 'none';
    element.style.padding = '2px';
    element.style.position = 'fixed';
    element.style.zIndex = '1000';
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

    function ensureFocus() {
      if(!current()) {
        element.firstChild.className = 'ace_autocomplete_selected';
      }
    }

    function replace() {
      var Range = require('ace/range').Range;
      var range = new Range(self.row, self.column, self.row, self.column + 1000);
      // Firefox does not support innerText property, don't know about IE
      // http://blog.coderlab.us/2005/09/22/using-the-innertext-property-with-firefox/
      var selectedValue;
      if(document.all){
        selectedValue = current().innerText;
      } else{
        selectedValue = current().textContent;
      }

      editor.session.replace(range, selectedValue);
      // Deactivate asynchrounously, so that in case of ENTER - we don't reactivate immediately.
      setTimeout(function() {
        deactivate();
      }, 0);
    }

    function deactivate() {
      // Hide list
      element.style.display = 'none';
      
      // Restore keyboard
      editor.session.setUseSoftTabs(originalSoftTabs);
      canon.getCommand('golinedown').exec = golinedown;
      canon.getCommand('golineup').exec = golineup;
      editor.onTextInput = originalOnTextInput;

      self.active = false;
    }
    
    // Shows the list and reassigns keys
    this.activate = function(row, column) {
      if(this.active) return;
      this.active = true;
      this.row = row;
      this.column = column;

      // Position the list
      var coords = editor.renderer.textToScreenCoordinates(row, column);
      element.style.top = coords.pageY + 2 + 'px';
      element.style.left = coords.pageX + -2 + 'px';
      element.style.display = 'block';

      // Take over the keyboard
      editor.session.setUseSoftTabs(false);
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
        if(text == '\n' || text == '\t') {
          replace();
        } else {
          originalOnTextInput.call(editor, text);
        }
      };
    };
    
    // Sets the text the suggest should be based on.
    // afterText indicates the position where the suggest box should start.
    this.suggest = function(text) {
      var options = matches(text);
      if(options.length == 0) {
        return deactivate();
      }
      var html = '';
      for(var n in options) {
        html += '<li>' + options[n] + '</li>';
      }
      element.innerHTML = html;
      ensureFocus();
    }
  };
});
