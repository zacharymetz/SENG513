/*
The home page module
*/
const db = require('../db');
const express = require('express');
var queryBuilder = require('./helpers/queryBuilder');
var router = express.Router();

/*

*/
router.get('/', (req, res) => {
  res.render('main/index.html');
});

router.post('/GetInsitutions', (req, res) => {
  //dont have to do nothing lol

  res.send(JSON.stringify({
    success :true,
    listofuniversities :["calgary","edmonton"]
  }));
});



/*
router.post('/admin/logout', (req, res) => {
    //dont have to do nothing lol

    res.send(JSON.stringify({
        success :true
    }));


}); */



module.exports = router;
