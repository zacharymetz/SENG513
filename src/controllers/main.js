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
  db.query("SELECT * FROM public.course INNER JOIN public.department ON public.course.departmentid = public.department.departmentid WHERE public.course.departmentid = $1",[departmentID],(err,result)=>{
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


router.post('/GetSchoolsByText', (req, res) => {
  console.log(req.body);

  // now case insensitive
  db.query("SELECT institutionid, name, shortname, streetnumber, streetname, postalcode, cityid, stateid, countryid, backgroundimage, brandcolor0, brandcolor1, inialized, created_at, logoimage FROM public.institution where cityid = (select cityid from geo.city where lower (name) like lower ($1)) or stateid = (select stateid from geo.state where lower (statename) like lower($2)) or countryid = (select countryid from geo.country where lower(name) like lower($3));", [req.body.cityName, req.body.cityName, req.body.cityName], (err, result) => {
    if (err) {
      //  if there is an error form the sql server with request
      res.send(JSON.stringify({
        success: false,
        message: "db error"
      }));
    } else {
      res.send(JSON.stringify({
        success: true,
        rows: result.rows
      }));
    }

  })

});


// This query will search for courses, it will search for ALL courses in our database:
// examples that will return in our current db
// search for:
// 211 , introduction, techniques, math 
// so will look for keywords in the description

router.post('/searchCoursesByText', (req, res) => {
console.log(req.body);
  var description = "%" + req.body.courseName + "%";
  console.log(description);
  db.query("SELECT * FROM public.department INNER JOIN public.course ON public.department.departmentid = public.course.departmentid Where lower(code) like lower($1) or catalognumber like $2 or lower(description) like lower($3) or lower(topicdescription) like lower($4)", [description, req.body.courseName, description, description],
  (err, result) => {
    if(err){
      res.send(JSON.stringify({
        success: false,
        message: "db error"
      }));
    }else{
      res.send(JSON.stringify({
        success : true,
        row: result.rows
      }));
    }
  })
});




module.exports = router;
