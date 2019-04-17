/*
The admin module
*/
const db = require('../db');
const express = require('express');
var queryBuilder = require('./helpers/queryBuilder');
var router = express.Router();


/*

*/

// Configure AWS SDK for JavaScript
var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: 'akid', secretAccessKey: 'EzdhQMKgZW7ilM7/1NHmKvJ47TLZQymze935vBM/'});


//Paul
const fs = require('fs');
const multer = require('multer');
const csv = require('fast-csv');
const path = require('path'); //poth for connecting
const csv1 = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const upload = multer({ dest: 'tmp/csv/' });
const uploadImage = multer({ dest: 'static/uploaded/' });
router.use(express.static(path.join(__dirname, 'public')));


router.post('/GetFaculty', (req, res) => {
    //dont have to do nothing lol
    var query = req.body;

    //  need to add sorts up here since can do sql injections if not
    //  to stop sql injections we need to check the feilds
    var validSortFeilds = ["facultycode","longname"];

    var queryOptions = queryBuilder.jsGridQueryBuilder("faculty", query, validSortFeilds);
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
router.post('/UpdateFaculty', (req, res) => {
  //dont have to do nothing lol
  var query = req.body;
  console.log([query.code,query.longname,query.facultyid]);
 var sql_query = "UPDATE public.faculty SET facultycode=$1, longname=$2 WHERE facultyid=$3"

  db.query(sql_query,[query.facultycode,query.longname,query.facultyid] ,(err, result) => {
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

router.post('/CreateFaculty', (req, res) => {
  //dont have to do nothing lol
  var query = req.body;

  //  need to add sorts up here since can do sql injections if not
  //  to stop sql injections we need to check the feilds
  
  var sqlQurey = "INSERT INTO public.faculty(facultycode, longname, insitutionid) VALUES ($1, $2, $3) retuning *;";
  db.query(sqlQurey,[query.facultycode,query.longname,query.institutionid],(err, result) => {

      if (err) {
        console.log(err.stack);
        res.send(JSON.stringify({
            d: false
        }));
      } else {
        if(query.image != null){

        }
        res.send(JSON.stringify({
            data: result.rows
        }));
      }
    });

});
router.post('/GetDepartment', (req, res) => {
    //dont have to do nothing lol
    var query = req.body;

    //  need to add sorts up here since can do sql injections if not
    //  to stop sql injections we need to check the feilds
    var validSortFeilds = ["code","name","facultyid"];
    query.facultyid = '';
    console.log("THIS IS THE PORBLEMS", query);

    var innerJoin = {  // inner join on the departments table so we can display the name of the department instead o fhte id
        columns : [
          "*"
        ],
        query: " inner join faculty on department.facultyid = faculty.facultyid "
      };


    var queryOptions = queryBuilder.jsGridQueryBuilder("department", query, validSortFeilds,innerJoin);
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
router.post('/UpdateDepartment', (req, res) => {

  var query = req.body;
  console.log([query.facultyid,query.code,query.name,query.departmentid]);
  var sql_string = "UPDATE public.department SET facultyid=$1, code=$2, name=$3 WHERE departmentid=$4 returning *;";
  db.query(sql_string,[query.facultyid,query.code,query.name,query.departmentid] ,(err, result) => {
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

router.post('/GetCourses', (req, res) => {
  //dont have to do nothing lol
  var query = req.body;

  //  need to add sorts up here since can do sql injections if not
  //  to stop sql injections we need to check the feilds
  var validSortFeilds = ["courseid","level","description","code", "catalognumber"];
  var innerJoin = {  // inner join on the departments table so we can display the name of the department instead o fhte id 

      columns : [
        "longname"
      ],
      query: " inner join department on department.departmentid = course.departmentid "
    };


  var queryOptions = queryBuilder.jsGridQueryBuilder("course", query, validSortFeilds,innerJoin);
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

router.post('/UpdateCourse', (req, res) => {
  //dont have to do nothing lol
  var query = req.body;

  //  need to add sorts up here since can do sql injections if not
  //  to stop sql injections we need to check the feilds
  var validSortFeilds = ["code","name"];
  var innerJoin = {  // inner join on the departments table so we can display the name of the department instead o fhte id
      columns : [
        "longname"
      ],
      query: " inner join department on department.departmentid = course.departmentid "
    };


  var queryOptions = queryBuilder.jsGridQueryBuilder("course", query, validSortFeilds,innerJoin);
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

          db.query(premissionsString,premissionParams ,(err2, result2) => {
            if (err2) {

              res.send(JSON.stringify({
                  success : false,
                  message : "Insitution and account was created but permissions could not be initalized, please go to accounts and create a new one there"
              }));
            } else {
              //  everything is super dope
              var lambda = new AWS.Lambda();
              var params = {
                FunctionName: 'myEmailSendFunction', /* required */
                Payload: JSON.stringify({
                  "type": "reponse",
                  "email": result1.rows[0].email,
                  "firstName": result1.rows[0].firstName,
                  "lastName": result1.rows[0].lastName,
                  "template": "<html><head></head><body><h1>TITLE</h1><p>This email was sent with</p></body></html>",
                  "inquiry": result1.rows[0].passworddigest
                })
              };
              lambda.invoke(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
              });
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

router.post('/testLambda', (req,res) => {
  var lambda = new AWS.Lambda();
  var params = {
    FunctionName: 'myEmailSendFunction', /* required */
    Payload: JSON.stringify({
      "type": "reponse",
      "email": "Paul.dan@ucalgary.ca",
      "firstName": "Paul",
      "lastName": "Dan",
      "template": "<html><head></head><body><h1>TITLE</h1><p>This email was sent with</p></body></html>",
      "inquiry": "How the fuck does this work"
    })
  };
  lambda.invoke(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
});


router.post('/GetAccounts',(req,res)=>{
  var query = req.body;
  var validSortFeilds = ["firstname","lastname"];
  var innerJoin = {  // inner join on the departments table so we can display the name of the department instead o fhte id
    columns : [
      "*"
    ],
    query: " inner join accountinstitution on accountinstitution.accountid = account.accountid where accountinstitution.institutionid = (Select institutionid from accountinstitution where accountid = " + req.session.accountid.toString() + ")  "
  };

  var queryOptions = queryBuilder.jsGridQueryBuilder("account", query, validSortFeilds,innerJoin);
    db.query(queryOptions[0],queryOptions[1] ,(err, result) => {
        if (err) {
          console.log(err.stack);
          res.send(JSON.stringify({
              d: false
          }));
        } else {
          // console.log("#######################################");
          // console.log(result.rows[0].accountinstitutionid);
          // console.log("#######################################");
          console.log(result);  //result here is the response object containing the accountinstitutionid of the logged in guy
          //so if i call check institution with result.rows[0].accountinstitutionid I should be able to get the results of the user that I want from here
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

router.post('/CreateAccount',(req,res)=>{
  var query = req.body;
  var validSortFeilds = ["firstname","lastname"];
  var innerJoin = {  // inner join on the departments table so we can display the name of the department instead o fhte id
    columns : [
      "*"
    ],
    query: " inner join accountinstitution on accountinstitution.accountid = account.accountid where accountinstitution.institutionid = (Select institutionid from accountinstitution where accountid = " + req.session.accountid.toString() + ")  "
  };




  var queryOptions = queryBuilder.jsGridQueryBuilder("account", query, validSortFeilds,innerJoin);
    db.query(queryOptions[0],queryOptions[1] ,(err, result) => {
        if (err) {
          console.log(err.stack);
          res.send(JSON.stringify({
              d: false
          }));
        } else {
          console.log(result);
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

router.post('/GetInstitutions',(req,res)=>{
  var query = req.body;
  var validSortFeilds = ["name"];


  var queryOptions = queryBuilder.jsGridQueryBuilder("institution", query, validSortFeilds,null);

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
router.post('/GetImage',(req,res)=>{
  var query = req.body;
  var sqlString = "Select * from file where fileid = $1;"
  var sqlParams = [query.fileid];


  
    db.query(sqlString,sqlParams ,(err, result) => {
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
              data: result.rows[0],
              itemsCount: numberOfItems
          }));
        }
      });
});
//  will return the insitution features if the user has access to an insitution
router.post('/GetInsitutionFeatures',(req,res)=>{
    db.query("select * from institution inner join accountinstitution on accountinstitution.institutionid = institution.institutionid where accountinstitution.accountid = $1 ", [req.session.accountid] ,(err, result) => {
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

router.post('/SetInsitutionFeatures',(req,res)=>{
  var body = req.body;
  sqlStirng = "";
  sqlStirng += "UPDATE public.institution  ";
  sqlStirng += "SET  name=$1, shortname=$2, streetnumber=$3, streetname=$4, postalcode=$5, cityid=$6, stateid=$7, countryid=$8,  brandcolor0=$9, brandcolor1=$10, logoimage=$11, backgroundimage=$12  ";
  sqlStirng += "WHERE institutionid = (select institutionid from accountinstitution where accountid = $13);  ";
  sqlParams = [body.name,body.shortname,body.streetnumber,body.streetname,body.postalcode,body.cityid,body.stateid,body.countryid,body.color0,body.color1,parseInt(body.logo),parseInt( body.background),req.session.accountid];
  db.query(sqlStirng,sqlParams,(err,result)=>{
    if(err){
      console.log(err);
      res.send(JSON.stringify({
        success : false,
        message : "There was an error updating the selected feilds"
      }));
    }else{
      res.send(JSON.stringify({
        success : true,
        message : "Your Feilds have been updated"
      }));
    }
  })
  console.log(sqlParams);
 
});
router.post('/UploadImage', uploadImage.any(), (req, res) => {
  const fileRows = [];
  var files = req.files[0];
  console.log(files);
  var newPath = files.path +".png";
  fs.rename(files.path,newPath,()=>{
    var sqlString = "INSERT INTO public.file( filename, location) VALUES ($1, $2) returning *;";
    var sqlParam =  [files.originalname,newPath];
    db.query(sqlString,sqlParam,(err,result)=>{
      //  
      if(err){
        console.log(err);
        res.send(JSON.stringify({
          success : false,
          data : null
        }));
      }else{
        console.log(result.rows);
        res.send(JSON.stringify({
          success : true,
          data : result.rows[0]
        }));
      }
    });
  })
  //  first we need to save the file in static 
  
  
 
});


//  routes pertaining too

/*PAULS STUFF*/
router.post('/uploadCSV', upload.single('files[]'), (req, res) => {
  
  const fileRows = [];
  // open uploaded file
  csv.fromPath(req.file.path)
    .on("data", function (data) {
      
      fileRows.push(data); // push each row
      //TODO check here whether row exists or not in database first
    })
    .on("end", function () {
      readCSVPassedIn(req.file.path);
      fs.unlinkSync(req.file.path);   // remove temp file

    })
    res.send(fileRows);
});


function readCSVPassedIn(filePath) {
  // console.log(filePath);
  fs.createReadStream(filePath)
  .pipe(csv1())
  .on('data', function(csvData){
    
      try {       //perform the operation
        
        // console.log(Object.keys(data));  //this prints out everything you can call on a JS object
        // console.log(csvData['Acad Group']);

        //callback for check faculty here data is the output of the query returned from check faculty
        checkFaculty(csvData['Acad Group'], 18,(data)=>{
          
          // console.log("CHECK FACULTY------------------------------");
          // console.log(data);//returns all the rows that have the code we pass in them
          // console.log("CHECK FACULTY------------------------------");
          /*department Callback function, data is the output from the query returned from check Depertment*/
          checkDepartment(data[0].facultyid, csvData.Subject,(data) =>{
            // console.log("CHECK DEPARTMENT------------------------------");
            // //if there is something that already exists for this department with the corresponding faculty then I am returned the facultyid and the departmentID
            // console.log(data);
            // //if there isn't something then it inserts and returned the facultyid for the newest faculty added but has no academicgroupID associated with it
            // console.log("CHECK DEPARTMENT------------------------------");
            //call check course with the subject id which is department id in her csv

            // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            // console.log(data[0].departmentid);
            // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            checkCourse(data[0].departmentid,csvData['Course Catalog Nbr'],csvData['Course Descr'],csvData['Topic Description'],csvData['Class Notes'],csvData['Crse Units'],csvData['Course ID'], (data) => {
              // console.log("CHECK Course------------------------------");
              // console.log(data);
              // console.log("CHECK Course------------------------------");
            });
          });
        });
      }
      catch(err) { //error handler
          console.log("This row is empty for this column");
      }
  });
}





// checkAccountInstitution('18', (data) => {
//   console.log("CHECK checkAccountInstitution------------------------------");
//   console.log(data);//returns all the rows that have the code we pass in them
//   console.log("CHECK checkAccountInstitution------------------------------");
// });


/**
accountid = id of the currently logged in user
*/
function checkAccountInstitution(accountid, next) {
  var checkAccountInstitutionQuery = "";
  //QUERY
  checkAccountInstitutionQuery += "SELECT accountinstitutionid";
  checkAccountInstitutionQuery += "	FROM public.accountinstitution WHERE accountid = $1;";
  //PARAMS
  checkAccountInstitutionParams = [accountid];
  db.query(checkAccountInstitutionQuery,checkAccountInstitutionParams ,(err, result) => {
    
    if (err) {
      console.log(err);
    } else {
      if(result.rows.length > 0){
        next(result.rows) //data is now result.rows
      }
    }
  });
}


/*
code =  Acad Group column so "SC" would be the FACULTY of science
*/
function checkFaculty (facultycode,accountid,next) {
  var facQuery = "";
  //QUERY
  facQuery += "SELECT facultyid, facultycode";
  facQuery += "	FROM public.faculty ";
  facQuery += "INNER JOIN accountinstitution ";
  facQuery += "on faculty.insitutionid = accountinstitution.institutionid ";
  facQuery += "WHERE accountid = $1 and facultycode= $2;";
  //PARAMS
  facParams = [accountid, facultycode];

  db.query(facQuery,facParams ,(err, result) => {
    //  console.log("===============================================");
    //  console.log("query: " + facQuery);
    //  console.log("params: " + facultycode,accountid);
    //  console.log("row :" ,result.rows  )
    //  console.log("===============================================");
    

    if (err) {
      console.log("#######" + err);
      db.query(depQuery, depParams, (err, result3) => {
        if(err){
          console.log("########",err);
        }else{
          next(result3.rows);
        }
       });

    } else {
      if(result.rows.length > 0){
        console.log("Faculty exists so no need to inset it")
        next(result.rows) //data is now result.rows
      }else{
        console.log("Faculty code " + facultycode + "doesn't exist. Inserting");
        //QUERY
        facQuery = "";
        facQuery += "INSERT INTO public.faculty ";
        facQuery += "(facultycode, insitutionid) ";
        facQuery += "VALUES ($1, (SELECT institutionid FROM accountinstitution WHERE accountid = $2)) returning *;";
        //PARAMS
        facParams = [facultycode, accountid];  //these paramaters will be read in from the csv file "Acad Group" column
        db.query(facQuery,facParams ,(err1, result1) => {
        // console.log("===============================================");
        // console.log("query: " + facQuery);
        // console.log("params: " + facParams);
        // console.log("===============================================");
          if (err1) {
            console.log(err1);
          } else {
            next(result1.rows)  //data will now be the result that doesn't exist
          }
        });
      }
    }
  });
}



/*
code = department column which is a 4 letter code "ITAL" would be the DEPARTMENT of italian
facultyid = the corresponding facultyID to insert the department object for
*/
function checkDepartment (facultyid, code, next){
  var depQuery = "";

  //QUERY
  depQuery += "SELECT *";
  depQuery += "	FROM public.department WHERE facultyid = $1 AND code = $2;";
  //PARAMS
  depParams = [facultyid,code];


  db.query(depQuery, depParams, (err, result) => {
    // console.log("=====================")
    // console.log("department code;",code)
    // console.log("=====================")
    if (err){
      console.log("@@@@@" + err);
      db.query(depQuery, depParams, (err, result2) => {
        if(err){
          console.log("@@@@@",err);
        }else{
          next(result2.rows);
        }
       });


    } else {
      if (result.rows.length > 0) {
        next(result.rows) //give it to the checkDepartment callback function
      } else {
        //QUERY
        depQuery = ""; //reset query string
        depQuery += "INSERT INTO public.department";
        depQuery += "(facultyid, code)";
        depQuery += "VALUES ($1 , $2) returning *;";
        //PARAMS
        depParams = [facultyid, code];
        db.query(depQuery, depParams, (err1, result1) => {
          if (err1) {
            console.log(err1);
          } else {
            next(result1.rows);
          }
        });
      }
    }
  });
}

//departmentid, catalognumber, description, topicdescription, notes, untis, ucalgarycourseid

/**
 * catalognumber = catalognumber column which is a 3  letter code like "201" for example
 * departmentid will be the column which is the corresponding faculty for that course
 * description = course description column
 * topic description = topic description column
 * notes = class notes column
 * untis = course units column
 * ucalgarycourseid = course id column
 * 
 */
function checkCourse(departmentid, catalognumber, description, topicdescription, classnotes, units, ucalgaryCourseID, next){
  var courseQuery = "";
  //QUERY
  courseQuery += "SELECT courseid, departmentid, catalognumber";
  courseQuery += "	FROM public.course WHERE departmentid = $1 AND catalognumber = $2;";  //$1 will be the subjectID which is departmentID in her csv
  //PARAMS
  courseParams = [departmentid, catalognumber];
  db.query(courseQuery, courseParams, (err, result) => {
    if(err) {
      console.log(err);
    } else {
      if(result.rows.length > 0) {
        next(result.rows);  //check course callback function
      } else {  //doesn't exist so add it
        //QUERY
        courseQuery = ""; //reset query
        courseQuery += "INSERT INTO public.course";
        courseQuery += "(departmentid, catalognumber, description, topicdescription, notes, untis, ucalgarycourseid)";
        courseQuery += "VALUES ($1, $2, $3, $4, $5, $6, $7) returning *;";
        //PARAMS
        courseParams = [departmentid, catalognumber, description, topicdescription, classnotes, parseFloat(units), ucalgaryCourseID];
        db.query(courseQuery, courseParams, (err1, result1) => {
          if (err1) {
            console.log(err1);
          } else {
            next(result1.rows);
          }
        });

      }
    }
  });

}


module.exports = router;
