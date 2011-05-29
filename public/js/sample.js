require(['jquery', 'gherkin-editor'], function($) {
  function callback(editor) {
    require(['ace/theme-twilight'], function() {
      editor.setTheme("ace/theme/twilight");
      editor.getSession().setTabSize(2);
      editor.getSession().setUseSoftTabs(true);
    });
  }

  $('#editor').gherkinEditor({
    callback: callback,
    stepdefs: [
    ]
  });
});
