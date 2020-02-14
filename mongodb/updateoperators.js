// set and unset in basics
//min - update if the value is less than field value
db.cricketers.updateOne({_id: 6}, {$min: {"best.runs": 162}})

//max - update if the value is greater than the field value
db.cricketers.updateOne({_id: 6}, {$max: {"best.runs": 264}})

//if field doesnt exist it is created for both min and max
db.cricketers.updateOne({_id: 6}, {$mul: {"best.runs": NumberDecimal(".50")}})

//$mul sets value to 1 if field doesnt exists
db.cricketers.updateOne({_id: 6}, {$mul: {"best.runs": NumberDecimal("2")}})

//$currentDate
db.cricketers.updateOne({_id: 6}, {$currentDate: {lastmodified: true}})

//$inc
db.cricketers.updateOne({_id: 6}, {$inc: {"best.runs": 1}})

//$rename if field doesnt exist rename does nothing.
db.cricketers.updateMany({}, {$rename: {"best": "high_score"}})

//$setOnInsert these fields are set only on insert.
db.cricketers.update({_id: 7}, {$set: {_id: 7},$setOnInsert: {lastmodified: true}}, {upsert: true})

//array update operators
//$add to set adds a value if only the values is not already present
// if field oesnt exist it adds it
//below adds it as nested array
db.cricketers.updateOne({_id: 1}, {$addToSet: {trophies: ["CB Series"]}})
//to add as value to array
db.cricketers.updateOne({_id: 1}, {$addToSet: {trophies: "CB Series"}})

//$each can be used with $addToSet and $push this is similar to the above one
//but you can do multiple updates
db.cricketers.updateOne({_id: 1}, {$addToSet: {trophies: {$each: ["Asia Cup", "Super Series"]}}})

//$push appends the value to the array and doesnt care if it already exists or not
db.cricketers.updateOne({_id: 8}, {$push: {trophies: "World Cup 1999"}}, {upsert: true})
//nested array
db.cricketers.updateOne({_id: 8}, {$push: {trophies: ["World Cup 1999"]}}, {upsert: true})
//for multiple values use $each
db.cricketers.updateOne({_id: 8}, {$push: {trophies: {$each: ["Asia Cup", "Super Series"]}}})
// db.cricketers.updateOne({_id: 8}, {$push: {trophies: {$each: [{cup: "Asia Cup"}, {cup: "Asia Cup", cup: "Super Series"}], $slice: 20}}})

//modifiers for push
//$each is already covered
//$slice limits the number of array elements.IT IS ONLY AVAILABLE FOR $push and it must appear with $each(which can be null)
db.cricketers.updateOne({_id: 8}, {$push: {trophies: {$each: [], $slice: -1}}})
//0 to update as empty array
db.cricketers.updateOne({_id: 8}, {$push: {trophies: {$each: [], $slice: 0}}})
//projection
db.cricketers.find({}, {trophies: {$slice: 1}, name: 0, awards: 0}).pretty() //-1 for last value
//projection range
db.posts.find( {}, { comments: { $slice: [ 20, 10 ] } } )

//$position is used to specify at what position we must add the value can be used only with $push
db.cricketers.updateOne({_id: 8}, {$push: {trophies: {$each: [], $position: 0}}}) // 0 start --- any number = middle, negativ to count from last


