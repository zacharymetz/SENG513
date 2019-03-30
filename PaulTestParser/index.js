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