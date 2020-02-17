//geoNear must be the first stage in a pipeline.
//$near cannot be used here.
//geoNear can be used in chartedcollections and nears cant be used.
//to perform geoNear the collection must have one and only geoIndex.

db.nycFacilities.aggregate(
    [
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [-73.98769766092299, 40.757345233626594]
                },
                distanceField: "distanceFromMongoDB", //field to insert in returned documents
                spherical: true,//specfying whether using 2dsphere index
                query: {
                    type: "Hospital"
                },
                limit: 5
            }
        }
    ]
).pretty()

//2dsphere index is used result(distanceFromMongoDB) will be returned in meters else if using leagcy data it will have radians.