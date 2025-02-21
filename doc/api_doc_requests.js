const fs = require("fs");

// Read the JSON file
fs.readFile("api_doc.json", "utf8", (err, data) => {
    const jsonData = JSON.parse(data);
    jsonData.api.forEach(obj => {
        for (let key of ["post", "get", "delete", "put"]) {
            if (obj[key]) {
                console.log(key.toUpperCase() + "\t" + obj.link);
            }
        }
    });
});
