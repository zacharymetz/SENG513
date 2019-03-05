/*
Pages Module
*/
const db = require('../db');
const express = require('express');
var queryBuilder = require('./helpers/queryBuilder');
var router = express.Router();

/*
  The form
*/
router.get('/inquire', (req, res) => {
  //dont have to do nothing lol

  res.render('invoices/list.html');
});
/*
  Recive the form submission and save it / notify here 
*/
router.post('/sendintrest', (req, res) => {
  //dont have to do nothing lol

  res.send(JSON.stringify({
    success :true
  }));
});



module.exports = router;
