const e = require('express');
const sql = require('../db/customerSQL');
const sqlProfile = require('../db/ProfileSQL');
const sqlR = require('../db/utils.js');
const u = require('../utils');
module.exports = {

    postKayttaja: async (req, res)=>{
        
        try {
            
            let username = req.body.username;
            let password = req.body.password;
            let passwordAgain = req.body.passwordAgain
            let name = req.body.name;
            let email = req.body.email;
            let phonenumber = req.body.phonenumber;
            let tarkistettavatTiedot = [username, password,passwordAgain, name, email,phonenumber];
            let tarkistusStatus = u.checkEmptyFields(["Käyttäjänimi","Nimi" , "Salasana","Salasana uudestaan","Email","Puhelinnumero" ],tarkistettavatTiedot);
            
            let nameCheck = name;
            let usernameCheck = username;

            usernameCheck = usernameCheck.replace(/ /g, '');
            if(usernameCheck.length <= 2 && tarkistusStatus.status != false){
                tarkistusStatus = { status: false, kentat:"Käyttäjänimen pitää olla vähintään 3 merkkiä pitkä" }
            }
            nameCheck = nameCheck.replace(/ /g, '');
            if(nameCheck.length <= 2 && tarkistusStatus.status != false){
                tarkistusStatus = { status: false, kentat:"Nimen pitää olla vähintään 3 merkkiä pitkä" }
            }
            if(password.length < 8 && tarkistusStatus.status != false){
                tarkistusStatus = { status: false, kentat:"Salasanan pitää olla vähintään 8 merkkiä pitkä" }
            }
            if(password != passwordAgain && tarkistusStatus.status != false){
                tarkistusStatus = { status: false, kentat:"Salasanat eivät täsmää" }
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

                let postUserData = await sql.postTunnus([username,password,name,email]);
                tarkista = await sqlR.executeSingleSql("select userId from userdata");
                
                let postProfileData = await sqlProfile.PostProfileData(["",phonenumber, tarkista[tarkista.length-1].userId]);
                res.statusCode = 200;
                res.json({postUserData, postProfileData});

            }
        }
        catch (err) {

            console.log("Virhe", err);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "virhe!" });

        }
    }

}