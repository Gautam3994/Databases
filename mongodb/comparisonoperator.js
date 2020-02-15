//$gt
db.movieDetails.find({runtime: {$gt: 90}}).pretty()
//$combinatiom
db.movieDetails.find({runtime: {$gt: 90, $lte: 120}}, {_id: 0, title: 1, runtime: 1}).pretty()
db.movieDetails.find({runtime: {$gt: 180}, "tomato.meter": {$gt: 95}}, {_id: 0, title: 1, runtime: 1}).pretty()
//$ne
db.movieDetails.find({rated: {$ne: "UNRATED"}}, {_id: 0, title: 1, rated: 1}).pretty()
//$in operator checks the if the field has the values we specify.
db.movieDetails.find({rated: {$in: ["PG", "R"]}}).pretty()
//$nin
db.movieDetails.find({rated: {$nin: ["PG", "R"]}}).pretty()

db.movieDetails.find({writers: {$in: ["Ethan Coen", "Joel Coen"]}}).count()