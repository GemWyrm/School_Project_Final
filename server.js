// Imports
const mysql = require('mysql'),
    express = require('express'),
    app = express(),
    session = require('express-session'),
    path = require('path'),
    bodyParser = require('body-parser');

// Set engine
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public')));

// Database connections
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'NewPass123',
    database: 'project_final'
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// Routes
app.get('/', function(req, res){
    res.render('index');
});

app.post('/auth', function(req, res){
    // Capture input fields
    let username = req.body.username;
    let password = req.body.password;
    // Ensure input fields exist and are not empty
    if (username && password){
        connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(err, results, fields){
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
            if (results.length > 0){
                req.session.username = username;
                req.session.loggedIn = true;
                res.redirect('/home');
            } else {
                res.send('Incorrect username and/or password!');
            }
        });
    } else{
        res.send('Please enter username and password!');
    }
});

app.get('/register', function(req, res){
    res.render('register');
});

app.post('/register/auth', function(req, res){
    // Capture input fields
    let username = req.body.username;
    let password = req.body.password;
    // Ensure input fields exist and are not empty
    if (username && password){
        connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function(err,results){
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
            if (results.affectedRows > 0){
                req.render('register', {regsuccess : "Congratulations! You have successfully registered!"});
                setTimeout(function() {
                    res.redirect('/');
                }, 2000);
            } else {
                res.send('Username already exists!');
            }
        });
    } else {
        res.send('Please enter both a username and a password!');
    }
});

app.get('/home', function(req, res){
    if (req.session.loggedIn){
        let username = req.session.username;
        res.render('home', {username});
    } else{
        res.send('Please log in to view this page!');
    }
});

// Listening on port
const port = 3000;
app.listen(port, function(){
    console.log('Listening on port ' + port)
})