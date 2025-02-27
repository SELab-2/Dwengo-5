var crypto = require("crypto");

const hashPassword = (password) => {
    return crypto.createHash("sha256").update(password).digest("hex");
};

console.log(hashPassword("aaaa"));
console.log(hashPassword("aaaaa"));
