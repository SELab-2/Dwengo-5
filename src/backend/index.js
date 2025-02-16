const app = require("express")();
const POORT = 443; //of 80?

app.listen(POORT, () => console.log("server werkt en luistert op poort " + POORT));
