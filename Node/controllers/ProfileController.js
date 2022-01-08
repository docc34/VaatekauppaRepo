const e = require('express');
const sql = require('../db/ProfileSQL');
const u = require('../utils');




module.exports = {

    getProfileData: async (req, res) => {
        try {
            let userId = req.params.userId;
            if (userId != null) {
                let hae = await sql.getProfileData(userId);
                let tiedot = await hae[0];

                hae = await sql.getProfileJobs(userId);
                let tyot = await hae;

                hae = await sql.getProfileEducation(userId);
                let opinnot = await hae;

                res.json({ tiedot, tyot, opinnot });
            }
            else {

                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "virhe!" });
            }
        }
        catch (err) {

            console.log("Virhe", err);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "virhe!" });

        }
    },
    setProfileData: async (req, res) => {
        try {
            let userId = req.body.userId;
            let phonenumber = req.body.phonenumber;
            let email = req.body.email;
            let userInfo = req.body.userInfo;

            let hae = "";
            let tiedot = "";
            if (userId != null) {
                hae = await sql.SetProfileData([userInfo,  phonenumber,email, userId]);
                tiedot = await hae;
            }

            res.json({ tiedot });

        }
        catch (error) {

            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "virhe!" });

        }
    },
    postEducation: async (req, res) => {
        try {
            let userId = req.body.userId;

            let schoolName = req.body.schoolName;
            let degree = req.body.degree;
            let startDate = req.body.startDate;
            let endDate = req.body.endDate;

            let tarkistusStatus = u.checkEmptyFields(["Koulun nimi", "Koulutus", "Koulun alku päivämäärä", "Koulun loppu päivämäärä"], [schoolName, degree, startDate, endDate]);

            if (tarkistusStatus.status == false) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: tarkistusStatus.kentat });
            }
            else {
                let hae = "";
                let tiedotEducation = "";
                if (userId != null) {
                    hae = await sql.postEducation([userId, schoolName, degree, startDate, endDate]);
                    tiedotEducation = await hae;
                }
                res.json({ tiedotEducation });
            }
        }
        catch (error) {

            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "virhe!" });

        }
    },
    postJobs: async (req, res) => {
        try {
            let userId = req.body.userId;
            let workplace = req.body.workplace;
            let profession = req.body.profession;
            let startDate = req.body.startDate;
            let endDate = req.body.endDate;

            let tarkistusStatus = u.checkEmptyFields(["Työpaikan nimi", "Ammatti", "Työn alku päivämäärä", "Työn loppu päivämäärä"], [workplace, profession, startDate, endDate]);

            if (tarkistusStatus.status == false) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: tarkistusStatus.kentat });
            }
            else {
                let hae = "";
                let tiedotJobs = "";
                if (userId != null) {
                    hae = await sql.postJobs([userId, workplace, profession, startDate, endDate]);
                    tiedotJobs = await hae;
                }
                res.json({ tiedotJobs });
            }
        }
        catch (error) {

            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "virhe!" });

        }
    },
    deleteJobs: async (req, res) => {
        try {
            let userId = req.body.e.userId;
            let jobsId = req.body.e.jobsId;
            console.log(userId);
            console.log(jobsId);

            if (userId == null || jobsId == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "Jotain meni väärin" });
            }
            else {
                hae = await sql.deleteJobs([userId, jobsId]);
                tiedotJobs = await hae;
                res.json({ tiedotJobs });
            }
        }
        catch (error) {

            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "virhe!" });

        }
    },
    deleteEducation: async (req, res) => {
        try {
            let userId = req.body.e.userId;
            let educationId = req.body.e.educationId;

            if (userId == null || educationId == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "Jotain meni väärin" });
            }
            else {
                hae = await sql.deleteEducation([userId, educationId]);
                tiedotJobs = await hae;
                res.json({ tiedotJobs });
            }
        }
        catch (error) {

            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "virhe!" });

        }
    }
    /*,
    postProfiiliTiedot: async (req, res)=>{
        
        try {
            
            let email = req.body.email;
            let phonenumber = req.body.phonenumber;
            let name = req.body.name;
            
            let tarkistusKentat = ["Käyttäjänimi","Nimi" , "Salasana"];
            let tarkistettavatTiedot = [username, password, name];
            let tarkistusStatus = { status: true, kentat: "" };
            let l = 0;
            tarkistettavatTiedot.map((e, i) => {
                
                if (e == null || e == "" && l == 0) {
                    l++;
                    tarkistusStatus = { status: false, kentat: "Seuraavat kentät puuttuvat: "+ tarkistusKentat[i] }
                }
                else if(e == null || e == "" && l >= 1){
                    l++;
                    tarkistusStatus = { status: false, kentat: tarkistusStatus.kentat + "," + tarkistusKentat[i] }
                }

            });
            
             username = username.replace(/ /g, '');
            if(username.length <= 2 && tarkistusStatus.status != false){
                tarkistusStatus = { status: false, kentat:"Käyttäjänimen pitää olla vähintään 3 merkkiä pitkä" }
            }
            name = name.replace(/ /g, '');
            if(username.length <= 2 && tarkistusStatus.status != false){
                tarkistusStatus = { status: false, kentat:"Nimen pitää olla vähintään 3 merkkiä pitkä" }
            }
            if(password.length < 8 && tarkistusStatus.status != false){
                tarkistusStatus = { status: false, kentat:"Salasanan pitää olla vähintään 8 merkkiä pitkä" }
            }

            let tarkista = await sqlR.executeSingleSql("select username from userdata");
            tarkista.map((e,i)=>{
                if(username == e.username ){
                    
                    tarkistusStatus = { status: false, kentat: "Käyttäjänimi on jo olemassa"  }
                }
                
            });
            
            if (tarkistusStatus.status == false) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: tarkistusStatus.kentat });
            }
            else {

                let postUserData = await sql.PostTunnus(tarkistettavatTiedot);
                res.statusCode = 200;
                res.json({postUserData});

            }
        }
        catch (err) {

            console.log("Virhe", err);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "virhe!" });

        }
    }
    /*postTilaus: async (req, res)=>{
        
        try {
            
            let username = req.body.username;
            let password = req.body.password;
            let name = req.body.name;
            
            let tarkistusKentat = ["Käyttäjänimi","Nimi" , "Salasana"];
            let tarkistettavatTiedot = [username, password, name];
            let tarkistusStatus = { status: true, kentat: "" };
            let l = 0;
            tarkistettavatTiedot.map((e, i) => {
                
                if (e == null || e == "" && l == 0) {
                    l++;
                    tarkistusStatus = { status: false, kentat: "Seuraavat kentät puuttuvat: "+ tarkistusKentat[i] }
                }
                else if(e == null || e == "" && l >= 1){
                    l++;
                    tarkistusStatus = { status: false, kentat: tarkistusStatus.kentat + "," + tarkistusKentat[i] }
                }

            });
            
             username = username.replace(/ /g, '');
            if(username.length <= 2 && tarkistusStatus.status != false){
                tarkistusStatus = { status: false, kentat:"Käyttäjänimen pitää olla vähintään 3 merkkiä pitkä" }
            }
            name = name.replace(/ /g, '');
            if(username.length <= 2 && tarkistusStatus.status != false){
                tarkistusStatus = { status: false, kentat:"Nimen pitää olla vähintään 3 merkkiä pitkä" }
            }
            if(password.length <= 8 && tarkistusStatus.status != false){
                tarkistusStatus = { status: false, kentat:"Salasanan pitää olla vähintään 8 merkkiä pitkä" }
            }

            let tarkista = await sql.getSingleSql("select username from userdata");
            tarkista.map((e,i)=>{
                if(username == e.username ){
                    
                    tarkistusStatus = { status: false, kentat: "Käyttäjänimi on jo olemassa"  }
                }
                
            });
            
            if (tarkistusStatus.status == false) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: tarkistusStatus.kentat });
            }
            else {

                let postUserData = await sql.PostTunnus(tarkistettavatTiedot);
                res.statusCode = 200;
                res.json({postUserData});

            }
        }
        catch (err) {

            console.log("Virhe", err);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "virhe!" });

        }
    }*/
}