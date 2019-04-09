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


//setUpSocket(http,io);
io.on('connection', function(socket){
  socket.on('disconnect', function(){
  });

  socket.on('syncList', function(userStorage){
    console.log(userStorage);
    io.emit('syncList', userStorage);
  });

  socket.on('updateList', function(userStorage){
    console.log(userStorage);
    io.emit('updateList', userStorage);
  });
});

//listen at 3000
http.listen(3000, function(){
  console.log('Server started, listening on *:3000');
});

//module.exports.io = io;
