//$project is much more than project in find method
//using $project we can reassign existing field values and get new fields
//it is like map in python applies a function to all elements of a iterable.
db.solarSystem.aggregate(
    [
        {
            $project: { }
        }
    ]
    )
//NORMAL USE
db.solarSystem.aggregate(
    [
        {
            $project: { _id: 0, name: 1, "gravity.value": 1}
        }
    ]
    )
//REASSIGNING TO EXISTING VARAIBLE NAME
db.solarSystem.aggregate(
    [
        {
            $project: { _id: 0, name: 1, gravity: "$gravity.value"} 
        }
    ]
    )
//ASSIGNING TO NEW VARAIBLE
db.solarSystem.aggregate(
    [
        {
            $project: { _id: 0, name: 1, surfaceGravity: "$gravity.value"} 
        }
    ]
    )


//(gravity on other / gravity on earth) * weight = weight on other planet
{ $mulitply: [gravityRatio, yourweightOnEarth ]} 
{ $divide: ["$gravity.value", gravityOfEarth]}
//gravityOfEarth and weight on earth is hard coded
db.solarSystem.aggregate(
    [
        {
            $project: 
            { 
                _id: 0, 
                name: 1, 
                myWeight: 
                        { 
                            $multiply: [{$divide: ["$gravity.value", 9.8]}, 76]
                        }
            } 
        }
    ])

//WORKOUT
var pipeline = [
    {
        $match: {
            "imdb.rating": {$gte: 7},
            genres: {$nin: ["Crime", "Horror"]},
            $or: [{rated: "PG"}, {rated: "G"}],
            $and: [{languages: "English"}, {languages: "Japanese"}]
        }
    },
    {
        $project: {
            _id: 0,
            title: 1,
            rated: 1
        }
    }
]
db.movies.aggregate(pipeline).itcount()
load('validateLab1.js')
validateLab1(pipeline)

//WORKOUT-2
db.movies.aggregate(
    [
        {
            $match: {
                title: {
                    $type: "string" //check if the type is string
                }
            }
        },
        {
            $project: {
                title: {
                    $split: ["$title", " "] // ["field to split", "delimiter"]
                }
            }
        }, 
        {
            $match: {
                title: {
                    $size: 1 //if size is 1 the resulting document would be displayed
                }
            }
        }
    ]
).itcount()

//WORKOUT
//check if the writers is an array field and if it exists.
//USE METHOD 2
//METHOD - 1 
db.movies.aggregate(
    [
        {
            $match: {
                    $and: [
                        {
                            writers: {
                            $exists: true
                        }},
                        {
                            writers: {
                                $type: "array"
                            }
                        }
                    ]
            }
        }
    ]
).itcount()
//RESULT - 41572
//METHOD - 2
db.movies.aggregate(
    [
        {
        $match: {
            writers: {
                        $elemMatch: {$exists: true}
                        }
                }
        }
    ]
).itcount()
//RESULT - 41500
//some times an array value can appear in multiple places.
//and their names may have slightly different values.
//"writers" : [ "Vincenzo Cerami (story)", "Roberto Benigni (story)" ]
//vs Vincezno Cerami in cast
// this results in undesired resuts when comparing so we use $map
db.movies.aggregate(
    [
        {
        $match: {
            writers: {$elemMatch: {$exists: true}},
            directors: {$elemMatch: {$exists: true}},
            cast: {$elemMatch: {$exists: true}}
                }
        },
        {
        $project: {
            writers: {
                $map: {
                    input: "$writers",
                    as: "writer", 
                    in: {
                        $arrayElemAt: [
                            {$split: ["$$writer", " ("]},
                            0
                        ]            
                    }
                }
            },
            directors: 1,
            cast: 1, 
            _id: 0
        }
        }, 
        {
            $project: {
                labor_of_love: {
                    $gt: [
                   {$size: {$setIntersection: ["$writers", "$directors", "$cast"]}}, //returns an array of all three matching values.
                    0
                    ]
                }
            }
        },
        {
            $match: {"labor_of_love": true}
        }
    ]
).itcount()
// $cond: { if: { $gte: [ "$qty", 250 ] }, then: 30, else: 20 }
{
    $project: {
        "in cast": {
            $in: ["writers.$[]", "$cast"]
        }
    }
}

