var http = require('http');
var fs = require('fs');

const PORT=3005;
//---------------------------------------
/* TRADE-OFF ANALYTICS */
// {
// 	  "url": "https://gateway.watsonplatform.net/tradeoff-analytics/api",
// 		  "username": "0190f0c0-f15a-4878-8728-d88b57bd326f",
// 		  "password": "tNPahu8wlMct"
// }

var username = '0190f0c0-f15a-4878-8728-d88b57bd326f';
var password = 'tNPahu8wlMct';


var TradeoffAnalyticsV1 = require('watson-developer-cloud/tradeoff-analytics/v1');
var tradeoff_analytics = new TradeoffAnalyticsV1({
	  username: username,
	  password: password
});


var TradeoffAnalyticsV1 = require('watson-developer-cloud/tradeoff-analytics/v1');
var tradeoff_analytics = new TradeoffAnalyticsV1({
	  username: username,
	  password: password,
	  headers: {
		      'X-Watson-Learning-Opt-Out': 'true'
		    }
});


var TradeoffAnalyticsV1 = require('watson-developer-cloud/tradeoff-analytics/v1');
var tradeoff_analytics = new TradeoffAnalyticsV1({
  username: username,
  password: password
});

// Parameters for the call are defined in the problem.json file.
var params = require('problem.json');

tradeoff_analytics.dilemmas(params, function(error, resolution) {
  if (error)
    console.log('Error:', error)
  else
    console.log(JSON.stringify(resolution, null, 2));
});

//---------------------------------------
fs.readFile('./index.html', function (err, html) {

    if (err) throw err;

    http.createServer(function(request, response) {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
    }).listen(PORT);
});
//-----------------
