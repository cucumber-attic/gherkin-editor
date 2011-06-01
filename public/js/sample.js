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
    stepdefs: {
      'I make a syntax error' : [],
      'I have (\\d+) cukes in my belly' : [],
      'I have eaten all the cukes' : [],
      '^stuff should be (.*)' : 
				['stuff should be blue',
				'stuff should be green',
				'stuff should be red']
    }
  });
});
