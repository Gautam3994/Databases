//METHODS
//sort, skip, limit and counts
db.solarSystem.find({}, {_id: 0, numberOfMoons: 1, name: 1}).pretty()

//skip 
db.solarSystem.find({}, {_id: 0,  name: 1, numberOfMoons: 1}).skip(5).pretty()//skips the first 5 documents in the order insertion to the collections t is called natural order
//limit
db.solarSystem.find({}, {_id: 0,  name: 1, numberOfMoons: 1}).limit(5).pretty()
//count
db.solarSystem.find({}, {_id: 0,  name: 1, numberOfMoons: 1}).count()
//sort
db.solarSystem.find({}, {_id: 0,  name: 1, numberOfMoons: 1}).sort({numberOfMoons: -1}).pretty()