const app = require("express")();
const POORT = 2197; //standaard poort voor JSON based APIs

app.listen(POORT, () => console.log("server werkt en luistert op poort " + POORT));
