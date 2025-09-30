const express = require("express");
const fs = require("fs");
const bodyparser = ("body-parsel")
const dateET = require ("./src/timenow")
//me oome objekti, mis ongi ecpress.js programm ja edasi kasutamegi seda.
const app = express();
app.set("view engine", "ejs");
//määrame kasutamiseks avaliku kataloogi
app.use(express.static("public"));
//päringu url parsimine. eraldame post oisa. false aint kui tekst. true kui muu info Ka
app.use(bodyparser.urlencoded({)
app.get("/", (req, res)=>{
	//res.send("express.js läks edukalt käima!");
	res.render("index");
});
app.get("/timenow", (req, res)=>{
	res.render("timenow", {nowDate: deateET.longDate(), nowWd: DateET.weekDay()});
});
app.get("/vanasonad", (req, res)=>{
	let folkWisdom=[];
	fs.readFile("public/txt/vanasonad.txt", "utf8", (err, data) =>{
		if(err){
			res.render("genericlist", {heading:"Valik tuntud Eesti vanasõnu", listData:["Kahjuks vanasõnu ei leidnud!"]});
		} else {
			folkWisdom = data.split(";");
			res.render("genericlist",{heading: "Valik Eesi tuntud vanasõnu", listData: folkWisdom});
});
app.listen(5216);