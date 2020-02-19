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

  
  //To perform uncorrelated subqueries between two collections as well as allow other join conditions besides a single equality match, the $lookup stage has the following syntax:
//   {
//     $lookup:
//       {
//         from: <collection to join>,
//         let: { <var_1>: <expression>, …, <var_n>: <expression> }, -- inner pipeline cannot access the fields so we assign them to variables("$$<variable>") first.
//         pipeline: [ <pipeline to execute on the collection to join> ], --we must $expr in match everything works the same as in normal pipeline
//         as: <output array field>
//       }
//  }

// db.orders.insert([
//     { "_id" : 1, "item" : "almonds", "price" : 12, "ordered" : 2 },
//     { "_id" : 2, "item" : "pecans", "price" : 20, "ordered" : 1 },
//     { "_id" : 3, "item" : "cookies", "price" : 10, "ordered" : 60 }
//   ])

//   db.warehouses.insert([
//     { "_id" : 1, "stock_item" : "almonds", warehouse: "A", "instock" : 120 },
//     { "_id" : 2, "stock_item" : "pecans", warehouse: "A", "instock" : 80 },
//     { "_id" : 3, "stock_item" : "almonds", warehouse: "B", "instock" : 60 },
//     { "_id" : 4, "stock_item" : "cookies", warehouse: "B", "instock" : 40 },
//     { "_id" : 5, "stock_item" : "cookies", warehouse: "A", "instock" : 80 }
//   ])

//mutiple condition join

db.orders.aggregate(
    [
        {
            $lookup: {
                from: "warehouses",
                let: {order_item: "$item", quantity: "$ordered"},
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {$eq: ["$$order_item", "$stock_item"]},
                                    {$gte: ["$instock", "$$quantity"]}
                                ]
                            }
                        }
                    }
                ],
                as: "stockdata"
            }
        }
    ]
)
// BELOW IS EQUIVALENT SQL

// SELECT *, stockdata
// FROM orders
// WHERE stockdata IN (SELECT warehouse, instock
//                     FROM warehouses
//                     WHERE stock_item= orders.item
//                     AND instock >= orders.ordered );
  
//uncorrelated subquery(no relation between inner query and outer query) .
//simply adding new array from another collection

// db.absences.insert([
//     { "_id" : 1, "student" : "Ann Aardvark", sickdays: [ new Date ("2018-05-01"),new Date ("2018-08-23") ] },
//     { "_id" : 2, "student" : "Zoe Zebra", sickdays: [ new Date ("2018-02-01"),new Date ("2018-05-23") ] },
//  ])

//db.holidays.insert([
//     { "_id" : 1, year: 2018, name: "New Years", date: new Date("2018-01-01") },
//     { "_id" : 2, year: 2018, name: "Pi Day", date: new Date("2018-03-14") },
//     { "_id" : 3, year: 2018, name: "Ice Cream Day", date: new Date("2018-07-15") },
//     { "_id" : 4, year: 2017, name: "New Years", date: new Date("2017-01-01") },
//     { "_id" : 5, year: 2017, name: "Ice Cream Day", date: new Date("2017-07-16") }
//  ]) 

db.absences.aggregate([
    {
       $lookup:
          {
            from: "holidays",
            pipeline: [
               { $match: { year: 2018 } },
               { $project: { _id: 0, date: { name: "$name", date: "$date" } } },
               { $replaceRoot: { newRoot: "$date" } } //promoting a document field as root document
            ],
            as: "holidays"
          }
     }
 ])
