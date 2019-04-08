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
checkFaculty("asdf",(data)=>{
  console.log(data);  //returns all the rows that have AR in them
  console.log("CHECK FACULTY OVER------------------------------");
  //TODO call the check department now which will take the current faculty ID and based on that faculty ID  it will retrieve the department ID assoc with it
});

/*
code =  Acad Group column so "SC" would be the FACULTY of science
*/
function checkFaculty (code,next) {
  var facQuery = "";
  //QUERY
  facQuery += "SELECT academicgroupid";
  facQuery += "	FROM public.academicgroup WHERE code = $1;";
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
        facQuery += "INSERT INTO public.academicgroup";
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

/*department Callback function, data is the output from the query returned from check Depertment*/
checkDepartment("ART", (data) =>{
  console.log(data);
  console.log("CHECK DEPARTMENT OVER------------------------------");
});


/*
code = subject column which is a 4 letter code "ITAL" would be the DEPARTMENT of italian
*/
function checkDepartment (code, next){
  var depQuery = "";
  //QUERY
  depQuery += "SELECT subjectid, academicgroupid, code";
  depQuery += "	FROM public.subject WHERE code = $1;";
  //PARAMS
  depParams = [code]

  db.query(depQuery, depParams, (err, result) => {
    if (err){
      console.log(err);
    } else {
      if (result.rows.length > 0) {
        next(result.rows) //give it to the checkDepartment callback function
      } else {
        console.log("Department code " + code + "doesn't exist, Inserting");
      }
      //TODO write insert for check department
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
