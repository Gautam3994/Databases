//$setIntersection
//it check two or more arrays and returns an array with values present in every array.
//This operator considers arrays as sets.
//duplicate values in the same array are ignored.
//if array contains nested values it ignores it and only evaluates top level

db.experiments.aggregate(
    [
      { $project: { A: 1, B: 1, commonToBoth: { $setIntersection: [ "$A", "$B" ] }, _id: 0 } }  //This returns an array of values present in every arrays
    ]
 )

// $addToSet - returns an array of all unique values after applying an expression to each document in a group of documents that share the same group by key.
//it is only available grouping stages

db.sales.insertMany([
  { "_id" : 1, "item" : "abc", "price" : 10, "quantity" : 2, "date" : ISODate("2014-01-01T08:00:00Z") },
{ "_id" : 2, "item" : "jkl", "price" : 20, "quantity" : 1, "date" : ISODate("2014-02-03T09:00:00Z") },
{ "_id" : 3, "item" : "xyz", "price" : 5, "quantity" : 5, "date" : ISODate("2014-02-03T09:05:00Z") },
{ "_id" : 4, "item" : "abc", "price" : 10, "quantity" : 10, "date" : ISODate("2014-02-15T08:00:00Z") },
{ "_id" : 5, "item" : "xyz", "price" : 5, "quantity" : 10, "date" : ISODate("2014-02-15T09:12:00Z") }
])

db.sales.aggregate([
  {
    $group: {
      _id: {day: {$dayOfYear: "$date"}, year: {$year: "$date"}},
      itemsSold: {$addToSet: "$item"} //for each group unique values in the item field will be added to this array 
    }
  }
])
