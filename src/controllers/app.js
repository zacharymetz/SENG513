/*
Customer Module
*/
const db = require('../db');
const express = require('express');
var queryBuilder = require('./helpers/queryBuilder');
var router = express.Router();

/*

*/
router.get('/list', (req, res) => {
  //dont have to do nothing lol

  res.render('invoices/list.html');
});
router.post('/GetInvoices',(req,res)=> {
  console.log(req.body);
  var query = req.body;

  //  need to add sorts up here since can do sql injections if not
  //  to stop sql injections we need to check the feilds
  var sortFeild = null;
  var validSortFeilds = ["lastname","firstname"];
  if(req.body.sortField != null){
    console.log(req.body.sortField);
     for(var i=0;i<validSortFeilds.length;i++){ //  loop to see if valid sort
       console.log(validSortFeilds[i]);
       if(req.body.sortField == validSortFeilds[i]){
         sortFeild = validSortFeilds[i];
         break;
       }
     }
  }
 var queryOptions = queryBuilder.jsGridQueryBuilder("Employee", query, sortFeild);

  //  run the query here since it should be good
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

router.get('/new', (req, res) => {
  //dont have to do nothing lol

  res.render('invoices/new.html');
});
//  TODO is to test this mf shit lol
router.post('/CreateNewInvoice',(req,res)=> {
  var raw_invioce = req.body;
  console.log(raw_invioce);
  //create a new invoice and select statement to get the id of it
  var sql = "INSERT INTO invoice(customerid, datecreated) VALUES ( $1, now()) RETURNING invoiceid;";
  var query_options = [raw_invioce.customerid];
  db.query(sql,query_options ,(err, result) => {
    if(err){
      console.log(err);
      res.send(JSON.stringify({
          success: false
      }));
    }else{
      console.log(result);
      //it is sucessful in creating the invoice object to lets create all the rows
      for(var i=0;i<raw_invioce.items.length;i++){
        sql = "INSERT INTO invoice_item( itemid, invoiceid, quantity,itempriceid, datecreated) VALUES ( $1, $2, $3, $4, now());";

        queryOptions =[raw_invioce.items[i].itemid,result.rows[0].invoiceid,raw_invioce.items[i].qty,raw_invioce.items[i].priceid];
        console.log(raw_invioce.items[i]);
        db.query(sql,queryOptions,(err,result)=>{console.log(err)});
      }
      res.send(JSON.stringify({
          success: true,
          invoiceID: result.rows[0].invoiceid //make sure to send back the new invoice id
      }));
    }
  });
});

router.get('/invoice/:id', (req,res) =>{
  var invoiceId = req.params.id;
  //  get the invoice and customer details, all the other stuff can be
  //  grabed with ajax
  var sql = "SELECT invoice.*, customer.* FROM invoice inner join customer on invoice.customerid = customer.customerid and invoice.invoiceid = $1;";

  db.query(sql,[invoiceId],(err,result)=> {
    if(err){
      //  send a null object back since the front end will just way
      //  invalid invoice
      res.render('invoices/details.html', { invoice:null });
    }else{
      //  send the invoice to be templated in
      console.log(result.rows[0]);
      res.render('invoices/details.html', { invoice:result.rows[0] });
    }
  });
});
//  Get all the items and the price at the time of the invoice creation
router.post('/GetInvoiceItems',(req,res)=> {
  var invoice = req.body;
  console.log(invoice);
  // this sql query will get the items, price sold at and
  var sql = "SELECT item.*, item_price.*, invoice_item.quantity, item_price.price*invoice_item.quantity::float as subtotal from  invoice_item inner join  item on item.itemid = invoice_item.itemid inner join item_price on invoice_item.itempriceid = item_price.priceid where invoiceid =  $1";

  //apply a sort and paging if nessisary and this way to prevent sql injections
  // TODO make this apat of the query builder or another module of it so not
  //  repeated
  var sort_feilds = ["itemname","price","quantity","subtotal"];
  if(invoice.filter){
    if(invoice.filter.sortField){
      if(sort_feilds.includes(invoice.filter.sortField)){ // make sure it is a
                                                          // valid feild
        var i;
        for(i=0;i<sort_feilds.length;i++){
          if(sort_feilds[i] == invoice.filter.sortField){
            break;
          }
        }

        // figure out the sort order and add it to the query
        var sort = "desc";
        if(invoice.filter.sortOrder != sort){
          sort = 'asc';
        }
        sql = sql + "  order by " + sort_feilds[i] + " " + sort + " ";
      }
    }
    if(invoice.filter.pageIndex){
    sql = sql + " LIMIT " + invoice.filter.pageSize + " ";

      if(invoice.filter.pageIndex > 1){
        sql = sql + " OFFSET " + ((invoice.filter.pageIndex - 1) * invoice.filter.pageSize ) + " ";
      }
    }
  }
  sql = sql + ";";
  db.query(sql,[invoice.id],(err,result)=> {

    if(err){
      //  send a null object back since the front end will just way
      //  invalid invoice
      res.send({ success : false, data : [] });
    }else{
      //  send the invoice to be templated in
      res.send({ success : true, data : result.rows });
    }
  });
});
//  Get details about the invoice payment here and do shit with it
router.post('/GetInvoicePayment',(req,res)=> {

});
/*

*/



module.exports = router;
