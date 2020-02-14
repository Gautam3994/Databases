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

