//$project is much more than project in find method
//using $project we can reassign existing field values and get new fields
//it is like map in python applies a function to all elements of a iterable.
db.solarSystem.aggregate(
    [
        {
            $project: { }
        }
    ]
    )
//NORMAL USE
db.solarSystem.aggregate(
    [
        {
            $project: { _id: 0, name: 1, "gravity.value": 1}
        }
    ]
    )
//REASSIGNING TO EXISTING VARAIBLE NAME
db.solarSystem.aggregate(
    [
        {
            $project: { _id: 0, name: 1, gravity: "$gravity.value"} 
        }
    ]
    )
//ASSIGNING TO NEW VARAIBLE
db.solarSystem.aggregate(
    [
        {
            $project: { _id: 0, name: 1, surfaceGravity: "$gravity.value"} 
        }
    ]
    )


//(gravity on other / gravity on earth) * weight = weight on other planet
{ $mulitply: [gravityRatio, yourweightOnEarth ]} 
{ $divide: ["$gravity.value", gravityOfEarth]}
//gravityOfEarth and weight on earth is hard coded
db.solarSystem.aggregate(
    [
        {
            $project: 
            { 
                _id: 0, 
                name: 1, 
                myWeight: 
                        { 
                            $multiply: [{$divide: ["$gravity.value", 9.8]}, 76]
                        }
            } 
        }
    ])