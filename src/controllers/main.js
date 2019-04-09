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
  var city = req.body.city;
  if(city == null){
    city = "calgary";
  }
  db.query("SELECT * FROM public.institution where cityid = (select cityid from geo.city where name = $1);",[city],(err,result)=>{
    if(err){
      //  if there is an error form the sql server with request
      res.send(JSON.stringify({
        success : false,
        message : "db error"
      }));
    }else{
      //
      res.send(JSON.stringify({
        success : true,
        rows : result.rows
      }));
    }

  })
});


router.post('/GetFaculties', (req, res) => {
  var city = req.body.city;
  var schoolID = req.body.schoolID;
  //dont have to do nothing lol
  db.query("SELECT * FROM public.faculty WHERE insitutionid = $1",[schoolID],(err,result)=>{
    if(err){
      //  if there is an error form the sql server with request
      res.send(JSON.stringify({
        success : false,
        message : "db error"
      }));
    }else{
      res.send(JSON.stringify({
        success : true,
        rows : result.rows
      }));
    }

  })
});

router.post('/GetDepts', (req, res) => {
  //dont have to do nothing lol
  var city = req.body.city;
  var schoolID = req.body.schoolID;
  var facultyID = req.body.facultyID;

  db.query("SELECT * FROM public.department WHERE facultyid = $1",[facultyID],(err,result)=>{
    if(err){
      //  if there is an error form the sql server with request
      res.send(JSON.stringify({
        success : false,
        message : "db error"
      }));
    }else{
      res.send(JSON.stringify({
        success : true,
        rows : result.rows
      }));
    }

  })
});

router.post('/GetCourses', (req, res) => {
  var city= req.body.clientCity;
  var schoolID= req.body.schoolID;
  var facultyID= req.body.facultyID;
  var departmentID= req.body.departmentID;
  console.log(departmentID);
  db.query("SELECT * FROM public.course WHERE departmentid = $1",[departmentID],(err,result)=>{
    if(err){
      //  if there is an error form the sql server with request
      res.send(JSON.stringify({
        success : false,
        message : "db error"
      }));
    }else{
      res.send(JSON.stringify({
        success : true,
        rows : result.rows
      }));
    }

  })

});


module.exports = router;
