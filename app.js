const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
 
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Root',
    database:'users'
});
 
connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 
 
//set views file
app.set('views',path.join(__dirname,'views'));
 
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 
 
 
app.get('/',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM user";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('index', {
            title : 'CRUD Operation',
            users : rows
        });
    });
});

// add users
app.get('/add',(req, res) => {
    res.render('add', {
        title : 'CRUD Operation '
    });
});
 
app.post('/save',(req, res) => { 
    let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no};
    let sql = "INSERT INTO user SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

//edit user pages is open with database
app.get('/edit/:id',(req, res) => {
    const userId = req.params.id;
    let sql = `Select * from user where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('edit', {
            title : 'CRUD Operation',
            user : result[0]
        });
    });
});

//Update the data
app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update user SET name='"+req.body.name+"',  email='"+req.body.email+"',  phone_no='"+req.body.phone_no+"' where id ="+userId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

//delete the data
app.get('/delete/:id',(req, res) => {
    const userId = req.params.id;
    let sql = `DELETE from user where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});
 
 
// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});