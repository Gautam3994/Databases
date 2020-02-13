// mongo "mongodb://cluster0-shard-00-00-jxeqq.mongodb.net:27017,cluster0-shard-00-01-jxeqq.mongodb.net:27017,cluster0-shard-00-02-jxeqq.mongodb.net:27017/test?replicaSet=Cluster0-shard-0" --authenticationDatabase admin --ssl --username m001-student --password m001-mongodb-basics
// to remove a field 
// using normal method
db.customers.update({_id: 2}, {$unset: {tournament: ""}})
// using aggregation
db.customers.aggregate([{ $unset: "tournament"}])
//remove embedded field

//remove array element field

// to insertOne
db.cricketers.insertOne({_id: 1, name: "Sachin Tendulkar", runs: 18644})
db.cricketers.insertOne({_id: 3, name: "Rahul Dravid", runs: 11893, awards: {name: "Padma Bhushan", year: 2019}, best: {runs: 172, tournament: "CB Series", opposition: "Australia", year: 2005}})
db.cricketers.insertOne({_id: 4, name: "MS Dhoni", runs: 10983, awards: {name: "Padma Bhushan", year: 2016}, best: {runs: 183, tournament: "Pepsi Cup", opposition: "Sri lanka", year: 2005}, trophies: ["World Cup", "T20 World Cup"]})
// insertMany
db.cricketers.insertMany([{_id: 5, name: "Sourav Ganguly", runs: 14864, awards: {name: "Padma Shri", year: 2008}, best: {runs: 183, tournament: "Pepsi Cup", opposition: "Sri lanka", year: 1997}, trophies: ["Asia Cup", "Natwest Series"]},
{_id: 6, name: "Rohit Sharma", runs: 10000, awards: {}, best: {runs: 264, tournament: "Paytm Series", opposition: "Sri lanka", year: 2016}, trophies: ["T20 World Cup"]}])
//during bulk insert use unordered insert
db.cricketers.insertMany([{_id: 5, name: "Sourav Ganguly", runs: 14864, awards: {name: "Padma Shri", year: 2008}, best: {runs: 183, tournament: "Pepsi Cup", opposition: "Sri lanka", year: 1997}, trophies: ["Asia Cup", "Natwest Series"]},
{_id: 6, name: "Rohit Sharma", runs: 10000, awards: {}, best: {runs: 264, tournament: "Paytm Series", opposition: "Sri lanka", year: 2016}, trophies: ["T20 World Cup"]}], 
{"ordered": false}) // default is ordered.


//to read normal fields 
db.cricketers.find({runs: 10000}).pretty()

// and is chosen as default if no operator is specified
db.cricketers.find({runs: 10000, "best.runs": 264}).pretty()

// querying in nested documents(or Objects)
db.data.find({"skyConditionObservation.totalCoverage.value": "00"}).pretty().limit(2)

// querying array fields with exact match(even if order changes results wont appear)
db.cricketers.find({trophies: ["World Cup", "T20 World Cup"]}).pretty()

// to query if a particular value exists anywhere in the array
db.cricketers.find({trophies: "T20 World Cup"}).pretty()

// to query if a particular value exists at a particular position.
db.cricketers.find({"trophies.0": "T20 World Cup"}).pretty()

// projections are used to limit the results that appear
//projections _id will appear by deafult unless explicit set to 0
db.cricketers.find({"trophies": "T20 World Cup"}, {name:1, _id:0}).pretty()

//update add a field to document
db.cricketers.updateOne({_id: 1}, {$set: {awards: {name: "Bharat Ratna", year: 2020}}})
db.cricketers.updateOne({_id: 1}, {$set: {trophies: ["World Cup", "Asia Cup"]}})