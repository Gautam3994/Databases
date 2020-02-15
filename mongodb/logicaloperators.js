// $or
db.movieDetails.find({$or: [{"tomato.meter": {$gt: 95}}, {"metacritic": {$gt: 85}}]}, {_id:0, title:1, "tomato.meter":1, metacritic: 1}).pretty() 
// !!! $and - it not required unless you are specifying two different conditions for the same field
db.movieDetails.find({$and: [{"tomato.meter": {$gt: 95}}, {"metacritic": {$gt: 85}}]}, {_id:0, title:1, "tomato.meter":1, metacritic: 1}).count()
//above is equivalent to below
db.movieDetails.find({"tomato.meter": {$gt: 95}}, {metacritic: {$gt: 85}}).count()
//where to use $and
// if you want to use two filters for the same field you must use $and
db.movieDetails.find({$and: [{"metacritic": {$ne: null}}, {"metacritic": {$exists: true}}]},  {_id:0, title:1, metacritic: 1}).pretty()
db.movieDetails.find({$and: [{"metacritic": null}, {metacritic: {$exists: true}}]}, {_id:0, title:1, metacritic: 1}).pretty()

db.shipwrecks.find({$or: [{"watlev": "always dry"}, {"depth": 0}]}).count()