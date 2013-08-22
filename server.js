
var express = require('express');

var app = express();

app.get('/', function(request, response) {
	  response.send('Hello, world.');
});

app.listen(process.env.PORT);

/*
var express = require('express');
var app = express();

app.configure(function(){
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.engine('ejs', require('ejs').__express);
app.set('views', __dirname + '/app');

app.use(express.static(__dirname + '/app'));
});


app.get('/', function(req, res){
  res.render('index.ejs', {
    appID : '495633883851289'
  });
});

app.listen(process.env.PORT || 3000);
*/
