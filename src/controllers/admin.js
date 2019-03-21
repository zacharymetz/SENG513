/*
The admin module
*/
const db = require('../db');
const express = require('express');
var queryBuilder = require('./helpers/queryBuilder');
var router = express.Router();

/*

*/
router.get('/', (req, res) => {
  //dont have to do nothing lol



  res.render('admin/index.html');
});
router.get('/auth/login', (req, res) => {
    //dont have to do nothing lol
  
    res.render('admin/login.html');
});
router.post('/auth/login', (req, res) => {
    //dont have to do nothing lol
  
    res.send(JSON.stringify({
        success :true
    }));
});
router.post('/auth/logout', (req, res) => {
    //dont have to do nothing lol
  
    res.send(JSON.stringify({
        success :true
    }));


});



router.get('/setup',(req, res) => {
    //  lets figure out from the cookie what institutions they can setup before they can do anything else 

  
    res.render('admin/setup.html');


});



module.exports = router;
