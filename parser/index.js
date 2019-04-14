const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const db = require('./db');


var instructors = [];
// create an instructo object for people without one
instructos.push({
  "id"   : instructors.length + 1,
  "name" : "TBA"
})
var faculties = [];
var subjects = [];
var courses = [];
var locations = [];
var classes = [];

fs.createReadStream("classdata.csv")
.pipe(csv())
.on('data', function(data){


    try {
      //perform the operation
      getInstructor(data);
      getFaculty(data);
      getSubject(data);
      getCourses(data);
      getTutorial(data);
      getLocation(data);
      getClass(data);

    }
    catch(err) {
        //error handler
        console.log("error");
    }
})
.on('end',function(){
  //some final operation
   //  write all of the tables to the database

   // add all of the instructors
   var instructorQuery = "INSERT INTO instructor(id, name) VALUES "
   var instructorParams = [];
   for(var i=0;i<instructors.length;i++){
     instructorQuery += "($"+(((i+1)*2)-1).toString() +" , $"+((i+1)*2).toString() +")";
     if(i != (instructors.length - 1)){
       instructorQuery += " ,";
     }
     instructorParams.push(instructors[i].id,instructors[i].name);
   }
   instructorQuery += ";"
   db.query(instructorQuery,instructorParams ,(err, result) => {
     if (err) {
       console.log(err);
     } else {
       console.log("worked");
     }
   });

   // add all of the Faculties
   var facultiesQuery = "INSERT INTO AcademicGroup(id, code) VALUES "
   var facultiesParams = [];
   for(var i=0;i<faculties.length;i++){
     facultiesQuery += "($"+(((i+1)*2)-1).toString() +" , $"+((i+1)*2).toString() +")";
     if(i != (faculties.length - 1)){
       facultiesQuery += " ,";
     }
     facultiesParams.push(faculties[i].id,faculties[i].name);
   }
   facultiesQuery += ";"
   console.log(facultiesQuery);
   db.query(facultiesQuery,facultiesParams ,(err, result) => {
     if (err) {
       console.log(err);
     } else {
       console.log("worked");
     }
   });

   // add all of the subjects
   var subjectsQuery = "INSERT INTO subject(id, academicgroupid, code) Values"
   var subjectsParams = [];
   for(var i=0;i<subjects.length;i++){

     subjectsQuery += "($"+(((i+1)*3)-2).toString() +" , $"+(((i+1)*3)-1).toString() +" , $"+((i+1)*3).toString() +")";
     if(i != (subjects.length - 1)){
       subjectsQuery += " ,";
     }
     subjectsParams.push(subjects[i].id,subjects[i].facultiesid,subjects[i].name);
   }
   subjectsQuery += ";"
   console.log(subjectsQuery);
   db.query(subjectsQuery,subjectsParams ,(err, result) => {
     if (err) {
       console.log(err);
     } else {
       console.log("worked");
     }
   });

   var locationsQuery = "INSERT INTO location(id, name) VALUES "
   var locationsParams = [];
   for(var i=0;i<locations.length;i++){
     locationsQuery += "($"+(((i+1)*2)-1).toString() +" , $"+((i+1)*2).toString() +")";
     if(i != (locations.length - 1)){
       locationsQuery += " ,";
     }
     locationsParams.push(locations[i].id,locations[i].name);
   }
   locationsQuery += ";"
   console.log(locationsQuery);
   db.query(locationsQuery,locationsParams ,(err, result) => {
     if (err) {
       console.log(err);
     } else {
       console.log("worked");
     }
   });


   // add all of the courese
   var coursesQuery = "INSERT INTO course(id, subjectid, catalognumber, description, topicdescription, notes, untis, ucalgarycourseid) Values"
   var coursesParams = [];
   for(var i=0;i<courses.length;i++){

     coursesQuery += "($"+(((i+1)*8)-7).toString() +" , $"+(((i+1)*8)-6).toString() +" , $"+(((i+1)*8)-5).toString() +" , $"+(((i+1)*8)-4).toString() +" , $"+(((i+1)*8)-3).toString() +" , $"+(((i+1)*8)-2).toString()+" , $"+(((i+1)*8)-1).toString()+" , $"+((i+1)*8).toString() +")";
     if(i != (courses.length - 1)){
       coursesQuery += " ,";
     }
     //console.log(subjects[i].catalognumber);
     coursesParams.push(courses[i].id,courses[i].subjectid,courses[i].catalognumber,courses[i].description,courses[i].topicDescription,courses[i].notes,courses[i].units,courses[i].UCalgaryCourseID);
   }
   coursesQuery += ";"
   console.log(coursesQuery);
   db.query(coursesQuery,coursesParams ,(err, result) => {
     if (err) {
       console.log(err);
     } else {
       console.log("worked");
     }
   });

   // add all of the classes
   var classesQuery = "INSERT INTO class(id, courseid, instructorid, classtype, section, term, locationid, classroom, roomsize, canenroll,   departnmentconsentrequired, mettingpatternstring, startdate, enddate, starttime, endtime, duration, monday, tuesday, wednesday, thursday, friday, saturday, sunday) Values"
   var classesParams = [];

   for(var i=0;i<classes.length;i++){
     classesQuery += "(";
     for(var j=0;j<24;j++){
       classesQuery += "$"+ (((i+1)*24)-(23-j)).toString()
       if(j<23){
          classesQuery += ",";
       }
     }
     classesQuery += ")";
     if(i != (classes.length - 1)){
       classesQuery += " ,";
     }
     //console.log(subjects[i].catalognumber);
     classesParams.push(classes[i].id,classes[i].courseid,classes[i].instructorid,classes[i].classType,classes[i].section,classes[i].term,classes[i].locationid,classes[i].classRoom,classes[i].roomSize,classes[i].canEnroll,classes[i].departnmentConesent,classes[i].mettingPatternStringatternstring,classes[i].startDate,classes[i].endDate,classes[i].startTime,classes[i].endTime,classes[i].duration,classes[i].monday,classes[i].tuesday,classes[i].wednesday,classes[i].thursday,classes[i].friday,classes[i].saturday,classes[i].sunday);
   }
   classesQuery += ";"
   console.log(classesQuery);
   console.log(classesParams);
   db.query(classesQuery,classesParams ,(err, result) => {
     if (err) {
       console.log(err);
     } else {
       console.log("worked");
     }
   });
});




function getInstructor(row){
  for(var i=0;i<instructors.length;i++){
    if(instructors[i].name == row["Instructor Name and Role"]){
      return;
    }
  }
  if( row["Instructor Name and Role"] != ""){
    instructors.push({
    "id"   : instructors.length + 1,
    "name" : row["Instructor Name and Role"]
  });
  }
}

function getFaculty(row){
  for(var i=0;i<faculties.length;i++){
    if(faculties[i].name == row["Acad Group"]){
      return;
    }
  }
  if( row["Acad Group"] != ""){
    faculties.push({
    "id"   : faculties.length + 1,
    "name" : row["Acad Group"]
  });
  }
}

function getSubject(row){
  //get the faculty for the courses
  var facultiesid = 0;
  for(var i=0;i<faculties.length;i++){
    if(row["Acad Group"] == faculties[i].name){
      facultiesid = faculties[i].id
      break
    }
  }
  if(facultiesid == 0){ // needs a faculty
    return;
  }

  for(var i=0;i<subjects.length;i++){

    if(subjects[i].name == row["Subject"] ){
      return;
    }

  }
  subjects.push({
      "id"   : subjects.length + 1,
      "facultiesid" : facultiesid,
      "name" : row["Subject"]
    });
}


function getCourses(row){
  //check to see if it is a lecture
  if(row["Component"] != "LEC"){
    return;
  }


   // get the subject id
  var subjectid = 0;
  for(var i=0;i<subjects.length;i++){
    if(row["Subject"] == subjects[i].name){
      subjectid = subjects[i].id
      break
    }
  }


  for(var i=0;i<courses.length;i++){
    if(courses[i].catalognumber == row["Course Catalog Nbr"] && courses[i].subjectid == subjectid){
      return;
    }


  }

  // clean up for blank course ids
  if(row["Course ID"] == null){
    row["Course ID"] = 0;
  }
  if( row["Subject"] != ""){
    courses.push({
    "id"   : courses.length + 1,
    "subjectid" :  subjectid,
	  "catalognumber" : row["Course Catalog Nbr"],
	  "description" : row["Course Descr"],
	  "topicDescription" : row["Topic Description"],
	  "notes" : row["Class Notes"],
	  "untis" : row["Crse Units"],
    "lab" : false,
    "tutorial" : false,
	  "UCalgaryCourseID" : parseInt(row["Course ID"])
  });


  console.log(courses[courses.length-1]);

  }

}


function getTutorial(row){
  // if not tutoral or lab
  if(row["Component"] != "TUT" || row["Component"] != "LAB" ){
    return
  }
  //get the course for it and the required
  var subjectid =0;
  for(var i=0;i<subjects.length;i++){
    if(row["Subject"] == subjects[i].name){
      subjectid = subjects[i].id
      break
    }
  }
  //  if there is a tutorial make sure to set the flags on the
  //  course
  for(var i=0;i<courses.length;i++){
    if(row["catalognumber"] == courses[i]["Course Catalog Nbr"] && subjectid == courses[i].subjectid){
      if(row["Component"] == "LAB"){
        courses[i].lab = true;
      }else{
        courses[i].tutorial = true;
      }

    }
  }
}

function getLocation(row){
  for(var i=0;i<locations.length;i++){
    if(locations[i].name == row["Location"]){
      return;
    }
  }
  if( row["Location"] != ""){
    locations.push({
    "id"   : locations.length + 1,
    "name" : row["Location"]
  });
  }

}


function getClass(row){
  var subjectid = 0;
  for(var i=0;i<subjects.length;i++){
    if(row["Subject"] == subjects[i].name){
      subjectid = subjects[i].id
      break
    }
  }
  //get the courseid
  var courseid = 0;
  for(var i=0;i<courses.length;i++){
    if(row["catalognumber"] == courses[i]["Course Catalog Nbr"] && subjectid == courses[i].subjectid){
      courseid = courses[i].id;

    }
  }
  //get the instructor id
  var instructorid = 1;
  for(var i=0;i<instructors.length;i++){
    if(row["Instructor Name and Role"] == instructors[i].name ){
      instructorid  = instructors[i].id;

    }
  }
  //get the location id
  var locationid = 0;
  for(var i=0;i<locations.length;i++){
    if(row["Location"] == locations[i].name ){
      locationid  = locations[i].id;

    }
  }
  if( courseid == 0 || instructorid ==0 || locationid ==0){
    return;
  }
  //  insert some nulls into the time
  if(row["Class Start"] == ""){
    row["Class Start"] = null;
  }
  if(row["Class End"] == ""){
    row["Class End"] = null;
  }
  if(row["Start Date"] == ""){
    row["Start Date"] = null;
  }
  if(row["End Date"] == ""){
    row["End Date"] = null;
  }

  classes.push({
    "id" : classes.length + 1,
      //  shedule information
      "courseid" : courseid,
      "instructorid" : instructorid,
      "locationid" : locationid,
      "classType" : row["Component"],
      "section" : row["Class Section"],
      "term" : row["Term"],
      //  location and enroll info
      "classRoom" : row.Facility,
      "roomSize" : row["Room Size"],
      "canEnroll" : row["Enrol Stat"] == "O",
      "enrollCap" : row["Enroll Cap"],
      "departnmentConesent" : row["Consent"] == "D",

      //  meeting patter info
      "startDate": row["Start Date"],
      "endDate" : row["End Date"],
      "startTime" : row["Class Start"],
      "endTime" : row["Class End"],
      "duration" : row["Duration"],
      "mettingPatternString" : row["Meeting Pattern"],
      "monday" : row["MON"]  == "Y",
      "tuesday" : row["TUES"]  == "Y",
      "wednesday" : row["WED"]  == "Y",
      "thursday" : row["THURS"]  == "Y",
      "friday" : row["FRI"]  == "Y",
      "saturday" : row["SAT"]  == "Y",
      "sunday" : row["SUN"] == "Y"

  });
  console.log(classes.length);



}
