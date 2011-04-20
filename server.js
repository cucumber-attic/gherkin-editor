#!/usr/bin/env node

var app = require('express').createServer();
var dust = require('express-dust');

dust.makeBase({
  copy: '&copy; 2011 Nobody LLC'
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
console.log('App listening at: http://localhost:8000/');
