
var express = require('express');

var app = express();

var url = require('url');

var oauth = require('oauth');

app.get('/', function(request, response) {
	  response.send('Hello, world.');
});

app.get('/tweets.json', function(request, response) {
	  var query = {
		   'q': '',
		   'geocode':'37.781157,-122.398720,5km',
		   'count': '20'
	  };

	    var count = parseInt(request.param('count'));

	      if (!isNaN(count)) {
		          query.count = count;
			    }

	        var twitter = new oauth.OAuth(
			    'https://api.twitter.com/oauth/request_token',
			        'https://api.twitter.com/oauth/access_token',
				    process.env.TWITTER_CONSUMER_KEY,
				        process.env.TWITTER_CONSUMER_SECRET,
					    '1.0A',
					        null,
						    'HMAC-SHA1'
						      );

		  twitter.get(
				      url.format({
					            protocol: 'https:',
					            hostname: 'api.twitter.com',
					            pathname: '/1.1/search/tweets.json',
					            query: query
					          }),
				          process.env.TWITTER_ACCESS_TOKEN,
					      process.env.TWITTER_ACCESS_TOKEN_SECRET,
					          function(err, data) {
							        if (err) {
									        response.jsonp(err);
										      } else {
											              var tweets = [];

												              JSON.parse(data).forEach(function(tweet) {
														                tweets.push({
																	            'id_str': tweet.id_str,
																	            'created_at': tweet.created_at,
																	            'text': tweet.text
																	          });
																        });

													              response.jsonp({
															                'statusCode': 200,
															                'data': tweets
															              });
														            }
								    }
		    );
});

app.listen(process.env.PORT || 3000);

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
