/*
Search Module 
All the supporting functions for the main application of the application
*/
const db = require('../db');
const express = require('express');
var queryBuilder = require('./helpers/queryBuilder');
var router = express.Router();

/*

*/
router.get('/GetInsitutions', (req, res) => {
  //dont have to do nothing lol

  res.send(JSON.stringify({
    success :true
  }));
});




module.exports = router;
