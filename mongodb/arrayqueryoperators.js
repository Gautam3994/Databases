

//$all 
// the order in which the values are given doesnt matter.
db.movieDetails.find({genres: {$all: ["Comedy", "Drama"]}}, {_id:0, title: 1, genres: 1})
db.data.find({sections: {$all: ["AG1", "MD1", "OA1"]}}).count()

//$size
db.movieDetails.find({countries: {$size: 1}}).count()
db.data.find({sections: {$size: 2}}).count()

///IMPORTATNT


boxOffice: [ { "country": "USA", "revenue": 228.4 },
             { "country": "Australia", "revenue": 19.6 },
             { "country": "UK", "revenue": 33.9 },
             { "country": "Germany", "revenue": 16.2 },
             { "country": "France", "revenue": 19.8 } ]

db.movieDetails.find({"boxOffice.country": "Germany", "boxOffice.revenue": {$gt: 17}})

db.movieDetails.find({"boxOffice.country": "Germany", "boxOffice.revenue": {$gt: 228}})

use video
martian = db.movieDetails.findOne({title: "The Martian"})
martian
delete martian._id; // to prevent getting duplicate key error.
martian
martian.boxOffice = [
    {"country": "USA", "revenue": 228.4},
    {"country": "Australia", "revenue": 19.6},
    {"country": "UK", "revenue": 33.9},
    {"country": "Germany", "revenue": 16.2},
    {"country": "France", "revenue": 19.8}
]
db.movieDetails.insertOne(martian);
//if you dont you use elematch it will return any doc which satisifies both the condition in any element(one condition satisified in one array elem anf the other in another one)
db.movieDetails.find({"boxOffice.country": "Germany", "boxOffice.revenue": {$gt: 17}})

//the above will display the document eventhough the Germany doesnt have revenue gt 17 but one of the array the has Germany in country ad another element has revenue gt than 17
//so this why we have use elemMatch to write two conditions to the same element.

db.movieDetails.find({boxOffice: {$elemMatch: {"country": "Germany", "revenue": {$gt: 17}}}}) 

db.movieDetails.find({boxOffice: {$elemMatch: {"country": "Germany", "revenue": {$gt: 16}}}})

//$elemMatch is used to check if both the conditions match in array element.
//cannot be used with $text and $where
db.cricketers.find({results: {$elemMatch: {$gte: 80, $lte: 85}}}).pretty()

//in array of embedded elements.
db.cricketers.find({results: {$elemMatch: {product: "xyz", score: {$gte: 8}}}}).pretty()

// {
//     _id: 1,
//     results: [
//        { item: "A", score: 5, answers: [ { q: 1, a: 4 }, { q: 2, a: 6 } ] },
//        { item: "B", score: 8, answers: [ { q: 1, a: 8 }, { q: 2, a: 9 } ] }
//     ]
//  }
//  {
//     _id: 2,
//     results: [
//        { item: "C", score: 8, answers: [ { q: 1, a: 8 }, { q: 2, a: 7 } ] },
//        { item: "B", score: 4, answers: [ { q: 1, a: 0 }, { q: 2, a: 8 } ] }
//     ]
//  }
db.cricketers.updateMany({}, {$pull: {results: {answers: { $elemMatch: { q:2, a: {$gte: 8}}}}}})
db.movieDetails.find({boxOffice: {$elemMatch: {country: "Germany", revenue: {$gt: 17}} }}) 
db.scores({$and: [{results: {$gte: 70}, results: {$lt: 80}}]}) //

db.scores.find({results: {$elemMatch: {$gte: 70, $lt: 80}}})