//{$group: { _id: <matching/grouping criteria> }}

db.movies.aggregate(
        [
            {
                $group: {
                    _id: "$year" //each value we specify here is an expression
                    //using just one expression is equivalent to DISTINCT in sql
                    // this result creation of a document for each unique value in the $year
                }
            }
        ]
                    ) 

//aggregation accumulator expression - $sum.
db.movies.aggregate(
    [
        {
            $group: {
                _id: "$year",
                num_films_in_year: {
                    $sum: 1 //this sum 1 and set it to num_films_in_year each time a document is grouped
                }
            }
        },
        {
            $sort: {
                num_films_in_year: -1
            }
        }
    ]
                )

//inorder to match the id we give must same value or range of values
db.movies.aggregate(
    [
        {
            $group: {
                _id: {
                    numDirectors: {
                        $cond: {
                            if: {$isArray: "$directors"}, then: {$size: "$directors"}, else: 0
                        }
                    }
                },
                numFilms: {
                    $sum: 1
                },
                averageMetacritic: {
                    $avg: "$metacritic" //this create an average metacritic field for each group

                    // accumulator expressions will ignore values that is not of the type expected
                    // in the expression or if the value is missing.
                    //if all value are not of expected type the result will be null.
                    //here sometime metacritic field is not there so it results in null
                }
            }
        },
        {
            $sort: {
                "_id.numDirectors": -1
            }
        }
    ]
                    )
//db.movies.findOne({directors: {$size: 44}})

//Group all documents.
db.movies.aggregate(
    [
        {
            $group: 
            {
                _id: null,
                count: {$sum: 1}
            }
        }
    ]
)

//avg metacritic
db.movies.aggregate(
    [
        {
            $match: 
            {
                metacritic: {
                    $gte: 0
                }
            }
        },
        {
            $group: {
                _id: null,
                averageMetacritic: {
                    $avg: "$metacritic"
                }
            }
        }
    ]
)

//rectifying older one
db.movies.aggregate(
    [
        {
            $match: 
            {
                metacritic: {
                    $gte: 0
                }
            }
        },
        {
            $group: {
                _id: {
                    numDirectors: {
                        $cond: {
                            if: {$isArray: "$directors"}, then: {$size: "$directors"}, else: 0
                        }
                    }
                },
                numFilms: {
                    $sum: 1
                },
                averageMetacritic: {
                    $avg: "$metacritic"
                }
            }
        },
        {
            $sort: {
                "_id.numDirectors": -1
            }
        }
    ]
                    )
