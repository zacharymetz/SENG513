/*
The home page module
*/
const db = require('../db');
const express = require('express');
var queryBuilder = require('./helpers/queryBuilder');
var router = express.Router();

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
      var html = "";
      if (result.rows.length === 0) {
        html = "<div class=\"info\">Sorry, no schools found :(</div>"
      }
      else {
        for(var i=0;i<result.rows.length;i++){
          console.log(result.rows[i].name);
          html +=  '<div class="collectItem">'
          html +=  '  <div>'
          html +=  '    <img id="school-card-'+result.rows[i].institutionid+'" class="barLogo" style="cursor:pointer;" src="/static/img/UofC.png">'
          html +=  '  <div id="school-name-'+result.rows[i].institutionid+'" style="display:none;">'+result.rows[i].name+'</div>'
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
          var facName = result.rows[i].longname.toLowerCase();
          var facImg;
          if (facName.includes("engineer")) facImg = "https://www.nbn.org.il/wp-content/uploads/2014/01/engineering_mechanical_3042380_cropped.jpg";
          else if (facName.includes("science")) facImg = "https://d2ai0ibaxpbki1.cloudfront.net/v2/images/collections/video-music-licensing-collection-optimistic.jpg";
          else if (facName.includes("fine")) facImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwFhPeuIV3Yytxh8z-tkvYDsfYuQcaXG-hYaKR76bl715RBUkw";
          else if (facName.includes("kinesiology")) facImg = "https://pbs.twimg.com/profile_images/787764476078587904/vcAZZNg1_400x400.jpg";
          else if (facName.includes("law")) facImg = "http://village.photos/images/user/9b3ad69f-d70d-4835-aeaa-9ee70e7bef36/24981801-a56b-4284-a4cd-21204c2d7422.jpg";
          else if (facName.includes("business")) facImg = "https://images.freeimages.com/images/large-previews/adf/sun-burst-1478549.jpg";
          else if (facName.includes("veterinary")) facImg = "https://blogs.ufv.ca/science/files/2016/10/WestGen-2016-Awards.png";
          else if (facName.includes("medicine")) facImg = "https://www.intercleanshow.com/-/media/websites/interclean/isa/images/news/isa2018-healthcare-cleaning-1100x400.ashx";
          else if (facName.includes("education")) facImg = "https://cdn20.patchcdn.com/users/22896301/20180813/011024/styles/T800x600/public/processed_images/school_4-1534180194-2580.jpg";
          else if (facName.includes("arts")) facImg = "https://sloanreview.mit.edu/content/uploads/2017/04/Gen-Michelman-End-of-Corporate-Culture-1200-1200x627.jpg";
          else if (facName.includes("nursing")) facImg = "https://demedbook.com/images/2/how-do-clinical-trials-work-and-who-can-participate_7.jpg";
          else if (facName.includes("environmental")) facImg = "https://ariahesaraki.files.wordpress.com/2014/01/skygardenhouse01.jpg";
          else if (facName.includes("social")) facImg = "https://blogs.ufv.ca/swhs/files/2018/03/Hand-tree-purchased-image-from-Marcom-Copy.jpg";
          else facImg = "https://www.fincastleherald.com/wp-content/uploads/2017/08/school_icon_1501655097.png";

          html +=  '<div class="collectItem">'
          html +=  '  <div id="faculty-card-'+result.rows[i].facultyid+'" class="collectImage" style="background-image:url('+facImg+');"></div>'
          html +=  '  <div id="faculty-card-'+result.rows[i].facultyid+'" class="collectName">'+result.rows[i].longname+'</div>'
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
        for(var i=0;i<result.rows.length;i++){
          html +=  '<div class="collectItem">'
          html +=  '  <div id="dept-card-'+result.rows[i].departmentid+'"  class="collectImage" style="background-image:url('+"https://pbs.twimg.com/profile_images/787764476078587904/vcAZZNg1_400x400.jpg"+');"></div>'
          html +=  '  <div id="dept-card-'+result.rows[i].departmentid+'" class="collectName">'+result.rows[i].name+'</div>'
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
        for(var i=0;i<result.rows.length;i++){
          html +=  '<div class="listItem">'
          html +=  '  <div class="courseTopLine">'
          html +=  '    <div class="courseName" id="course-card-'+result.rows[i].courseid+'">'
          html +=  '      <span class="oi oi-chevron-right" title="chevron-right" aria-hidden="true" id="right-Arrow-'+result.rows[i].courseid+'"></span>'
          html +=  '      <span class="oi oi-chevron-bottom" title="chevron-bottom" aria-hidden="true" id="down-Arrow-'+result.rows[i].courseid+'"></span>'
          html +=  '      <span><b class="course-'+result.rows[i].courseid+'" id="course-card-'+result.rows[i].courseid+'">'+result.rows[i].code+' '+result.rows[i].catalognumber+': </b></span>'
          html +=  '      <span id="course-card-'+result.rows[i].courseid+'">'+result.rows[i].topicdescription+'</span>'
          html +=  '    </div>'
          html +=  '    <div class="oi oi-plus" title="plus" aria-hidden="true" id="course-add-'+result.rows[i].courseid+'" ></div>'
          html +=  '  </div>'
          html +=  '  <div class="courseInfo" id="course-info-'+result.rows[i].courseid+'">'+result.rows[i].description+'</div>'
          html +=  '  <div class="courseInfo" id="course-notes-'+result.rows[i].courseid+'">Notes: '+result.rows[i].notes+'</div>'
          html +=  '  <div class="courseBottomLine"></div>'
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
        html +=  '    <img id="school-card-'+result.rows[i].institutionid+'" class="barLogo" style="cursor:pointer;" src="/static/img/UofC.png">'
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
          html +=  '      <span id="course-card-'+result.rows[i].courseid+'">'+result.rows[i].topicdescription+'</span>'
          html +=  '    </div>'
          html +=  '    <div class="oi oi-plus" title="plus" aria-hidden="true" id="course-add-'+result.rows[i].courseid+'" ></div>'
          html +=  '  </div>'
          html +=  '  <div class="courseInfo" id="course-info-'+result.rows[i].courseid+'">'+result.rows[i].description+'</div>'
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

module.exports = router;
