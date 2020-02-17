//addField is similar to project
//diff is we add fields instead of remove and retain project

db.solarSystem.aggregate([
    {
        $addFields: {
            _id: 0,
            name: 1,
            gravity_: "$gravity.value", //if we give same field name as in original.. the original field wont be displayed
            meanTemperature: 1,
            mass: "$mass.value",
            meanDensity: 1,
            sma: "$sma.value"
        }
    }
]).pretty()
// "gravity" : {
	// 	"value" : 3.71,
	// 	"units" : "m/s^2"
    // },

    // if we give same name
// "gravity" : 3.71, 

//if we give diff name both old and new will appear.
// "gravity" : {
	// 	"value" : 3.71,
	// 	"units" : "m/s^2"
    // },
// "gravity_" : 3.71

// BEST PRACTICE
//First select the fields to retain using project and then perform transformation using addFields
//by this you can set different name to the same field values which can help you in performing different operations
db.solarSystem.aggregate([
    {
        $project: {
            _id: 0,
            name: 1,
            meanTemperature: 1,
            meanDensity: 1,
            mass: 1,
            gravity: 1,
            sma: 1
        }
    },
    {
        $addFields: {
            _gravity: "$gravity.value",
            sma: "$sma.value",
            mass: "$mass.value"
        }
    }
]).pretty()