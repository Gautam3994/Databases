
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
            $or: [
                {"airlines.airplane":  "747"},
                {"airlines.airplane":  "380"}
            ]
        }
    },
    // {
    //     $project: {
    //         _id: 0,
    //         name: 1,
    //         "airlines.airline.name": 1,
    //         "airlines.airplane": 1
    //     }
    // },
    {
        $group: {
            _id: {
                airplane: "$airlines.airplane",
                name: "$name"
            },
            count: {
                $sum: 1
            }
        }
    }

], {
    allowDiskUse: true
}).pretty()