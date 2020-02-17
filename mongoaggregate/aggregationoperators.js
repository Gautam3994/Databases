//SPLIT
db.movies.aggregate(
    [
        {
            $project: {
                title: {
                        $split: ["$title", " "] // ["field to split", "delimiter"]
                    }
                }
        }
    ]
)
// TYPE
db.solarSystem.aggregate(
    [
        {
            $match: { 
                title: {
                    $type: "string" //check if the type is string
                }
            }
        }
    ]
    )
// SIZE
    db.solarSystem.aggregate(
        [
            {
            $match: {
                title: {
                    $size: 1 //if size is 1 the resulting document would be displayed
                    }
                 }
                }
        ]
        )
//ISARRAY
//check if the given field is an array or not.
//$cond: {if: {$isArray: "$splittedtext"}, then: {$size: "$splittedtext"}, else: "NA"}},
//CONDITION
// { $cond: { if: <boolean-expression>, then: <true-case>, else: <false-case> } }
db.inventory.aggregate(
    [
        {
        $project: {
                item: 1,
                discount:{
                        $cond: { if: { $gte: [ "$qty", 250 ] }, then: 30, else: 20 }
                        }
                    }
        }
    ]
)
//$eq 
db.inventory.aggregate(
    [
      {
        $project:
           {
             qtyEq250: { $eq: [ "$qty", 250 ] }, // ["value", "equalto"] check if value = equalto
             _id: 0
           }
      }
    ]
 )

 //MAP
 //$map applies a expression to each element in the array like map() in python.
 //{ $map: { input: <expression>, as: <string>, in: <expression> } }
 db.collection.aggregate([{
    $project: {
        writers: {
            $map: {
                input: "$writers", // array we are going work with 
                as: "writer",  // Optional field. it refers like writer [for writer in writers]
                in: "$$writer" // expression to apply to each element(writer) as $$writer if 
                // as(above statement) is not specified $$this is used.
            }
        }
    }
    }
 ])
 //EXAMPLE2
 db.temperatures.aggregate( [
    { $addFields:
       {
          "tempsF":
             { $map:
                {
                   input: "$tempsC",
                   as: "tempInCelsius",
                   in: { $add: [ { $multiply: [ "$$tempInCelsius", 9/5 ] }, 32 ] }
                }
             }
        }
     }
 ] )

//  { $arrayElemAt: [ <array>, <idx> ] }
db.users.aggregate([
    {
      $project:
       {
          name: 1,
          first: { $arrayElemAt: [ "$favorites", 0 ] }, //$favourites array to check for
          last: { $arrayElemAt: [ "$favorites", -1 ] } // -1 positon of the array for which value has to be returned
       }
    }
 ])

 //MULTIPLY , DIVIDE , ADD, SUBTRACT
//  { $add: [ <expression1>, <expression2>, ... ] }
//$substract,$multiply, $divide
 db.sales.aggregate(
    [
      { $project: { item: 1, total: { $add: [ "$price", "$fee" ] } } } //$add: [1, 2] numberss to add in expressions
    ]
 )
