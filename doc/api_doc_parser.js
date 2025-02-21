const fs = require("fs");

// Read the JSON file
fs.readFile("api_doc.json", "utf8", (err, data) => {
    const jsonData = JSON.parse(data);
    jsonData.api.forEach(obj => {
        for (let key of ["post", "get", "delete", "put"]) {
            if (obj[key]) {
                console.log(key.toUpperCase() + "\t" + obj.link);
                if (obj[key].commentaar) console.log("\t" + obj[key].commentaar);
                if (obj.commentaar) console.log("\tcommentaar: " + obj.commentaar);
                if (obj[key].auth) console.log("\tauth: " + obj[key].auth);
                if (obj.auth) console.log("\tcommentaar: " + obj.auth);
            }
        }
    });
});
