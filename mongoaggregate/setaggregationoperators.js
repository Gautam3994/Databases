//$setIntersection
//it check two or more arrays and returns an array with values present in every array.
//This operator considers arrays as sets.
//duplicate values in the same array are ignored.
//if array contains nested values it ignores it and only evaluates top level

db.experiments.aggregate(
    [
      { $project: { A: 1, B: 1, commonToBoth: { $setIntersection: [ "$A", "$B" ] }, _id: 0 } }
    ]
 )

 //This returns an array of values present in every arrays