//bucket is another grouping stage where we group data by range of values
// {
//     $bucket: {
//         groupBy: <expression>,
//         boundaries: [ <lowerbound1>, <lowerbound2>, ... ],
//         default: <literal>,
//         output: {
//            <output1>: { <$accumulator expression> },
//            ...
//            <outputN>: { <$accumulator expression> }
//         }
//      }
//   }

    db.movieDetails.aggregate([
        {
            $bucket: {
                groupBy: "$imdb.rating",
                boundaries: [0, 5, 8, Infinity], //rating with 0 to 5 will be grouped as 0 //boundary values must be of same type expect for numbers
                default: "not rated",
                output: {
                    average_per_bucket: {$avg: "$imdb.rating"},
                    count: {$sum: 1} //by default count will be displayed but when we mention a output explicity we have add count seperately
                }
            }
        }
    ])

    // { "_id" : 0, "average_per_rating" : 3.9744897959183674, "count" : 196 } 
    // { "_id" : 5, "average_per_rating" : 6.600685975609756, "count" : 1312 }
    // { "_id" : 8, "average_per_rating" : 8.313725490196079, "count" : 204 }
    // { "_id" : "not rated", "average_per_rating" : null, "count" : 584 }
// in sorting large data we get ram limit error
db.companies.find({}, {number_of_employees: 1}).sort({number_of_employees: -1})

//so we either add a limit
db.companies.find({}, {number_of_employees: 1}).sort({number_of_employees: -1}).limit(10)

//or create Index
db.companies.createIndex({number_of_employees: -1}) 

//buckets
// db.companies.explain().aggregate([
db.companies.aggregate([
    {
        $match: {
            founded_year: {$gt: 1980},
            // number_of_employees: {$ne: null}
        }
    },
    {
        $bucket: {
            groupBy: "$number_of_employees",
            boundaries: [0, 20, 100, 200, 500, 1000, 5000, Infinity],
            default: "not found",
            output: {
                average_no_employees: {$avg: "$number_of_employees"},
                count: {$sum: 1},
                categories: {$addToSet: "$category_code"}
            }
        }
    }
])

//bucketAuto
// {
//     $bucketAuto: {
//         groupBy: <expression>,
//         buckets: <number>, -- instead of specifying boundries we set no of buckets required -- we may not get no of buckets required if unique values is less than bucket count
//         output: {
//            <output1>: { <$accumulator expression> },
//            ...
//         }
//         granularity: <string>
//     }
//   }

db.movieDetails.aggregate([
    {
        $match: {
            "imdb.rating" : {$gt: 0}
        }
    },
    {
        $bucketAuto: {
            groupBy: "$imdb.rating", //it tries to divide the document as equally as possible
            buckets: 4,
            output: {
                average_no_employees: {$avg: "$imdb.rating"},
                count: {$sum: 1},
            }
        }
    }
])

// function make_granularity_values(){for (let i = 0; i < 100; i++) { db.granularity_test.insertOne({
//     "powers_of_2": Math.pow(2, Math.floor(Math.random() * 10)),
//     "renard_and_e": Math.random() * 10
//   })
// }
// };

db.granularity_test.aggregate([
    {
        $bucketAuto: {
            groupBy: "$powers_of_2",
            buckets: 10,
            granularity: "POWERSOF2" //See doc for other granularity methods
        }
    }
])
