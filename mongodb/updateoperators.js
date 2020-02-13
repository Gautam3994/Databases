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

