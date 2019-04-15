/*
The home page module
*/
const db = require('../db');
const express = require('express');
var queryBuilder = require('./helpers/queryBuilder');
var router = express.Router();
var deptColors = ["#feffd1","#cfd5e2","#cefbf8","#c0a3c4","#d3ffce","#ffb90f","#87cefa","#eeaeee","#cdcd00","#fffafa"]

router.get('/', (req, res) => {
  res.render('main/index.html');
});

router.post('/GetSchools', (req, res) => {
   //dont have to do nothing lol
  var city = req.body.city;
  if(city == null){
    city = "calgary";
  }
  db.query("SELECT *, (select location from file where fileid=logoimage) as \"logo\",(select location from file where fileid=backgroundimage) FROM public.institution where cityid = (select cityid from geo.city where name = $1);",[city],(err,result)=>{
    if(err){
      //  if there is an error form the sql server with request
      res.send(JSON.stringify({
        success : false,
        message : "db error"
      }));
    }else{
      //console.log(result.rows);
      var html = "";
      if (result.rows.length === 0) {
        html = "<div class=\"info\">Sorry, no schools found :(</div>"
      }
      else {
        for(var i=0;i<result.rows.length;i++){
          html +=  '<div class="collectItem">'
          html +=  '  <div>'
          html +=  '    <img id="school-card-'+result.rows[i].institutionid+'" class="barLogo" style="cursor:pointer;" src="'+result.rows[i].logo+'">'
          html +=  '    <div id="school-name-'+result.rows[i].institutionid+'" style="display:none;">'+result.rows[i].name+'</div>'
          html +=  '    <div id="school-color-'+result.rows[i].institutionid+'" style="display:none;">'+result.rows[i].brandcolor0+'</div>'
          html +=  '  </div>'
          html +=  '</div>'
        }
      }
      res.send(JSON.stringify({
        success : true,
        rows : result.rows,
        html: html
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
      var html = "";
      if (result.rows.length === 0) {
        html = "<div class=\"info\">Sorry, no faculties found :(</div>"
      }
      else {
        for(var i=0;i<result.rows.length;i++){
          var facName = result.rows[i].facultycode;
          var facImg;
          if (facName.includes("EN")) {
            facName = "Engineering";
            facImg = "https://www.nbn.org.il/wp-content/uploads/2014/01/engineering_mechanical_3042380_cropped.jpg";
          }
          else if (facName.includes("SC")) {
            facName = "Science";
            facImg = "https://d2ai0ibaxpbki1.cloudfront.net/v2/images/collections/video-music-licensing-collection-optimistic.jpg";
          }
          else if (facName.includes("KN")) {
            facName = "Kinesiology";
            facImg = "https://pbs.twimg.com/profile_images/787764476078587904/vcAZZNg1_400x400.jpg";
          }
          else if (facName.includes("LA")) {
            facName = "Law";
            facImg = "http://village.photos/images/user/9b3ad69f-d70d-4835-aeaa-9ee70e7bef36/24981801-a56b-4284-a4cd-21204c2d7422.jpg";
          }
          else if (facName.includes("VM")) {
            facName = "Veterinary Medicine";
            facImg = "https://blogs.ufv.ca/science/files/2016/10/WestGen-2016-Awards.png";
          }
          else if (facName.includes("MD")) {
            facName = "Medicine";
            facImg = "https://www.intercleanshow.com/-/media/websites/interclean/isa/images/news/isa2018-healthcare-cleaning-1100x400.ashx";
          }
          else if (facName.includes("ED")) {
            facName = "Education";
            facImg = "https://cdn20.patchcdn.com/users/22896301/20180813/011024/styles/T800x600/public/processed_images/school_4-1534180194-2580.jpg";
          }
          else if (facName.includes("AR")) {
            facName = "Arts";
            facImg = "https://sloanreview.mit.edu/content/uploads/2017/04/Gen-Michelman-End-of-Corporate-Culture-1200-1200x627.jpg";
          }
          else if (facName.includes("NU")) {
            facName = "Nursing";
            facImg = "https://demedbook.com/images/2/how-do-clinical-trials-work-and-who-can-participate_7.jpg";
          }
          else if (facName.includes("EV")) {
            facName = "Environmental Design";
            facImg = "https://ariahesaraki.files.wordpress.com/2014/01/skygardenhouse01.jpg";
          }
          else if (facName.includes("SW")) {
            facName = "Social Work";
            facImg = "https://blogs.ufv.ca/swhs/files/2018/03/Hand-tree-purchased-image-from-Marcom-Copy.jpg";
          }
          else if (facName.includes("RO")) {
            facName = "Research";
            facImg = "https://sloanreview.mit.edu/content/uploads/2018/09/GEN-Faro-Marketing-Market-Research-Big-Data-Analysis-1200.jpg";
          }
          else facImg = "https://www.fincastleherald.com/wp-content/uploads/2017/08/school_icon_1501655097.png";

          html +=  '<div class="collectItem">'
          html +=  '  <div id="faculty-card-'+result.rows[i].facultyid+'" class="collectImage" style="background-image:url('+facImg+');"></div>'
          html +=  '  <div id="faculty-card-'+result.rows[i].facultyid+'" class="collectName">'+facName+'</div>'
          html +=  '</div>'
        }
      }
      res.send(JSON.stringify({
        success : true,
        rows : result.rows,
        html: html
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
      var html = "";
      if (result.rows.length === 0) {
        html = "<div class=\"info\">Sorry, no departments found :(</div>"
      }
      else {
        var colorIndex = 0;
        for(var i=0;i<result.rows.length;i++){
          html +=  '<div class="collectItem">'
          html +=  '  <div id="dept-card-'+result.rows[i].departmentid+'"  class="collectImage" style="background-color:'+deptColors[colorIndex]+';">'
          html +=  '    <div id="dept-name-'+result.rows[i].departmentid+'" class="deptName"><b id="dept-text-'+result.rows[i].departmentid+'">'+result.rows[i].code+'</b></div>'
          html +=  '  </div>'
          html +=  '</div>'
          colorIndex++;
          if (colorIndex > (deptColors.length - 1)) colorIndex = 0;
        }
      }
      res.send(JSON.stringify({
        success : true,
        rows : result.rows,
        html: html
      }));
    }

  })
});

router.post('/GetCourses', (req, res) => {
  var city= req.body.clientCity;
  var schoolID= req.body.schoolID;
  var facultyID= req.body.facultyID;
  var departmentID= req.body.departmentID;
  //console.log(departmentID);
  db.query("SELECT * FROM public.course INNER JOIN public.department ON public.course.departmentid = public.department.departmentid WHERE public.course.departmentid = $1",[departmentID],(err,result)=>{
    if(err){
      //  if there is an error form the sql server with request
      res.send(JSON.stringify({
        success : false,
        message : "db error"
      }));
    }else{
      var html = "";
      if (result.rows.length === 0) {
        html = "<div class=\"info\" style=\"color:#4D4D4D;\">Sorry, no courses found :(</div>"
      }
      else {
        //console.log(result.rows.length);
        var coursesDisplayed = [];
        for(var i=0;i<result.rows.length;i++){
          if (coursesDisplayed.includes(result.rows[i].catalognumber)) continue;
          else coursesDisplayed.push(result.rows[i].catalognumber);
          html +=  '<div class="listItem">'
          html +=  '  <div class="courseTopLine">'
          html +=  '    <div class="courseName" id="course-card-'+result.rows[i].courseid+'">'
          html +=  '      <span class="oi oi-chevron-right" title="chevron-right" aria-hidden="true" id="right-Arrow-'+result.rows[i].courseid+'"></span>'
          html +=  '      <span class="oi oi-chevron-bottom" title="chevron-bottom" aria-hidden="true" id="down-Arrow-'+result.rows[i].courseid+'"></span>'
          html +=  '      <span><b class="course-'+result.rows[i].courseid+'" id="course-card-'+result.rows[i].courseid+'">'+result.rows[i].code+' '+result.rows[i].catalognumber+': </b></span>'
          html +=  '      <span id="course-card-'+result.rows[i].courseid+'">'+result.rows[i].description+'</span>'
          html +=  '    </div>'
          html +=  '    <div class="oi oi-plus" title="plus" aria-hidden="true" id="course-add-'+result.rows[i].courseid+'" ></div>'
          html +=  '  </div>'
          html +=  '  <div class="courseInfo" id="course-info-'+result.rows[i].courseid+'">'+result.rows[i].topicdescription+'</div>'
          html +=  '  <div class="courseInfo" id="course-notes-'+result.rows[i].courseid+'">Notes: '+result.rows[i].notes+'</div>'
          html +=  '  <div class="courseBottomLine"></div>'
          html +=  '</div>'
        }
      }
      console.log(result.rows);
      res.send(JSON.stringify({
        success : true,
        rows : result.rows,
        html: html
      }));
    }
  })
});

router.post('/GetSchoolsByText', (req, res) => {

  db.query("SELECT institutionid, name, shortname, streetnumber, streetname, postalcode, cityid, stateid, countryid, backgroundimage, brandcolor0, brandcolor1, inialized, created_at, logoimage FROM public.institution where cityid = (select cityid from geo.city where lower (name) like lower ($1)) or stateid = (select stateid from geo.state where lower (statename) like lower($2)) or countryid = (select countryid from geo.country where lower(name) like lower($3));", [req.body.cityName, req.body.cityName, req.body.cityName], (err, result) => {
    if (err) {
      //  if there is an error form the sql server with request
      res.send(JSON.stringify({
        success: false,
        message: "db error"
      }));
    } else {
      var html = "";
      if (result.rows.length === 0) {
        html = "<div class=\"info\">Sorry, no schools found :(</div>"
      }
      for(var i=0;i<result.rows.length;i++){
        html +=  '<div class="collectItem">'
        html +=  '  <div>'
        html +=  '    <img id="school-card-'+result.rows[i].institutionid+'" class="barLogo" style="cursor:pointer;" src="'+result.rows[i].logo+'">'
        html +=  '    <div id="school-name-'+result.rows[i].institutionid+'" style="display:none;">'+result.rows[i].name+'</div>'
        html +=  '    <div id="school-color-'+result.rows[i].institutionid+'" style="display:none;">'+result.rows[i].brandcolor0+'</div>'
        html +=  '  </div>'
        html +=  '</div>'
      }
      res.send(JSON.stringify({
        success: true,
        rows: result.rows,
        html: html
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
  var description = "%" + req.body.courseName + "%";
  //console.log(description);
  db.query("SELECT * FROM public.department INNER JOIN public.course ON public.department.departmentid = public.course.departmentid Where lower(code) like lower($1) or catalognumber like $2 or description like $3 or topicdescription like $4", [description, req.body.courseName, description, description],
  (err, result) => {
    if(err){
      res.send(JSON.stringify({
        success: false,
        message: "db error"
      }));
    }else{
      var html = "";
      if (result.rows.length === 0) {
        html = "<div class=\"info\" style=\"color:#4D4D4D;\">Sorry, no courses found :(</div>"
      }
      else {
        for(var i=0;i<result.rows.length;i++){
          html +=  '<div class="listItem">'
          html +=  '  <div class="courseTopLine">'
          html +=  '    <div class="courseName" id="course-card-'+result.rows[i].courseid+'">'
          html +=  '      <span class="oi oi-chevron-right" title="chevron-right" aria-hidden="true" id="right-Arrow-'+result.rows[i].courseid+'"></span>'
          html +=  '      <span class="oi oi-chevron-bottom" title="chevron-bottom" aria-hidden="true" id="down-Arrow-'+result.rows[i].courseid+'"></span>'
          html +=  '      <span><b class="course-'+result.rows[i].courseid+'" id="course-card-'+result.rows[i].courseid+'">'+result.rows[i].code+' '+result.rows[i].catalognumber+': </b></span>'
          html +=  '      <span id="course-card-'+result.rows[i].courseid+'">'+result.rows[i].description+'</span>'
          html +=  '    </div>'
          html +=  '    <div class="oi oi-plus" title="plus" aria-hidden="true" id="course-add-'+result.rows[i].courseid+'" ></div>'
          html +=  '  </div>'
          html +=  '  <div class="courseInfo" id="course-info-'+result.rows[i].courseid+'">'+result.rows[i].topicdescription+'</div>'
          html +=  '  <div class="courseInfo" id="course-notes-'+result.rows[i].courseid+'">Notes: '+result.rows[i].notes+'</div>'
          html +=  '  <div class="courseBottomLine"></div>'
          html +=  '</div>'
        }
      }
      res.send(JSON.stringify({
        success : true,
        rows: result.rows,
        html: html
      }));
    }
  })
});

router.post('/inquireform', (req, res) => {

  // send call to aws lambda 
  var lambda = new AWS.Lambda({region: REGION, apiVersion: '2015-03-31'});
  // create JSON object for parameters for invoking Lambda function
  var pullParams = {
    FunctionName : 'appDataAccess',
    InvocationType : 'RequestResponse',
    LogType : 'None',
    payload : {
      //  this is where all the form data to send to aws will go
    }
  };
  // create variable to hold data returned by the Lambda function

  lambda.invoke(pullParams, function(error, data) {
    if (error) {
      prompt(error);
      res.send(JSON.stringify({
        //  this will run if aws lambda retruns an error to us and we can let the front end know
        success : false,
        message : ""
      }));
    } else {
      var pullResults = JSON.parse(data.Payload);
      res.send(JSON.stringify({
        //  the json that gets send back to front when it was sucessful 
        success : true
      }));
    }
  });
  
});


module.exports = router;
