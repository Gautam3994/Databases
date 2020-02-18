//$unwind
//creates an document entry for each element in an array.

//EXAMPLE

// db.inventory.insertOne({ "_id" : 1, "item" : "ABC1", sizes: [ "S", "M", "L"] })
// db.inventory.aggregate( [ { $unwind : "$sizes" } ] )
// { "_id" : 1, "item" : "ABC1", "sizes" : "S" }
// { "_id" : 1, "item" : "ABC1", "sizes" : "M" }
// { "_id" : 1, "item" : "ABC1", "sizes" : "L" }
c