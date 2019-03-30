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

router.post('/GetSchools', (req, res) => {
  //dont have to do nothing lol

  res.send(JSON.stringify({
    items : [{
      img : "UofC.png",
      id : 1
      }, {
        img :"MRoyal.png", id : 2
      },{
        img :"Sait.png",id : 3
      } ,{
        img :"BValley.png", id : 4
      },{
        img :"CDICol.png",id : 5
      }]
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
