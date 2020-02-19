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
        $project: {
            "airlines.airplane": 1,
            "airlines.airline.name": 1,
            name: 1
        }
    },
    // {
    //     $match: {
    //         // "airlines.airplane": {$regex: /747/}
    //         airlines: {$elemMatch: {airplane: {$regex: /747/}}}
    //     }
    // },
    {
        $group: {
            _id: "$airlines.airplane"
        }
    },
    // {
    //     $limit: 1
    // }
], {
    allowDiskUse: true
}).pretty()

//
db.air_alliances.aggregate(
    [
        {
            $lookup: {
                from: "air_airlines",
                localField: "airlines",
                foreignField: "name",
                as: "airlines" // this will overwrite existing field
            }
        },
        {
            $match: {
                airlines: {base: "LVI"}
            }
        }
    ]
).pretty()

//         airlines: {$elemMatch: {airplane: {$regex: /747/}}}