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
router.get('/admin/login', (req, res) => {
    //dont have to do nothing lol
  
    res.render('invoices/list.html');
});
router.post('/admin/login', (req, res) => {
    //dont have to do nothing lol
  
    res.send(JSON.stringify({
        success :true
    }));
});
router.post('/admin/logout', (req, res) => {
    //dont have to do nothing lol
  
    res.send(JSON.stringify({
        success :true
    }));


});



module.exports = router;
