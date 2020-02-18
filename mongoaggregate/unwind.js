//$unwind
//creates an document entry for each element in an array.

//EXAMPLE

// db.inventory.insertOne({ "_id" : 1, "item" : "ABC1", sizes: [ "S", "M", "L"] })
// db.inventory.aggregate( [ { $unwind : "$sizes" } ] )

// /RESULT
// { "_id" : 1, "item" : "ABC1", "sizes" : "S" }
// { "_id" : 1, "item" : "ABC1", "sizes" : "M" }
// { "_id" : 1, "item" : "ABC1", "sizes" : "L" }

//IT IS USEFUL WHEN TRY TO GROUP EACH ELEMENT OF AN ARRAY NORMAL METHOD WONT WORK BECAUSE OF POSITION VARIATION
//below gives a document per year with highest rated genre for that year.
db.movies.aggregate(
    [
        {
            $match: {
                runtime: {$gte: 90},
                year: {$gte: 2010, $lte: 2015},
                "imdb.rating": {$gt: 0}
            }
        },
        {
            $unwind: "$genres"
        },
        {
            $group: {
                    _id: {
                        year: "$year", //first groupiing by year
                        genres: "$genres" // then by genre for each year
                    },
                    average_rating: {
                        $avg: "$imdb.rating" //calculating average rating for each genre in each year
                    }
            }
        },
        {
            $sort: {"_id.year": -1, average_rating: -1}
        },
        {
            $group: {
                _id: "$_id.year", //remember always use dollar while using in values
                genres: {$first: "$_id.genres"}, // as it is already sorted we just want the highest for that year we take first value
                average_rating: {$first: "$average_rating"}
            }
        },
        {
            $sort: {
                _id: -1
            }
        }
    ]
).pretty()

//SHORT FORM
// { $unwind: <field path> }

// LONG FORM
// {
//   $unwind:
//     {
//       path: <field path>,
//       includeArrayIndex: <string>, name of field where array element position 
//       preserveNullAndEmptyArrays: <boolean>  
//     }
// }

//WORKOUT

db.movies.aggregate([
    {
        $match: {
            cast: {$elemMatch: {$exists: true}},
            "imdb.rating": {$gt: 0},
            languages: {$in: ["English"]} 
        }
    },
    {
        $unwind: "$cast"
    },
    {
        $group: {
            _id: "$cast",
            num_of_films: {
                $sum: 1
            },
            average_rating: {
                $avg: "$imdb.rating"
            }
        }
    },
    {
            $project: {
                num_of_films: 1,
              average: {
                $divide: [
                  { $trunc: { $multiply: ["$average_rating", 10] } }
                  , 10
                ]
              }
            }
          
    },
    {
        $sort: {
            num_of_films: -1
        }
    }
])
//To trim down to one decimal we use this.


// {
//     $project: {
//       numFilms: 1,
//       average: {
//         $divide: [
//           { $trunc: { $multiply: ["$average", 10] } }
//           , 10
//         ]
//       }
//     }
//   }