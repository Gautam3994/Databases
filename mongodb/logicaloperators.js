// $or format{$nor: [{anyexp}, {anyexp},..., {anyexp}]} same for and & nor
db.movieDetails.find({$or: [{"tomato.meter": {$gt: 95}}, {"metacritic": {$gt: 85}}]}, {_id:0, title:1, "tomato.meter":1, metacritic: 1}).pretty() 
// !!! $and - it not required unless you are specifying two different conditions for the same field
db.movieDetails.find({$and: [{"tomato.meter": {$gt: 95}}, {"metacritic": {$gt: 85}}]}, {_id:0, title:1, "tomato.meter":1, metacritic: 1}).count()
//above is equivalent to below
db.movieDetails.find({"tomato.meter": {$gt: 95}}, {metacritic: {$gt: 85}}).count()
//where to use $and
// if you want to use two filters for the same field you must use $and
db.movieDetails.find({$and: [{"metacritic": {$ne: null}}, {"metacritic": {$exists: true}}]},  {_id:0, title:1, metacritic: 1}).pretty()
db.movieDetails.find({$and: [{"metacritic": null}, {metacritic: {$exists: true}}]}, {_id:0, title:1, metacritic: 1}).pretty()

//there is also not and nor format{$nor: [{anyexp}, {}, {}]}
db.movieDetails.find({$nor: [{"tomato.meter": {$gt: 95}}, {"metacritic": {$gt: 85}}]}, {_id:0, title:1, "tomato.meter":1, metacritic: 1}).pretty() 
db.inventory.find( { $nor: [ { price: 1.99 }, { sale: true } ]  } )

// //above contains
// contain the price field whose value is not equal to 1.99 and contain the sale field whose value is not equal to true or
// contain the price field whose value is not equal to 1.99 but do not contain the sale field or
// do not contain the price field but contain the sale field whose value is not equal to true or
// do not contain the price field and do not contain the sale field

//TO GET DESIRED RESULT USE $exists
// db.inventory.find( { $nor: [ { price: 1.99 }, { price: { $exists: false } },
//     { sale: true }, { sale: { $exists: false } } ] } )

//$not

db.movieDetails.find({rated: {$not: {$eq: "PG-13"}}})

db.trips.find({tripduration: null})
db.trips.find({$and: [{tripduration: null}, {tripduration: {$exists: true}}]})
db.movies.find({year: 1964}, {title: 1, _id: 0})
db.movies.find({$and: [{$or: [{cast: "Jack Nicholson"}, {cast: "John Huston"}]}, {viewerRating: {$gt: 7}}, {mpaaRating: "R"}]})