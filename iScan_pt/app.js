require('./util');
var express 	= require('express');
var http 		= require('http');
var path 		= require('path');
var routes 		= require('./routes');
//var MongoSessionStore = require('mongosessionstore')(express);

global.root_dir = __dirname

var app = express();

// all environments
app.set('port', process.env.PORT || 3002);
app.use(express.logger('dev'));
app.set('views', path.join(__dirname, 'frontEnd'));
app.use(require('connect-multiparty')({ uploadDir: path.join(__dirname, 'frontEnd/tmp/')}));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    cookie: {
        maxAge: 12 * 60 * 60 * 1000
    }
    ,secret: "atlas123"
    //,store: new MongoSessionStore({mongodb_connection_url:"mongodb://127.0.0.1:27017/iscan", mongoclient_connect_options:{}})
}));
app.use(express.static(path.join(__dirname, 'frontEnd')));

app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  //app.use(express.errorHandler());
}

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
