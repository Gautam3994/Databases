//graphLookup -- it is very similar to lookup
// Performs a recursive search(query for a field in one collection to all documennt in the other collection)
//transitive behaviour if A reports to B and B reports to C then A indirectly reports to C
//in sql this is acheived using recursive common table in alegbra it is called transitive closure.

// {
//     $graphLookup: {
//        from: <collection>,
//        startWith: <expression>, -- where to start the search from
//        connectFromField: <string>,
//        connectToField: <string>,
//        as: <string>,
//        maxDepth: <number>,
//        depthField: <string>,
//        restrictSearchWithMatch: <document>
//     }
//  }

db.parent_reference.aggregate([
    {
        $match: {
            name: "Eliot"
        }
    },
    {
        $graphLookup: {
            from: "parent_reference",
            startWith: "$_id",
            connectFromField: "_id",
            connectToField: "reports_to",
            as: "colleagues"
        }
    }
]).pretty()

//we could change this to get superiors as well
db.parent_reference.aggregate([
    {
        $match: {
            name: "Shannon"
        }
    },
    {
        $graphLookup: {
            from: "parent_reference",
            startWith: "$reports_to",
            connectFromField: "reports_to",
            connectToField: "_id",
            as: "superiors"
        }
    }
]).pretty()

//{
// 	"_id" : 2,
// 	"name" : "Eliot",
// 	"title" : "CTO",
// 	"direct_reports" : [
// 		"Andrew",
// 		"Elyse",
// 		"Ron"
// 	]
// }

//to find all direct reports
//what happens is direct reports is first matched with name in first document(Dev) and the direct
//report are matched to names in all the documents which we get as results. this keeps going on until
// there are no direct reports field in the results
db.child_reference.aggregate([
    {
        $match: {
            name: "Dev"
        }
    },   
    {
        $graphLookup: {
            from: "child_reference",
            startWith: "$direct_reports",
            connectFromField: "direct_reports",
            connectToField: "name",
            as: "all_reportees",
            // restrictSearchWithMatch: 
            }
    }
    
])

//maxDepth
db.child_reference.aggregate([
    {
        $match: {
            name: "Dev"
        }
    },   
    {
        $graphLookup: {
            from: "child_reference",
            startWith: "$direct_reports",
            connectFromField: "direct_reports",
            connectToField: "name",
            as: "all_reportees",
            maxDepth: 1, //0 performs normal lookup, 1 performs 1 level of recursion
            depthField: "depth" //field name added to show the depth
            }
    }
    
]).pretty()

//crossCollection

db.air_routes.find({"airline.name": "TAP Portugal"}).pretty()

db.air_airlines.aggregate([
    {
        $match: {
            name: "TAP Portugal"
        }
    },
    {
        $graphLookup: {
            from: "air_routes",
            startWith: "$base",
            connectFromField: "dst_airport",//searched for different to match to ConnectTofield
            connectToField: "src_airport",//single fields to be matched
            as: "routes",
            maxDepth: 1
        }
    }
]).pretty()

//to get results only from a specific airline
db.air_airlines.aggregate([
    {
        $match: {
            name: "TAP Portugal"
        }
    },
    {
        $graphLookup: {
            from: "air_routes",
            startWith: "$base",
            connectFromField: "dst_airport",//searched for different to match to ConnectTofield
            connectToField: "src_airport",//single fields to be matched //if this field is indexed perfomance will improve
            as: "routes",
            maxDepth: 1,
            depthField: "depth",
            restrictSearchWithMatch: {"airline.name": "TAP Portugal"}
        }
    }
]).pretty()

//
db.air_alliances.aggregate([
    {
        $match: {
            name: "OneWorld"
        }
    },
    {
        $graphLookup: {
            from: "air_airlines",
            startWith: "$airlines", //each element in the name will be used as value for ConnectFromField
            connectFromField: "airlines", 
            connectToField: "name", 
            as: "routes",
            restrictSearchWithMatch: {country: {$in: ["Germany", "Spain", "Canada"]}}
        }
    },
    {
        $project: {
            "routes.base": 1,
            "routes.name": 1
        }
    },
    {
        $graphLookup: {
            from: "air_routes",
            startWith: "$routes.base",
            connectFromField: "dst_airport",
            connectToField: "src_airport",
            as: "destinations",
            maxDepth: 1,
            depthField: "depth",
            // restrictSearchWithMatch: {"airline.name":"$routes.name"}
        }
    },
    {
        $project: {
            valid_airlines: "$routes.name", //other wise values will appear seperately while unwinding
            "destinations.airline.name": 1,
            "destinations.dst_airport": 1
        }
    },
    {
        $unwind: "$destinations"
    },
    {
        $project: {
            is_valid: {
                $in: ["$destinations.airline.name", "$valid_airlines"]}, //this returns a true or false value
                "destinations.dst_airport": 1
            
        }
    },
    {
        $match: {
            is_valid: true
        }
    },
    {
        $group: {
            _id: "$destinations.dst_airport"
        }
    }
    
]).itcount()