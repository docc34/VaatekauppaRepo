const e = require('express');
const sql = require('../db/storeSQL');
const u = require('../utils');

module.exports = {

    getAllStorePosts: async (req, res) => {
        try {
            
            let jobPostTitle = req.body.jobPostTitle;
            let priceSort = req.body.priceSort;
            let jobPostId = req.body.jobPostId;

            let hae = await sql.getStorePosts([{jobPostTitle:jobPostTitle, priceSort:priceSort, jobPostId:jobPostId}]);
            let posts = await hae;
            
            res.statusCode = 200;
            res.json( {posts} );
        }
        catch (err) {

            console.log("Virhe", err);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "virhe!" });

        }
    },
    getProfilePosts: async (req, res) => {
        try {     
            
            let userIdSearch = req.params.userId;
            
            let hae = await sql.getProfilePosts([userIdSearch]);
            let posts = await hae;
            
            res.statusCode = 200;
            res.json( {posts} );
        }
        catch (err) {

            console.log("Virhe", err);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "virhe!" });

        }
    }
    /*,
    setStorePosts:async (req, res)=>{
        try{
            let userId = req.body.userId;
            let email = req.body.email;
            let phonenumber = req.body.phonenumber;
            let userInfo = req.body.userInfo;

            let schoolName = req.body.schoolName;
            let education = req.body.education;
            let schoolStartDate = req.body.schoolStartDate;
            let schoolEndDate = req.body.schoolEndDate;
  

            let tarkistusKentat = ["Koulun nimi" ,"Koulutus",  "Koulun alku päivämäärä", "Koulun loppu päivämäärä"];
            let tarkistettavatTiedot = [ schoolName, education,schoolStartDate, schoolEndDate];
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

            if (tarkistusStatus.status == false && l != 4) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: tarkistusStatus.kentat });
            }
            else {
                let hae = "";
                let tiedot = "";
                let tiedotEducation = "";
                if(userId != null){
                     hae = await sql.SetProfileData([userInfo ,email, phonenumber, userId]);
                     tiedot = await hae;
                }
                if(l != 4 ){
                    hae = await sql.PostProfileEducation([userId, schoolName ,education, schoolStartDate, schoolEndDate]);
                    tiedotEducation = await hae;
                }


                res.json({tiedot, tiedotEducation});
            }
        }
        catch (error) {

            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "virhe!" });

        }
    }*/
}