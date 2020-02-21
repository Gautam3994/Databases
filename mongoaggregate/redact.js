//it is used to protect information from unauthorized access though it alone is not enough as it doesnot control collection level access so users can read data
// { $redact: <expression> }
// expression must resolved to DESCEND, PRUNE (remove),KEEP (retain)
db.employees.aggregate([
    {
        $redact: {
            $cond: [{$in: [userAccess, "$acl"]}, "$$DESCEND", "$$PRUNE"]//DESCEND -proceed to next level 
            // important to notice if next level has field to check against else it will error
        }
    }
]).pretty()