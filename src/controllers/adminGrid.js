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






router.post('/NewInstitution',(req,res)=>{
  var body = req.body;
  //  pretty much we need to create the insitution 
  var sql_string = "INSERT INTO public.institution(name,  inialized, created_at) VALUES ( $1, false, now()) returning institutionid;";

  var sql_params = [body.institutionName];
  db.query(sql_string,sql_params ,(err, result) => {
    if (err) {
      console.log(err.stack);
      res.send(JSON.stringify({
          success : false,
          message : "Insitution could not be created"
      }));
    } else {
      //  i think it was created so now we can create teh started account for the person and generate a password 
      //  ( which for now will be returned )
      var accountString = "INSERT INTO public.account( email, passworddigest, firstname, lastname, phonenumber, created_at) VALUES ($1, $2, $3, $4,  $5,now()) returning accountid";
      var accountParams = [body.email,"test123",body.firstName,body.lastName,0];
      db.query(accountString,accountParams ,(err1, result1) => {
        if (err1) {
          console.log(err1.stack);
          res.send(JSON.stringify({
              success : false,
              message : "Insitution was created but inital account was not, please go to accounts and create a new one there"
          }));
        } else {

          //  before everything is done we also need to take the retuned value 
          var premissionsString = "INSERT INTO public.accountinstitution(accountid, institutionid) VALUES ( $1, $2);"
          
          var premissionParams = [result1.rows[0].accountid,result.rows[0].institutionid];
          console.log(premissionParams);
          db.query(premissionsString,premissionParams ,(err2, result2) => { 
            if (err2) {
              console.log(err1.stack);
              res.send(JSON.stringify({
                  success : false,
                  message : "Insitution and account was created but permissions could not be initalized, please go to accounts and create a new one there"
              }));
            } else {
              //  everything is super dope
              res.send(JSON.stringify({
                success : true
            }));
            }
    
          });
          
          
        }
      });
    }
  });
  
});



router.post('/GetAccounts',(req,res)=>{
  var query = req.body;
  var validSortFeilds = ["firstname","lastname"];
  

  var queryOptions = queryBuilder.jsGridQueryBuilder("account", query, validSortFeilds,null);
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
          console.log(result.rows);
          res.send(JSON.stringify({
              data: result.rows,
              itemsCount: numberOfItems
          }));
        }
      });
});

router.post('/GetInstitutions',(req,res)=>{
  var query = req.body;
  var validSortFeilds = ["name"];
  
 
  var queryOptions = queryBuilder.jsGridQueryBuilder("institution", query, validSortFeilds,null);
  console.log(queryOptions);
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

//  will return the insitution features if the user has access to an insitution
router.post('/GetInstitutionFeatures',(req,res)=>{
    db.query("select * from insititution innerjoin accountinstitution on accountinstitution.institutionid institution.institutionid where accountinstitution.accountid = $1 ", [req.session.accountid] ,(err, result) => {
        if (err) {
          console.log(err.stack);
          res.send(JSON.stringify({
              d: false
          }));
        } else {
          res.send(JSON.stringify(result.rows[0]));
        }
      });
});


//  routes pertaining too 



module.exports = router;
