/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
var fs = require('fs');

var app = express();
var preference  = {
    social: 0,
    heavy_lifting: 0,
    detail_oriented: 0,
    creativity: 0,
    leadership: 0,
    technology: 0,
    loud: 0

};


// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

var job_buffer = fs.readFileSync('public/data.json')
var job_json = JSON.parse(job_buffer)

// Create the service wrapper
var conversation = new Conversation({
  // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
  // username: '<username>',
  // password: '<password>',
  url: 'https://gateway.watsonplatform.net/conversation/api',
  version_date: '2016-10-21',
  version: 'v1'
});


// Endpoint to be call from the client side
app.post('/api/message', function(req, res) {
  var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
  if (!workspace || workspace === '<workspace-id>') {
    return res.json({
      'output': {
        'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
      }
    });
  }

    // views is directory for all template files
  var jsondata = require('./data.json');
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');

  app.get('/result', function(request, response) {
      response.render('pages/index', jsondata);
  });

  var payload = {
    workspace_id: workspace,
    context: req.body.context || {},
    input: req.body.input || {}
  };

  // Send the input to the conversation service
  conversation.message(payload, function(err, data) {
    if (err) {
      return res.status(err.code || 500).json(err);
    }
    return res.json(updateMessage(payload, data));
  });
});

/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Conversation service
 * @param  {Object} response The response from the Conversation service
 * @return {Object}          The response with the updated message
 */


function scoreJob(weight, jobs) {
    var wKeys = Object.keys(weight);
    var jobsKeys = Object.keys(jobs);
    var sortedJob = [];
    for (var i = 0; i < jobsKeys.length; i ++) {
        var ps = jobs[jobsKeys[i]];
        var score = 0;
        for (var j = 0; j < wKeys.length; j ++) {

            if (ps[wKeys[j]] == undefined)  {

            }
            else {
                score += weight[wKeys[j]] * ps[wKeys[j]];
            }

            //console.log(score);
        }

        sortedJob.push({"key": jobsKeys[i], "value": score});

    }


    sortedJob.sort(function(a, b) {return b.value - a.value});

    var selectedJobs = [];
    for (var i = 0; i < sortedJob.length; i ++) {
        if (sortedJob[i].value > 0) {
          //jobs[sortedJob[i].key].score = sortedJob[i].value;
            var job_formatted = {'Job Title': jobs[sortedJob[i].key]['jobtitle'],
                                 'Job URL': jobs[sortedJob[i].key]['url'],
                                 'Job Match Score': sortedJob[i].value,
                                 'Company': jobs[sortedJob[i].key]['company']
                                }
            selectedJobs.push(job_formatted);
        }
        else {
            break;
        }
    }
    return selectedJobs;
}


function get_short_url(long_url, login, api_key, func)
{
    $.getJSON(
        "http://api.bitly.com/v3/shorten?callback=?", 
        { 
            "format": "json",
            "apiKey": api_key,
            "login": login,
            "longUrl": long_url
        },
        function(response)
        {
            func(response.data.url);
        }
    );
}

function updateMessage(input, response) {
  var responseText = null;
  if (!response.output) {
    response.output = {};
  } else {
      if (response.output.action === 'likes') {
    // User asked what time it is, so we output the local system time.
          if (response.output.tag === undefined) {

          }
          else {
              preference[response.output.tag] += 1;
          }



    } else if (response.output.action === 'dislikes') {
      // User said goodbye, so we're done.
          if (response.output.tag === undefined) {

          }
          else {
              preference[response.output.tag] -= 1;
          }
    }
      else if (response.output.action === "exit") {
        console.log('In Exit ')

          var recommended = scoreJob(preference, job_json);
          //return "I've done a lot of thinking. Based on what we've talked about, I think these jobs may be a good for you!"
          //var jobs_text = JSON.stringify(recommended)
          var jobs_text_formatted = '';
          for (var i = 0; i < recommended.length; i ++) {
            var title_formatted = '<b>'+ recommended[i]['Job Title'] + ', ' + recommended[i]['Company'] + '</b><br>';
            var score_formatted = '<i>Job Match Score:  </i><b>' + recommended[i]['Job Match Score'] + '</b><br>';
            //var url_formatted = '<i>Job URL: </i>' + recommended[i]['Job URL'] + '<br>';
            jobs_text_formatted += title_formatted.link(recommended[i]['Job URL']) + score_formatted + '<br>';

          }
          if (recommended.length === 0){
            response.output.text = "I'm sorry, we don't have enough information to find some matches for you. Would you like to answer more questions?"
            return response;
          }

          response.output.text = jobs_text_formatted;
          console.log('Should have been set!')
          return response;
        }
      else if (response.output.action === 'profile'){

          response.output.text = 'Here'.link('https://invis.io/ZMBEQBD78#/230254611_Result') + ' it is!' 

      }

    return response;
  }

  if (response.intents && response.intents[0]) {
    var intent = response.intents[0];
    // Depending on the confidence of the response the app can return different messages.
    // The confidence will vary depending on how well the system is trained. The service will always try to assign
    // a class/intent to the input. If the confidence is low, then it suggests the service is unsure of the
    // user's intent . In these cases it is usually best to return a disambiguation message
    // ('I did not understand your intent, please rephrase your question', etc..)
    if (intent.confidence >= 0.75) {
      responseText = 'I understood your intent was ' + intent.intent;
    } else if (intent.confidence >= 0.5) {
      responseText = 'I think your intent was ' + intent.intent;
    } else {
      responseText = 'I did not understand your intent';
    }
  }
  response.output.text = responseText;
  return response;
}

module.exports = app;
