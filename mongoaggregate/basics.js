//mongo "mongodb://cluster0-shard-00-00-jxeqq.mongodb.net:27017,cluster0-shard-00-01-jxeqq.mongodb.net:27017,cluster0-shard-00-02-jxeqq.mongodb.net:27017/aggregations?replicaSet=Cluster0-shard-0" --authenticationDatabase admin --ssl -u m121 -p aggregations --norc
//pipleline has 3 stages - {match} {project} {group} -- you can use any no of stages below 3 as well with few constraints.
//structure 
db.userColl.aggregate([{stage1}, ,{...stageN}], {options})
db.solarSystem.aggregate(
    [
        {
            $match: {
                atmosphericComposition: { $in: [/O2/]}, //regex
                meanTemperature: { $gte: -40, $lte: 40}
            }
        },
        {
            $project: {
                _id: 0,
                name: 1,
                hasMoons: { $gt: ["$numberOfMoons", 0]} //["$numberOfMoons", 0] -- is an expression(exps always appear in value(not key) - it works like a function.)
            }
        }
    ],
    {
        allowDiskUse: true
    }
)

//Field path -  "$fieldName" ("$numberOfMoons") used to access the value of the field in the document 
//System Variable - "$$UPPERCASE" ("$$CURRENT", there some other see https://docs.mongodb.com/manual/reference/aggregation-variables/)
//User Variable - "$$foo"