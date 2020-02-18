//$sample collect a set of random sample from a collections
//METHOD - 1 
//{$sample - {size: < N, no of documents needed in sample}}
//When N greater than 5% of number of documents in the source collection and
// source collections has >= 100 documents and
//sample is the first stage.
//Then as psuedo random cursor will select the number of documents.

//METHOD-2
//If any of the condition in method - 1 fails an in memory random sort and select is performed.
//since sort is used here it will have the same memory restriction as in aggregation sort.

// Syntax is same for both
db.nycFacilities.aggregate(
    [
        {
            $sample: {
                size: 200
            }
        }
    ]
)