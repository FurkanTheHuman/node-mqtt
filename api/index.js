// Import express
let express = require('express')// Initialize the app
let app = express();// Setup server port
var port = process.env.PORT || 8080;// Send message for default URL

// Import Body parser
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
var withAuth = require('./middleware');

var cors = require('cors');

app.use(cors());
app.use(cookieParser());

app.use(bodyParser.urlencoded({
   extended: true
}));

app.use(bodyParser.json());
// Connect to Mongoose and set connection variable
// Deprecated: mongoose.connect('mongodb://localhost/resthub');
mongoose.connect('mongodb://localhost/iot', { useNewUrlParser: true,  useUnifiedTopology: true});
// Contact routes

var db = mongoose.connection;

if(!db)
    console.error("Error connecting db")
else
    console.log("Db connected successfully", '['+db.name+']')

let apiRoutes = require("./routes")
app.use('/api', apiRoutes)
app.get('/secret', withAuth, function(req, res) {
    res.send('The asdasd is potato');
  });

app.get('/checkToken', withAuth, function(req, res) {
    res.sendStatus(200);
})
app.listen(port, function () {
     console.log("Running RestHub on port " + port);
});