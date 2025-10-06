const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
const dateTimeET = require("./src/dateTimeET");
//me loome objekti, mis ongi express.js programm ja edasi kasutamegi seda.
const app = express();
//määrame renderdajaks ejs
app.set("view engine", "ejs");
//määrame kasutamiseks avaliku kataloogi
app.use(express.static("public"));
//päringu url parsimine. eraldame POST osa. false aint kui tekst. true kui muu info Ka
app.use(bodyparser.urlencoded({extended: false}));
app.get("/", (req, res)=>{
	//res.send("express.js läks edukalt käima!");
	res.render("index");
});
app.get("/timenow", (req, res)=>{
	res.render("timenow", {nowDate: dateTimeET.longDate(), nowWd: dateTimeET.weekDay()});
});
app.get("/vanasonad", (req, res)=>{
	fs.readFile("public/txt/vanasonad.txt", "utf8", (err, data) =>{
		if(err){
			res.render("genericlist", {heading:"Valik tuntud Eesti vanasõnu", listData:["Kahjuks vanasõnu ei leidnud!"]});
		} else {
			let folkWisdom = data.split(";");
			res.render("genericlist",{heading: "Valik Eesi tuntud vanasõnu", listData: folkWisdom});
		}
	});
});
app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});
app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
				fs.appendFile("public/txt/visitlog.txt", req.body.nameInputees + " " + req.body.nameInputpere + ";", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("regvisit");
				}
			});
		}
	});
});
app.listen(5216);
