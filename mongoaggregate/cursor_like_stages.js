//METHODS
//sort, skip, limit and counts
db.solarSystem.find({}, {_id: 0, numberOfMoons: 1, name: 1}).pretty()

//skip 
db.solarSystem.find({}, {_id: 0,  name: 1, numberOfMoons: 1}).skip(5).pretty()//skips the first 5 documents in the order insertion to the collections t is called natural order
//limit
db.solarSystem.find({}, {_id: 0,  name: 1, numberOfMoons: 1}).limit(5).pretty()
//count
db.solarSystem.find({}, {_id: 0,  name: 1, numberOfMoons: 1}).count()
//sort
db.solarSystem.find({}, {_id: 0,  name: 1, numberOfMoons: 1}).sort({numberOfMoons: -1}).pretty()

//same using stages in aggregate.
//$limit
db.solarSystem.aggregate(
    [
        {
            $project: {
                _id: 0,
                name: 1,
                numberOfMoons: 1
            }
        },
        {
            $limit: 5
        }
    ]
                        )
//$skip
db.solarSystem.aggregate(
    [
        {
            $project: {
                _id: 0,
                name: 1,
                numberOfMoons: 1
            }
        },
        {
            $skip: 5
        }
    ]
                        )
//$count
db.solarSystem.aggregate(
    [
        {
            $match: {
                type: "Terrestrial planet"
            }
        },
        {
            $count: "terrestrial planets"
        }
    ]
                        )
//$sort
//if sort is near the beginning of the pipeline before a project and unwinds and group stage
// it can make use of indexes
db.solarSystem.aggregate(
    [
        {
            $project: {
                _id: 0,
                name: 1,
                numberOfMoons: 1,
                hasMagneticField: 1
            }
        },
        {
            $sort: {
                hasMagneticField: -1,
                numberOfMoons: -1 //we can sort by more than just one element
            }
        }
    ],
    {
        allowDiskUse: true //default memory allocated is 100 MB for more usage we use this command
        //if we do not do this and it takes more 100MB the operation will be terminated.
    }
                        )

//WORKOUT - 1

db.movies.aggregate(
        [
            {
                $match: {
                    countries: {
                        $in: ["USA"]
                    },
                    "tomatoes.viewer.rating": {
                        $gte: 3
                    },
                    cast: {$elemMatch: {$exists: true}}    
                }
            },
            {
                $addFields: {
                    favorites: [
                        "Sandra Bullock",
                        "Tom Hanks",
                        "Julia Roberts",
                        "Kevin Spacey",
                        "George Clooney"],
                    _id: 0,
                    countries: 1,
                    rating: "$tomatoes.viewer.rating"                      
                }
            },
            {
                $addFields: {
                    num_favs: {
                        $size: {
                            $setIntersection: [
                                "$favorites", 
                                "$cast"
                            ]
                        }
                    },
                    
                }
            },
            {
                $sort: {
                    num_favs: -1,
                    "tomatoes.viewer.rating": -1,
                    title: -1
                }
            },
            {
                $skip: 24
            },
            {
                $limit: 1
            }
        ]
                    ).pretty()

//WORKOUT - 2
db.movies.aggregate(
    [
        {
            $match:
            {
                "imdb.rating": {
                    $gte: 1
                },
                "imdb.votes": {
                    $gte: 1
                },
                released: {
                    $gte: ISODate("1990-01-01T00:00:00Z")
                }
            }
        },
        {
            $addFields: 
            {
                x_max: 1521105,
                x_min: 5,
                min: 1,
                max: 10,
                x: "$imdb.votes",
            }
        },
        {
            $addFields: 
            {
                scaled_votes: {
                    $add: [
                        1,
                        {
                          $multiply: [
                            9,
                            {
                              $divide: [
                                { $subtract: ["$x", "$x_min"] },
                                { $subtract: ["$x_max", "$x_min"] }
                              ]
                            }
                          ]
                        }
                      ]
                }
            }
        },
        {
            $project: {
                normalized_rating: {
                    $avg: [
                        "$scaled_votes",
                        "$imdb.rating"
                    ]
                },
                title: 1
            }
        },
        {
            $sort: {
                normalized_rating: 1
            }
        },
        {
            $limit: 1
        }
    ]
                    ).pretty()