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
router.get('/login', (req, res) => {
    //dont have to do nothing lol
  
    res.render('invoices/list.html');
});
router.post('/login', (req, res) => {
    //dont have to do nothing lol
  
    res.send(JSON.stringify({
        success :true
    }));
});
router.post('/logout', (req, res) => {
    //dont have to do nothing lol
  
    res.send(JSON.stringify({
        success :true
    }));


});






module.exports = router;
