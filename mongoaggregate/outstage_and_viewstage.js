//out stage is used persist data
// it must be the last stage
//cannot be used within facet

// { $out: "<output-collection>" }

//if collection name already exist it will be overwritten
//output must be unique _id(if exists in pipeline) otherwise it will error

//views(non-materialized views - computed everyt time a read operation is performed)
//view slices the collection vertically($project etc, doesnt reduce no of docs) and horizontally($match)

db.getCollectionInfos()//to get information about the collections and views(typw will be view)

//view information about the view using
db.system.views.find().pretty()


//EXAMPLE

    db.createView("bronze_banking", "customers", [
        {
        $match: { "accountType": "bronze" }
        },
        {
        $project: {
            _id: 0,
            name: {
            $concat: [
                { $cond: [{ $eq: ["$gender", "female"] }, "Miss", "Mr."] },
                " ",
                "$name.first",
                " ",
                "$name.last"
            ]
            },
            phone: 1,
            email: 1,
            address: 1,
            account_ending: { $substr: ["$accountNumber", 7, -1] } //substr returns a substring of a string with the specified start and end position
        }
        }
    ])

  //RESTRICTIONS
//   no write  and index operations in views
// cannot rename view but can drop and recreate
//no mapreduce, $text, geoNear, find()with projection operators($, $elemMatch, $slice, $meta)