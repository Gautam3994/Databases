//$in operator checks the if the field has the values we specify.
db.movieDetails.find({rated: {$in: ["PG", "R"]}}).pretty().count()

