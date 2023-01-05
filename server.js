// Imports
const mysql = require('mysql'),
    express = require('express'),
    app = express(),
    session = require('express-session'),
    path = require('path'),
    bodyParser = require('body-parser');

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
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/auth', function(req, res){
    // Capture input fields
    let username = req.body.username;
    let password = req.body.password;
    // Ensure input fields exist and are not empty
    if (username && password){
        connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(err, results, fields){
            if (err) throw err;
            if (res.length > 0){
                console.log(req.session);
                req.session.loggedIn = true;
                req.session.username = username;
                res.redirect('/home');
            } else{
                res.send('Incorrect username and/or password!');
            }
            res.end();
        });
    } else{
        res.send('Please enter username and password!');
        res.end();
    }
});

app.get('/home', function(req, res){
    if (req.session.loggedin){
        res.send('Welcome back, ' + req.session.username + '!');
    } else{
        res.send('Please log in to view this page!');
    }
    res.end();
});

// Listening on port
const port = 3000;
app.listen(port, function(){
    console.log('Listening on port ' + port)
})