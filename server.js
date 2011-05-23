require.paths.unshift(__dirname + '/vendor/ace/build/src');

var express = require('express');
var app = express.createServer();
var dust = require('express-dust');

app.configure(function() {
  app.use(express.logger());
  app.use(express.static(__dirname + '/public'));
  app.use(require('ace-connect')('/js/ace'));
  app.use(require('./lib/connect').connect('/js/ge'));
  app.use(require('gherkin').connect('/js'));
});

dust.makeBase({
  copy: '&copy; 2011 Cucumber'
});

app.get('/', function(req, res, next) {
  res.render('index', {
    title: 'This is a test'
  });
});

app.get('/partial', function(req, res, next) {
  res.partial('nav');
});

app.get('/partial_html', function(req, res, next) {
  res.partial('nav', function(err, html) {
    res.send(html);
  });
});

app.listen(8000);
console.log('Gherkin Editor listening at: http://localhost:8000/');
