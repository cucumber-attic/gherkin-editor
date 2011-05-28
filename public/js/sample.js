require(['jquery', 'gherkin-editor'], function($) {
  $('#editor').gherkinEditor(function(editor) {
    require(['ace/theme-twilight'], function() {
      editor.setTheme("ace/theme/twilight");
      editor.getSession().setTabSize(2);
      editor.getSession().setUseSoftTabs(true);
    });
  });
});
