//match is a filter rather than a find
//$where cannot used here and if $test is used it must be used in first stage only
//$match is first stage we can use indexes to improve speed of queries.
// refer https://docs.mongodb.com/manual/reference/operator/aggregation/match/
db.solarSystem.aggregate(
    [
        {
            $match: { }
        }
    ]
    )

    db.solarSystem.aggregate(
        [
            {
                $match: { type: {$ne: "Star"} }
            }
        ]
        ).pretty() //count cannot be used normally

db.solarSystem.find({type: {$ne: "Star"}}).count()
db.solarSystem.aggregate(
    [
        {
            $match: { type: {$ne: "Star"} }
        },
        {
            $count: "planets"
        }
    ]
    )

//match does not have projection like find has but there is another stage particulary for this.
//match does not make use of aggrefation expressions.

//WORKOUT
var pipeline = [
    {
        $match: {
            "imdb.rating": {$gte: 7},
            genres: {$nin: ["Crime", "Horror"]},
            $or: [{rated: "PG"}, {rated: "G"}],
            $and: [{languages: "English"}, {languages: "Japanese"}]
        }
    }
]
db.movies.aggregate(pipeline).itcount()
load('validateLab1.js')
validateLab1(pipeline)