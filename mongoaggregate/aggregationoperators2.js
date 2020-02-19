//replaceRoot
//replaceWith is an alias for replaceRoot
//replaces the input document with the specified document (all fields including _id).

db.orders.aggregate([
    {
        $lookup: {
            from: "items",
            localField: "item",
            foreignField: "item",
            as: "fromItems"
        }
    }
])


db.collection.insertMany([
    { "_id": 1, "name" : { "first" : "John", "last" : "Backus" } },
    { "_id": 2, "name" : { "first" : "John", "last" : "McCarthy" } },
    { "_id": 3, "name": { "first" : "Grace", "last" : "Hopper" } }
 ])

 db.collection.insertOne(
    { "_id": 4, "firstname": "Ole-Johan", "lastname" : "Dahl" }
 )

//replaceroot replaces the original document with field we mentioned in the newRoot key
//this operation fails if the original document does not have a name field.
 db.collection.aggregate([{ $replaceRoot: { newRoot: "$name" } }])

    // { "first" : "John", "last" : "Backus" }
    // { "first" : "John", "last" : "McCarthy" }
    // { "first" : "Grace", "last" : "Hopper" }

//in order to handle null values we use mergeObjects
//mergeObjects combine multiple documents into single document

db.collection.aggregate([
    {$replaceRoot: {newRoot: {$mergeObjects: [{_id: "$_id", first: "", last: ""}, "$name"]}}}
])

//we could also use a match condition to avoid this error
db.collection.aggregate([
    { $match: { name : { $exists: true, $not: { $type: "array" }, $type: "object" } } },
    { $replaceRoot: { newRoot: "$name" } }
 ])

 //we could also use ifNull
//  {$ifNull: [{expression}, {if expression results in null this will be executed}]}
db.collection.aggregate([
    {$replaceRoot: {newRoot: {$ifNull: ["$name", {_id: "$_id", missingName: true}]}}}
])

//in document in array
db.students.aggregate([
    {$unwind: "$grades"}, // if in an array first unwind
    {$replaceRoot: {newRoot: "$grades"}}
])

//we could also combine fields to create a new document

db.students.insertMany([ { "_id" : 1, "first_name" : "Gary", "last_name" : "Sheffield", "city" : "New York" },
{ "_id" : 2, "first_name" : "Nancy", "last_name" : "Walker", "city" : "Anaheim" },
{ "_id" : 3, "first_name" : "Peter", "last_name" : "Sumner", "city" : "Toledo" }])

db.students.aggregate([
    {$replaceRoot: {
        newRoot: {
            fullname: {
                $concat: ["$first_name", " ", "$last_name"]
            },
            city: "$city"
        }
    }}
])

// to give default values to non existing fields we use replace method like below.
db.contacts.insert([
    { "_id" : 1, name: "Fred", email: "fred@example.net" },
    { "_id" : 2, name: "Frank N. Stine", cell: "012-345-9999" },
    { "_id" : 3, name: "Gren Dell", home: "987-654-3210", email: "beo@example.net" }
 ]);

 db.contacts.aggregate([
     {$replaceRoot: {
         newRoot: {
             $mergeObjects: [
                 {_id: "", name:"", email:"", cell:"", home:""},
                 "$$ROOT"]
         }
     }}
 ])