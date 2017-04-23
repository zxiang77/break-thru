

from indeed import IndeedClient
import json

client = IndeedClient(publisher = "4539160683987472")

params = {
    'q' : "high school",
    'l' : "newyork",
    'userip' : "144.121.64.94",
    'useragent' : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2)",
    'limit' : '50000'
}


data = {}


search_response = client.search(**params)

for job in search_response['results']:
    tag_dict = {
    'loud': {'name':'loud', 'words': ['noise', 'people', 'busy', 'boom', 'city', 'traffic', 'cafe', 'restaurant', 'crowd', 'customers'], 'score':0},
    'detail_oriented': {'name':'detail_oriented', 'words': ['attentive', 'secretar', 'data', 'detail-oriented', 'organize', 'schedule', 'administrative', 'filing', 'hardworking', 'internal', 'memory', 'meticulous', 'neat', 'operations', 'independent', 'organization', 'organizational', 'remember', 'responsible', 'system', 'distracted', 'bored', 'perfectionist', 'routine', 'repetitive'], 'score':0},
    'social': {'name':'social', 'words':['talk', 'sales', '', 'customers', 'service', 'smile', 'conversation', 'speak', 'loud', 'friendly', 'strangers', 'new', 'people', 'peer', 'verbal', 'communicat'], 'score':0},
    'heavy_lifting': {'name':'heavy_lifting', 'words': ['movement', 'active', 'bike', 'muscle', 'lifting', 'hands', 'legs', 'bicycle', 'balance', 'strong', 'lift', 'heavy', 'manual', 'labor', 'pounds', 'warehouse', 'equipment', 'lbs', 'box', 'package'], 'score':0},
    'creativity': {'name': 'creativity', 'words':['writing', 'marketing', 'problem solving', 'solve problems', 'creative', 'think', 'creative', 'quick', 'independent', 'design', 'art', 'music', 'media', 'new', 'draw'], 'score':0},
    'leadership': {'name': 'leadership', 'words':['lead', 'teach', 'mentor', 'peer', 'guid', 'coordinate', 'help', 'supervis', 'responsibil', 'role', 'counsel'], 'score':0},
    'technology': {'name': 'technology', 'words':['tech', 'computer', 'electronic', 'mail', 'device', 'programming', 'game', 'system', 'information', 'science', 'software', 'microsoft', 'app', 'social media'], 'score':0}
    }


    for tag in tag_dict:
        for word in tag_dict[tag]['words']:
            if word in job['snippet'].encode('ascii','ignore'):
                tag_dict[tag]['score'] += 1

    #score = []
    #for tag in tag_dict:
    #    if tag_dict[tag]['score'] > 0:
    #        score.append((tag_dict[tag]['name'], tag_dict[tag]['score']))

    # print job['jobtitle'].encode('ascii','ignore'),': ', job['company'].encode('ascii','ignore'), score

    data[job['jobkey']] = {'jobtitle': job['jobtitle'].encode('ascii','ignore'), 'company' : job['company'].encode('ascii','ignore'),
    'url': job['url'].encode('ascii','ignore'), 'formattedLocation': job['formattedLocation'].encode('ascii','ignore'), 'jobkey': job['jobkey'].encode('ascii','ignore')}


    for tag in tag_dict:
        data[job['jobkey']][tag] = tag_dict[tag]['score']

with open('data.json', 'w') as outfile:
    json.dump(data, outfile)
