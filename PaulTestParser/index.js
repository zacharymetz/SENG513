const http = require('http');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const csv = require('fast-csv');
const path = require('path'); //poth for connecting
const csv1 = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const upload = multer({ dest: 'tmp/csv/' });
const app = express();
const server = http.createServer(app);
const port = 3000

//for database
const  { Pool,Client } = require('pg');
const pool = new Client({
  user: 'postgres',
  host: '96.51.140.32',
  database: 'webapp',
  password: 'DUBTmNiaWMe9v6dqNnhiOQTrZEWmI1x34CfZOziWvHfWNpAKRBDIZ5KLmTCX0CZre7l03a7NeYM3LGuHLerl6hjgorTmFHW0',
  port: 5432,
});

//connect to the pg admin instance
pool.connect();
db = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}




//callback for check faculty here data is the output of the query returned from check faculty
checkFaculty("paulsTest",(data)=>{
  console.log("CHECK FACULTY------------------------------");
  console.log(data);//returns all the rows that have the code we pass in them
  console.log("CHECK FACULTY------------------------------");
  //TODO call the check department now which will take the current faculty ID and based on that faculty ID  it will retrieve the department ID assoc with it

  /*department Callback function, data is the output from the query returned from check Depertment*/
  checkDepartment(data[0].facultyid, "CPSC",(data) =>{
    console.log("CHECK DEPARTMENT------------------------------");
    //if there is something that already exists for this department with the corresponding faculty then I am returned the facultyid and the departmentID
    console.log(data);
    //if there isn't something then it inserts and returned the facultyid for the newest faculty added but has no academicgroupID associated with it
    console.log("CHECK DEPARTMENT------------------------------");

    //call check course with the subject id which is department id in her csv
    checkCourse(data[0].departmentid, "331", (data) => {
      console.log("CHECK Course------------------------------");
      console.log(data);
      console.log("CHECK Course------------------------------");
    });


  });
});

/*
code =  Acad Group column so "SC" would be the FACULTY of science
*/
function checkFaculty (code,next) {
  var facQuery = "";
  //QUERY
  facQuery += "SELECT facultyid";
  facQuery += "	FROM public.faculty WHERE code = $1;";
  //PARAMS
  facParams = [code];
  db.query(facQuery,facParams ,(err, result) => {
    if (err) {
      console.log(err);
    } else {
      if(result.rows.length > 0){
        next(result.rows) //data is now result.rows
      }else{
        console.log("Faculty code " + code + "doesn't exist. Inserting");
        //QUERY
        facQuery = "";
        facQuery += "INSERT INTO public.faculty";
        facQuery += "(code)";
        facQuery += "VALUES ($1) returning *;";
        //PARAMS
        facParams = [code];  //these paramaters will be read in from the csv file "Acad Group" column
        db.query(facQuery,facParams ,(err1, result1) => {
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
  depQuery += "SELECT departmentid, facultyid";
  depQuery += "	FROM public.department WHERE facultyid = $1;";
  //PARAMS
  depParams = [facultyid];


  db.query(depQuery, depParams, (err, result) => {
    if (err){
      console.log("this is where the error" + err);
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

/**
 * code = catalognumber column which is a 3  letter code like "201" for example
 * departmentid will be the column which is the corresponding faculty for that course
 */
function checkCourse(departmentid, catalognumber, next){
  var courseQuery = "";
  //QUERY
  courseQuery += "SELECT courseid, departmentid";
  courseQuery += "	FROM public.course WHERE departmentid = $1;";  //$1 will be the subjectID which is departmentID in her csv
  //PARAMS
  courseParams = [departmentid];
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
        courseQuery += "(departmentid, catalognumber)";
        courseQuery += "VALUES ($1, $2) returning *;";
        //PARAMS
        courseParams = [departmentid, catalognumber];
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



//---------------------------------------RETRIEVING FILE AND GETTING IT INTO THE FORMAT WE WANT FOR PARSING------------------------------------//
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


/*Routes*/
app.get('/', (req,res) => {
  //render the index with all the corresponding messages in place.
  res.render('index');  //render the index html file
});

app.post('/', upload.single('files[]'), function (req, res) {
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

// Start server
function startServer() {
  server.listen(port, function () {
    console.log('Express server listening on ', port);
  });
}

setImmediate(startServer);

function readCSVPassedIn(filePath) {
  // console.log(filePath);
  fs.createReadStream(filePath)
  .pipe(csv1())
  .on('data', function(data){
      try {       //perform the operation
        console.log(data);
      }
      catch(err) { //error handler
          console.log("This row is empty for this column");
      }
  });
}
