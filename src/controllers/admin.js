/*
The admin module
*/
const db = require('../db');
const express = require('express');
var queryBuilder = require('./helpers/queryBuilder');
var router = express.Router();






//  this is my middle ware for authentication
function requiresLogin(req, res, next) {
    if (req.session && req.session.accountid) {
      return next();
    } else {
        return res.redirect('admin/login');

    }
  }


router.get('/',requiresLogin, (req, res) => {
  //    do an inital db hit to
  console.log(req.session.accountid);
  db.query("Select *  from account inner join accountinstitution on account.accountid = accountinstitution.accountid  where account.accountid=$1",[req.session.accountid],(err,result)=>{
    if(err){
        console.log(err);
    }else{
        console.log(result.rows[0]);
        res.render('admin/index.html' , result.rows[0]);
    }
  });


});
router.get('/login', (req, res) => {

    res.render('admin/login.html');
});
router.post('/login', (req, res) => {
    //dont have to do nothing lol
    //dont have to do nothing lol
    // get from the db here and see if the user is good
    console.log("login",req.body);
    db.query("SELECT * FROM public.account inner join accountinstitution on accountinstitution.accountid = account.accountid where email = $1 or passworddigest = $2;" , [req.body.emai,req.body.password],(err,result)=>{
        //  get the

        if(err){
            console.log(err)
            //
            res.render('admin/login.html', { error : "Error loggin in , please contact support if issue exists" });
        }else{
            if(result.rows.length > 0){
                //  user has been logged in sucessfully
                req.session.accountid = result.rows[0].accountid;
                req.session.insitutionid = result.rows[0].insitutionid;
                return res.redirect('/admin');
            }else{
                //  not correct
                res.render('admin/login.html', { error : "Account Crednitals did not return a match" });
            }
        }
    });
});
router.post('/logout', (req, res) => {
    //dont have to do nothing lol
    
    if (req.session) {
    // delete session object
    req.session.accountid = null
            
             
    console.log("deleted");
    return res.redirect('/admin');
        
    }else{
        return res.redirect('/admin');
    }



});



router.get('/setup',(req, res) => {
    //  lets figure out from the cookie what institutions they can setup before they can do anything else


    res.render('admin/setup.html');


});






module.exports = router;
