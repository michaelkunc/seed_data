// find the number of checkIns per bar

coll.aggregate([ {$group: { _id: '$location.name', checkIns : {$sum: 1}}}]);

// number of checkins by bar and cocktail
coll.aggregate([ {$group: { _id : { "location" : '$location.name', "cocktail" : "$cocktail"}, checkIns : {$sum : 1}}}]);

// clinky count by cocktail
coll.aggregate({ '$unwind' : '$clinkies' }, { '$group' : { _id : '$cocktail', clinkyCount : {'$sum' : 1 }}});

// clinky count by bar and cocktail
coll.aggregate({ '$unwind' : '$clinkies' }, { '$group' : { _id : {'bar' : '$location.name', 'cocktail' : '$cocktail'}, clinkyCount : {'$sum' : 1 }}});

// returns an array of arrays of tastes by cocktail
coll.aggregate([{ '$group': {'_id' : {'cocktail': '$cocktail'} , 'flavor_profile': {'$addToSet' : '$tastes'}}}]);

// filter for bar and return the list of cocktails and checkIns
coll.aggregate([ { '$match': { 'location.name' : 'CH Distillery'}}, {'$group': {'_id': '$cocktail', 'checkIns' : {'$sum' : 1}}}]).pretty();

// get checkins by cocktail for a bar sorted in reverse order
coll.aggregate([ { '$match': { 'location.name' : 'CH Distillery'}}, {'$group': {'_id': '$cocktail', 'checkIns' : {'$sum' : 1}}}, {'$sort' : {'checkIns' : -1}}]).pretty();

// aggregate all tastes for the entire database
coll.aggregate([{'$unwind' : '$tastes'}, {'$group' : { '_id': '$tastes', "count" : {'$sum': 1}}}, {'$sort' :{'count': -1}}, {'$limit' : 10}]);