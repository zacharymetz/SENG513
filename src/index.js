const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use('/static', express.static(__dirname + '/static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

var adminGrid = require('./controllers/adminGrid');
var admin = require('./controllers/admin');
var main = require('./controllers/main');

app.use('/admin', admin);
app.use('/adminGrid', adminGrid);
app.use('/', main);

//listen at 3000
http.listen(3000, function(){
  console.log('Server started, listening on *:3000');
});
