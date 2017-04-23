from indeed import IndeedClient
import json

client = IndeedClient(publisher = "4539160683987472")

params = {
    'q' : "high school",
    'l' : "10044",
    'userip' : "144.121.64.94",
    'useragent' : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2)",
    'limit' : '50000'
}


data = {'attributes': ['jobtitle', 'company', 'url', 'formattedLocation', 'jobkey', 'loud', 'detail_oriented', 'social', 'heavy_lifting']}


search_response = client.search(**params)

for job in search_response['results']:
    tag_dict = {'loud': {'name':'loud', 'words': ['noise', 'people', 'busy', 'flashing', 'boom', 'speakers', 'city', 'traffic'], 'score':0},
    'detail_oriented': {'name':'detail_oriented', 'words': ['data', 'detail-oriented', 'organize', 'schedule', 'administrative', 'filing', 'hardworking', 'internal', 'memory', 'meticulous', 'neat', 'operations', 'organization', 'organizational', 'remember', 'responsible', 'system', 'distracted', 'bored', 'perfectionist', 'routine', 'repetitive'], 'score':0},
    'social':{'name':'social', 'words':['talk', 'conversation', 'speak', 'loud', 'friendly', 'strangers', 'new', 'people', 'peer'], 'score':0},
    'heavy_lifting':{'name':'heavy_lifting', 'words': ['movement', 'muscle', 'motor', 'hands', 'legs', 'coordination', 'balance', 'clumsy', 'weak', 'strong', 'lift', 'heavy', 'manual', 'labor', 'pounds', 'warehouse', 'lbs', 'box', 'lifting'], 'score':0}}


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

#print data

    for tag in tag_dict:
        data[job['jobkey'][tag]]

         = tag_dict[tag]['score']

        data[job['job']]
        print tag
        print tag_dict[tag]['score']

        data[job['jobkey'][tag]] = tag_dict[tag]['score']

with open('Users/aaronwflee/Desktop/data.json', 'w') as outfile:
    json.dump(data, outfile)