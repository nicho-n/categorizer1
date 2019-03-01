var port = 3000;
var express = require("express");
var mongoose = require("mongoose");
var session = require('express-session');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

mongoose.connect('mongodb://localhost/auth');
var db = mongoose.connection;

app.use(bodyParser.urlencoded());
app.use(cookieParser());

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("I think we're connected");
});

app.use(session({
    secret: 'bleghhh',
    resave: true,
    cookie: { maxAge: 8*60*60*1000 },  // 8 hours
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
}));

var routes = require('./router');
app.use('/', routes);


app.get("/", function (req, res, next) {
    console.log(req.session.user);
    next();
});

function updateUsers(){
    //io.emit('receive_profiles', profiles)
}

app.use(express.static("pub"));

http.listen(port, function(){
    console.log('listening on ' + port);
});