const express = require('express');
const nunjucks = require('nunjucks');

const bodyParser = require('body-parser');

const app = express();
app.use('/static', express.static(__dirname + '/static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



nunjucks.configure('views', {
  autoescape: true,
  express: app
});

var adminGrid = require('./controllers/adminGrid');
var admin = require('./controllers/admin');
var pages = require('./controllers/pages');
var search = require('./controllers/search');


app.use('/admin', admin);
app.use('/adminGrid', adminGrid);
app.use('/pages', pages);
app.use('/', search);

//listen at 3000
app.listen(3000, () => console.log('server started'));
