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


router.post('/GetFaculties', (req, res) => {
  //dont have to do nothing lol

  res.send(JSON.stringify({
    items : [{
      img : "https://www.nbn.org.il/wp-content/uploads/2014/01/engineering_mechanical_3042380_cropped.jpg",
      id : 1,
      name: "Engineering"
      }, {
        img :"https://d2ai0ibaxpbki1.cloudfront.net/v2/images/collections/video-music-licensing-collection-optimistic.jpg",
        id : 2,
        name: "Science"
      },{
        img :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwFhPeuIV3Yytxh8z-tkvYDsfYuQcaXG-hYaKR76bl715RBUkw",
        id : 3,
        name: "Fine Arts"
      } ,{
        img :"https://pbs.twimg.com/profile_images/787764476078587904/vcAZZNg1_400x400.jpg",
        id : 4,
        name: "Kinesiology"
      },{
        img :"https://www.dbs.ie/images/default-source/default-album/law-dbs.jpg?sfvrsn=1ee3bee9_1&MaxWidth=680&MaxHeight=&ScaleUp=false&Quality=High&Method=ResizeFitToAreaArguments&Signature=8213D2FDF018878A6EEE96858D640DA49E296056",
        id : 5,
        name: "Law"
      }]
  }));

});

router.post('/GetDepts', (req, res) => {
  //dont have to do nothing lol

  res.send(JSON.stringify({
    items : [{
      img : "https://www.nbn.org.il/wp-content/uploads/2014/01/engineering_mechanical_3042380_cropped.jpg",
      id : 1,
      name: "Computer Science"
      }, {
        img :"https://d2ai0ibaxpbki1.cloudfront.net/v2/images/collections/video-music-licensing-collection-optimistic.jpg",
        id : 2,
        name: "Chemistry"
      },{
        img :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwFhPeuIV3Yytxh8z-tkvYDsfYuQcaXG-hYaKR76bl715RBUkw",
        id : 3,
        name: "Neuroscience"
      } ,{
        img :"https://pbs.twimg.com/profile_images/787764476078587904/vcAZZNg1_400x400.jpg",
        id : 4,
        name: "Biology"
      },{
        img :"https://www.dbs.ie/images/default-source/default-album/law-dbs.jpg?sfvrsn=1ee3bee9_1&MaxWidth=680&MaxHeight=&ScaleUp=false&Quality=High&Method=ResizeFitToAreaArguments&Signature=8213D2FDF018878A6EEE96858D640DA49E296056",
        id : 5,
        name: "Physics"
      }]
  }));

});

router.post('/GetCourses', (req, res) => {
  //dont have to do nothing lol

  res.send(JSON.stringify({
    items : [{
      course : "SENG513",
      name : "Web Based applications",
      info : "This course is taught by Pavlo Escobald",
      id : 1
      }, {
        course : "SENG513",
        name : "Web Based applications",
        info : "This course is taught by Pavlo Escobald",
        id : 2
      },{
        course : "SENG513",
        name : "Web Based applications",
        info : "This course is taught by Pavlo Escobald",
        id : 3
      } ,{
        course : "SENG513",
        name : "Web Based applications",
        info : "This course is taught by Pavlo Escobald",
        id : 4
      },{
        course : "SENG513",
        name : "Web Based applications",
        info : "This course is taught by Pavlo Escobald",
        id : 5
      }]
  }));

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
