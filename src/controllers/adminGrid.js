/*
The admin module
*/
const db = require('../db');
const express = require('express');
var queryBuilder = require('./helpers/queryBuilder');
var router = express.Router();

/*

*/

router.post('/GetFaculty', (req, res) => {
    //dont have to do nothing lol
    var query = req.body;

    //  need to add sorts up here since can do sql injections if not
    //  to stop sql injections we need to check the feilds
    var validSortFeilds = ["code","longname"];

    var queryOptions = queryBuilder.jsGridQueryBuilder("academicgroup", query, validSortFeilds);
    db.query(queryOptions[0],queryOptions[1] ,(err, result) => {

        if (err) {
          console.log(err.stack);
          res.send(JSON.stringify({
              d: false
          }));
        } else {
          var numberOfItems = 0;
          if(result.rows[0]){
            numberOfItems = result.rows[0].itemsnumber
          }
          res.send(JSON.stringify({
              data: result.rows,
              itemsCount: numberOfItems
          }));
        }
      });
    
});
router.post('/GetDepartment', (req, res) => {
    //dont have to do nothing lol
    var query = req.body;

    //  need to add sorts up here since can do sql injections if not
    //  to stop sql injections we need to check the feilds
    var validSortFeilds = ["code","name"];
    var innerJoin = {  // inner join on the departments table so we can display the name of the department instead o fhte id 
        columns : [
          "longname"
        ],
        query: " inner join academicgroup on subject.academicgroupid = academicgroup.academicgroupid "
      };
    

    var queryOptions = queryBuilder.jsGridQueryBuilder("subject", query, validSortFeilds,innerJoin);
    db.query(queryOptions[0],queryOptions[1] ,(err, result) => {

        if (err) {
          console.log(err.stack);
          res.send(JSON.stringify({
              d: false
          }));
        } else {
          var numberOfItems = 0;
          if(result.rows[0]){
            numberOfItems = result.rows[0].itemsnumber
          }
          res.send(JSON.stringify({
              data: result.rows,
              itemsCount: numberOfItems
          }));
        }
      });
    
});




router.post('/GetCountries', (req, res) => {
  var query = req.body;
  var validSortFeilds = ["name"];
  var queryOptions = queryBuilder.jsGridQueryBuilder("country", query, validSortFeilds,null,"geo");
    db.query(queryOptions[0],queryOptions[1] ,(err, result) => {
        if (err) {
          console.log(err.stack);
          res.send(JSON.stringify({
              d: false
          }));
        } else {
          var numberOfItems = 0;
          if(result.rows[0]){
            numberOfItems = result.rows[0].itemsnumber
          }
          res.send(JSON.stringify({
              data: result.rows,
              itemsCount: numberOfItems
          }));
        }
      });

});

router.post('/GetStates', (req, res) => {
  var query = req.body;
  var validSortFeilds = ["name"];
  var innerJoin = {  // inner join on the departments table so we can display the name of the department instead o fhte id 
    columns : [
      "countryid"
    ],
    query: " inner join geo.country on geo.state.countryid = geo.country.countryid "
  };

  var queryOptions = queryBuilder.jsGridQueryBuilder("state", query, validSortFeilds,innerJoin,"geo");
    db.query(queryOptions[0],queryOptions[1] ,(err, result) => {
        if (err) {
          console.log(err.stack);
          res.send(JSON.stringify({
              d: false
          }));
        } else {
          var numberOfItems = 0;
          if(result.rows[0]){
            numberOfItems = result.rows[0].itemsnumber
          }
          res.send(JSON.stringify({
              data: result.rows,
              itemsCount: numberOfItems
          }));
        }
      });
  
});

router.post('/GetCities', (req, res) => {
  var query = req.body;
  var validSortFeilds = ["name"];
  

  var queryOptions = queryBuilder.jsGridQueryBuilder("city", query, validSortFeilds,null,"geo");
    db.query(queryOptions[0],queryOptions[1] ,(err, result) => {
        if (err) {
          console.log(err.stack);
          res.send(JSON.stringify({
              d: false
          }));
        } else {
          var numberOfItems = 0;
          if(result.rows[0]){
            numberOfItems = result.rows[0].itemsnumber
          }
          res.send(JSON.stringify({
              data: result.rows,
              itemsCount: numberOfItems
          }));
        }
      });
  
});
















//  routes pertaining too 



module.exports = router;
