const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use('/static', express.static(__dirname + '/static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(session({
    secret: 'this_Is_A_Prerequistes_Secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*24*14
    }
}));

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
