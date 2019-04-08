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





checkFac("phfy",(data)=>{
  console.log(data);  //returns all the rows that have AR in them 
});

/*based on a code that I passs in which will then be just extracted from the row of the 
csv I need to check if the code exists then if it doesnt just create a new ID for that user. 
*/
function checkFac (code,next) {
  var sqlQuery = "";
  sqlQuery += "SELECT academicgroupid";
  sqlQuery += "	FROM public.academicgroup WHERE code=$1;";
  sqlParams = [code];

  db.query(sqlQuery,sqlParams ,(err, result) => {
    if (err) {
      console.log(err);
    } else {
      if(result.rows.length > 0){
        next(result.rows) //data is now result.rows
      }else{
        console.log("Doesn't exist");
        sqlQuery = "";
        sqlQuery += "INSERT INTO public.academicgroup";
        sqlQuery += "(code, longname)";
        sqlQuery += "VALUES ($1, $2) returning *;";
        sqlParams = ['pp', 'PaulDan'];
        db.query(sqlQuery,sqlParams ,(err1, result1) => {
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

