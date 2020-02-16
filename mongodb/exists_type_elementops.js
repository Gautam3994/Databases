db.movies.find({mpaaRating: {$exists: true}}).count() //false fot not exist
db.movies.find({"tomato.consensus": null}) //this will display both fields with null for tomato.consensus and also fields that do not consensus field altogether.
db.movies.find({"tomato.consensus": null, tomato: {$exists: true}}) // to overcome above use this.

//type
db.movies.find({viewerRating: {$type: "int"}}) //there are many other types
db.data.find({atmosphericPressureChange: {$exists: false}}).count()

