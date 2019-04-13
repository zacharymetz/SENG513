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
      if (result.rows.length == 0) {
        html = "<div class=\"info\">Sorry, no schools found :(</div>"
      }
      else {
        for(var i=0;i<result.rows.length;i++){
          html +=  '<div class="collectItem">'
          html +=  '  <div>'
          html +=  '    <img id="school-card-'+result.rows[i].institutionid+'" class="barLogo" style="cursor:pointer;" src="/static/img/UofC.png">'
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
      if (result.rows.length == 0) {
        html = "<div class=\"info\">Sorry, no faculties found :(</div>"
      }
      else {
        for(var i=0;i<result.rows.length;i++){
          html +=  '<div class="collectItem">'
          html +=  '  <div id="faculty-card-'+result.rows[i].facultyid+'" class="collectImage" style="background-image:url('+"https://www.nbn.org.il/wp-content/uploads/2014/01/engineering_mechanical_3042380_cropped.jpg"+');"></div>'
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
      if (result.rows.length == 0) {
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
      if (result.rows.length == 0) {
        html = "<div class=\"info\" style=\"color:#4D4D4D;\">Sorry, no courses found :(</div>"
      }
      else {
        for(var i=0;i<result.rows.length;i++){
          html +=  '<div class="listItem">'
          html +=  '  <div class="courseTopLine">'
          html +=  '    <div class="courseName" id="course-card-'+result.rows[i].id+'">'
          html +=  '      <span class="oi oi-chevron-right" title="chevron-right" aria-hidden="true" id="right-Arrow-'+result.rows[i].id+'"></span>'
          html +=  '      <span class="oi oi-chevron-bottom" title="chevron-bottom" aria-hidden="true" id="down-Arrow-'+result.rows[i].id+'"></span>'
          html +=  '      <span><b class="course-'+result.rows[i].id+'" id="course-card-'+result.rows[i].id+'">'+result.rows[i].code+''+result.rows[i].catalognumber+': </b></span>'
          html +=  '      <span id="course-card-'+result.rows[i].id+'">'+result.rows[i].topicdescription+'</span>'
          html +=  '    </div>'
          html +=  '    <div class="oi oi-plus" title="plus" aria-hidden="true" id="course-add-'+result.rows[i].id+'" ></div>'
          html +=  '  </div>'
          html +=  '  <div class="courseInfo" id="course-info-'+result.rows[i].id+'">'+result.rows[i].description+'</div>'
          html +=  '  <div class="courseInfo" id="course-notes-'+result.rows[i].id+'">Notes: '+result.rows[i].notes+'</div>'
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

  db.query("SELECT institutionid, name, shortname, streetnumber, streetname, postalcode, cityid, stateid, countryid, backgroundimage, brandcolor0, brandcolor1, inialized, created_at, logoimage FROM public.institution where cityid = (select cityid from geo.city where name like $1) or 	stateid = (select stateid from geo.state where statename like $2) or countryid = (select countryid from geo.country where name like $3);", [req.body.cityName, req.body.cityName, req.body.cityName], (err, result) => {
    if (err) {
      //  if there is an error form the sql server with request
      res.send(JSON.stringify({
        success: false,
        message: "db error"
      }));
    } else {
      var html = "";
      if (result.rows.length == 0) {
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

/*
router.post('/GetFacultyImg', (req, res) => {
  res.send(JSON.stringify({
    Engineering: "https://www.nbn.org.il/wp-content/uploads/2014/01/engineering_mechanical_3042380_cropped.jpg",
    Science: "https://d2ai0ibaxpbki1.cloudfront.net/v2/images/collections/video-music-licensing-collection-optimistic.jpg",
    FineArts: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwFhPeuIV3Yytxh8z-tkvYDsfYuQcaXG-hYaKR76bl715RBUkw",
    Kinesiology: "https://pbs.twimg.com/profile_images/787764476078587904/vcAZZNg1_400x400.jpg",
    Law: "http://village.photos/images/user/9b3ad69f-d70d-4835-aeaa-9ee70e7bef36/24981801-a56b-4284-a4cd-21204c2d7422.jpg",
    Business: "https://images.freeimages.com/images/large-previews/adf/sun-burst-1478549.jpg",
    Medicine: "https://www.intercleanshow.com/-/media/websites/interclean/isa/images/news/isa2018-healthcare-cleaning-1100x400.ashx",
    Education: "https://cdn20.patchcdn.com/users/22896301/20180813/011024/styles/T800x600/public/processed_images/school_4-1534180194-2580.jpg",
    Arts: "https://sloanreview.mit.edu/content/uploads/2017/04/Gen-Michelman-End-of-Corporate-Culture-1200-1200x627.jpg",
    Nursing: "https://demedbook.com/images/2/how-do-clinical-trials-work-and-who-can-participate_7.jpg",
    VeterinaryMedicine: "https://blogs.ufv.ca/science/files/2016/10/WestGen-2016-Awards.png",
    EnvironmentalDesign: "https://ariahesaraki.files.wordpress.com/2014/01/skygardenhouse01.jpg",
    SocialWork: "https://blogs.ufv.ca/swhs/files/2018/03/Hand-tree-purchased-image-from-Marcom-Copy.jpg",
    default: "https://www.fincastleherald.com/wp-content/uploads/2017/08/school_icon_1501655097.png"
  }));

}); */

module.exports = router;
