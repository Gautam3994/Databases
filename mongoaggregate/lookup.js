//lookup is left outer join
//combines all documents form entries on the left with matching documents on the right

//SYNTAX
// {
//     $lookup:
//       {
//         from: <collection to join>, //this collection should not be sharded and must exist within the same database
//         localField: <field from the input documents>, //working collection // it can be array for single value
//         foreignField: <field from the documents of the "from" collection>, // from collection // it can be array for single value
//         as: <output array field> // this could be any name but if the name already exists in the document then it will be overwritten.
//       }
//  }

//local and foreign are checked for equality if there are matching values then that value will be in the field we specify in "as"
// the result will contain the entire matching document

db.air_alliances.aggregate(
    [
        {
            $lookup: {
                from: "air_airlines",
                localField: "airlines",
                foreignField: "name",
                as: "airlines" // this will overwrite existing field
            }
        }
    ]
).pretty()