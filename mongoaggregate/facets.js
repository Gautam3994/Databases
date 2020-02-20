//facets analyze, manipulate data across multiple dimensions.
//facet navigation enables results for queries to be displayed across various dimensions.
//facet navigation can have filters like flipkart filters



mongoimport --db startups --collection companies <companies.json
mongoimport --uri mongodb+srv://m001-student:<password>@cluster0-cwpsk.mongodb.net/test?retryWrites=true&w=majority  -ssl -u myAtlasAdminUser m001-student -p m001-mongodb-basics --authenticationDatabase admin  --db startups --collection myData --drop companies --file companies.json
mongoimport --host myAtlasRS/atlas-host1:27017,atlas-host2:27017,atlas-host3:27017 --ssl -u myAtlasAdminUser -p 'myAtlasPassword' --authenticationDatabase admin  --db testdb --collection myData --drop --file /somedir/myFileToImport.json