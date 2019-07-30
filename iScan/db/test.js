var mongoose = require('mongoose');
var db = mongoose.createConnection();
db.openSet("mongodb://atlas:atlas@10.4.45.246:27017/oak");
