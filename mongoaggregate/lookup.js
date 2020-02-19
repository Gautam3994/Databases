//lookup is left outer join
//combines all documents form entries on the left with matching documents on the right

//SYNTAX
// {
//     $lookup:
//       {
//         from: <collection to join>, //this collection should not be sharded and must exist within the same database
                                        //however collection in which you are running the query can be sharded.
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

//WORKOUT

//THIS METHOD IS NOT PREFERRED AS MATCH IS GIVEN IN A EARLIER STAGE IN OTHER METHOD
//IT IS ALSO MORE CLEAR

db.air_alliances.aggregate([
    {
        $lookup: {
            from: "air_routes",
            localField: "airlines",
            foreignField: "airline.name",
            as: "airlines"
        }
    }, 
    {
        $unwind: "$airlines" //whenever there is a long array consider using $unwind
    },
    {
        $match: {
            "airlines.airplane": /747|380/
        }
    },
    {
        $group: {
            _id: {
                airplane: "$name" //be clear about what field you need to group by
            },
            count: {
                $sum: 1
            }
        }
    }

], {
    allowDiskUse: true
}).pretty()

//OTHER METHOD

db.air_routes.aggregate([
    {
      $match: {
        airplane: /747|380/
      }
    },
    {
      $lookup: {
        from: "air_alliances",
        foreignField: "airlines",
        localField: "airline.name",
        as: "alliance"
      }
    },
    {
      $unwind: "$alliance"
    },
    {
      $group: {
        _id: "$alliance.name",
        count: { $sum: 1 }
      }
    },
    // {
    //   $sort: { count: -1 }
    // }
  ]).pretty()
  