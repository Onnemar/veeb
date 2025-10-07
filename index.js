const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
const mysql = require("mysql2");
const dateTimeET = require("./src/dateTimeET");
//lisan andmebaasi juurdepääsu info
const dbInfo = require("../../vp2025config");
//me loome objekti, mis ongi express.js programm ja edasi kasutamegi seda.
const app = express();
//määrame renderdajaks ejs
app.set("view engine", "ejs");
//määrame kasutamiseks avaliku kataloogi
app.use(express.static("public"));
//päringu url parsimine. eraldame POST osa. false aint kui tekst. true kui muu info Ka
app.use(bodyparser.urlencoded({extended: false}));

//loon andmebaasiühenduse
const conn = mysql.createConnection({
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
});

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
				fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + ", "
				+ dateTimeET.longDate() + " kell " + dateTimeET.time() + ";", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
				res.render("visitregistered", {visitor: req.body.firstNameInput + " " + req.body.lastNameInput});
				}
			});
		}
	});
});

app.get("/visitregistered", (req, res)=>{
res.render("visitregistered");
});


app.get("/visitlog", (req, res)=>{
	let listData = [];
	fs.readFile("public/txt/visitlog.txt", "utf8", (err, data)=>{
		if(err){
			//kui tuleb viga, siis ikka vأ¤ljastame veebilehe, liuhtsalt vanasأµnu pole أ¼htegi
			res.render("genericlist", {heading: "Registreeritud kأ¼lastused", listData: ["Ei leidnud ühtegi külastust!"]});
		}
		else {
			let tempListData = data.split(";");
			for(let i = 0; i < tempListData.length - 1; i ++){
				listData.push(tempListData[i]);
			}
			res.render("genericlist", {heading: "Registreeritud kأülastused", listData: listData});
		}
	});
});
app.get("/eestifilm", (req, res)=>{
	res.render("eestifilm");
});

app.get("/eestifilm/inimesed", (req, res)=>{
	const sqlReq = "SELECT * FROM person";
	conn.execute(sqlReq, (err, sqlRes)=>{
		if(err){
			console.log(err);
			res.render("filmiinimesed",{personList:[]});
		} 
		else {
			console.log(sqlRes);
			res.render("filmiinimesed",{personList:sqlRes});
		}
	});
});

app.get("/eestifilm/inimesed_add", (req, res)=>{
	res.render("filmiinimesed_add",{notice:"Ootan sisestust!"});
	//res.render("filmiinimesed");
});
app.post("/eestifilm/inimesed_add", (req, res)=>{
	console.log(req.body);
if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput > new Date()){
		res.render("filmiinimesed_add", {notice: "Andmed on vigased! Vaata üle!"});
	}
	else {
		let deceasedDate = null;
		if(req.body.deceasedInput != ""){
			deceasedDate = req.body.deceasedInput;
		}
		let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
		conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate], (err, sqlRes)=>{
			if(err){
				res.render("filmiinimesed_add", {notice: "Tekkis tehniline viga:" + err});
			}
			else {
				res.render("filmiinimesed_add", {notice: "Andmed on salvestatud!"});
			}
		});
	}
	//res.render("filmiinimesed_add", {notice: "Andmed olemas! " + req.body});
});
app.get("/eestifilm/ametid", (req, res)=>{
	const sqlReq = "SELECT * FROM position";
	conn.execute(sqlReq, (err, sqlRes)=>{
		if(err){
			console.log(err);
			res.render("ametid",{personList:[]});
		} 
		else {
			console.log(sqlRes);
			res.render("filmiinimesed",{personList:sqlRes});
		}
	});
});
app.listen(5216);
