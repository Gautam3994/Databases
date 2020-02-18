//acculumator in project work within the array of the particular doc and no values are carried over to the next doc

//$reduce
//applies an expression to each element in array and converts them to a single value.

// {
//     $reduce: {
//         input: <array>,  --  wrong type and missing  value will result in null
//         initialValue: <expression>, 
//         in: <expression>
//     }
// }

//find max and min
//METHOD - 1
db.icecream_data.aggregate(
    [
        {
            $project: {
                _id: 0,
                max_high: {
                    $reduce: {
                        input: "$trends", //if input is an array empt array reduce give initialValue as output
                        initialValue: -Infinity,
                        in: {
                            $cond: [
                                {$gt: ["$$this.avg_high_tmp", "$$value"]}, //value refers to InitialValue for first time
                                //after the result of first element.
                                "$$this.avg_high_tmp", //refers to particular element in the array.
                                "$$value"
                            ]
                        }
                    }
                }
            }
        }
    ]
)

// METHOD - 2
//remember these work only in a single array
//max 
db.icecream_data.aggregate(
    [
        {
            $project: {
                _id: 0,
                max_high: {
                    $max: "$trends.avg_high_tmp"
                }
            }
        }
    ]
)
//
//remember these work only in a single array
db.icecream_data.aggregate(
    [
        {
            $project: {
                _id: 0,
                min_high: {
                    $min: "$trends.avg_high_tmp"
                }
            }
        }
    ]
)
//avg and standard deviation
//remember these work only in a single array
db.icecream_data.aggregate(
    [
        {
            $project: {
                _id: 0,
                average_cpi: {
                    $avg: "$trends.icecream_cpi"
                },
                cpi_deviation: {
                    $stdDevPop: "$trends.icecream_cpi"//stdDevPop refers to sd on population
                    //if working sample use different method.
                }
            }
        }
    ]
)

//$sum
db.icecream_data.aggregate(
    [
        {
            $project: {
                _id: 0,
                "yearly_sales (millions)": {
                    $sum: "$trends.icecream_sales_in_millions"
                }
            }
        }
    ]
)

//WORKOUT
db.movies.aggregate(
    [
        {
            $match: 
            {
                $and:
                [
                    {
                        awards: {
                                $exists: true
                                }
                    },
                    {
                        awards: {
                        $regex: /^Won .* Oscar/
                                }
                    }
                ]
            }
        },
        {
            $group: {
                _id: null,
                highest_rating: {
                    $max: "$imdb.rating"
                },
                lowest_rating: {
                    $min: "$imdb.rating"
                },
                average_rating: {
                    $avg: "$imdb.rating"
                },
                standard_deviation: {
                    $stdDevSamp: "$imdb.rating"
                }
            } 
        }
    ]
)