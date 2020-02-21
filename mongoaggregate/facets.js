//facets analyze, manipulate data across multiple dimensions.
//facet navigation enables results for queries to be displayed across various dimensions.
//facet navigation can have filters like flipkart filters

// mongoimport --host cluster0-shard-00-02-cwpsk.mongodb.net:27017 --db startups --type json --file companies.json --authenticationDatabase admin --ssl --username m001-student --password m001-mongodb-basics       
//If json is in array format use below option  
// mongoimport --host cluster0-shard-00-02-cwpsk.mongodb.net:27017 --db startups --type json --file companies.json --jsonArray --authenticationDatabase admin --ssl --username m001-student --password m001-mongodb-basics 

//Creating indexes for text search

db.companies.createIndex({'description': 'text', 'overview': 'text'})


//doing a text search on text indexes created.
//creating facet for a normal field
db.companies.aggregate([
    {
        $match: {
            $text: {
                $search: "network"
            }
        }
    },
    {
        $sortByCount: "$category_code"  //this work like grouping and counting and then sorting by descending
    }
])


// { "_id" : "hardware", "count" : 89 }                                                                                    
// { "_id" : "consulting", "count" : 88 }                                                                                  
// { "_id" : "public_relations", "count" : 86 }                                                                            
// { "_id" : "security", "count" : 55 }                                                                                    
// { "_id" : "semiconductor", "count" : 41 }                                                                               
// { "_id" : "search", "count" : 34 }                                                                                      
// { "_id" : "social", "count" : 30 }                                                                                      
// { "_id" : "cleantech", "count" : 17 }                                                                                   
// { "_id" : "news", "count" : 14 }                                                                                        
// { "_id" : "biotech", "count" : 13 } 

//creating facet for a array
db.companies.aggregate([
    {
        $match: {
            $text: {
                $search: "network"
            }
        }
    },
    {
        $unwind: "$offices"
    },
    {
        $match: {
            "offices.city": {$ne: ""}
        }
    },
    {
        $sortByCount: "$offices.city"
    },
])

//creating multiple filter(for individual example see bucket)
db.companies.aggregate([
    {
        $match: {
            $text: {$search: 'Databases'}
        }
    },
    {
        $facet: {
            Categories: [{$sortByCount: "$category_code"}], //name Categories is our choice. //outplut of one these individual bucket/facet doesnt affect the other
            Employees: [
                {
                    $match: {
                        founded_year: {$gt: 1980}
                    }
                },
                {
                    $bucket: {
                        groupBy: "$number_of_employees",
                        boundaries: [0, 20, 100, 200, 500, 1000, 5000, Infinity],
                        default: "not found"
                    }
                }
                    ],
            Founded: [
                {
                    $match: {
                        'offices.city': "New York"
                    }
                },
                {
                    $bucketAuto: {
                        groupBy: '$founded_year',
                        buckets: 5
                    }
                }
            ]
        }
    }
])

//WORKOUT

db.movies.aggregate([
    {
        $match: {
            "imdb.rating": {$gt: 0},
            metacritic: {$gt: 0}
        }
    },
    {
        $project: {
            _id: 0,
            title: 1,
            metacritic: 1,
            "imdb.rating": 1
        }
    },
    {
        $facet: {
            IMDB: [
                {
                    $sort: {"imdb.rating": -1}
                },
                {
                    $limit: 10
                }
            ],
            METACRITIC: [
                {
                    $sort: {metacritic: -1}
                },
                {
                    $limit: 10
                }
            ]
        }
    },
    {
        $project: {
            in_both: {
                $setIntersection: [ "$IMDB", "$METACRITIC" ] 
            }
        }
    }
    
])

