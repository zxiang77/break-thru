/**
 * Created by zilixiang on 4/21/17.
 */
var express = require('express');
var app = express();


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



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index');
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


