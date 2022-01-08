const e = require('express');
const sql = require('../db/postManagerSQL');
const u = require('../utils');

module.exports = {

    getJobPost: async (req, res) => {
        try {     
            
            let jobPostId = req.params.jobPostId;
            console.log(jobPostId);
            let hae = await sql.getJobPostSql([jobPostId]);
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
    deleteStorePost: async (req, res) => {
        try {
            let userId = req.body.e.userId;
            let idjobPost = req.body.e.selectedPost;
            if (userId != undefined && userId != null && idjobPost != null && idjobPost != undefined) {

                let hae = await sql.deleteStorePost([idjobPost.idjobPost, userId]);
                posts = await hae;


                res.statusCode = 200;
                res.json({ posts });
            }
            else {
                console.log("Virhe kentät tyhjii");
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "virhe!" });
            }
        }
        catch (e) {

            console.log("Virhe", e);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "virhe!" });

        }
    },
    modifyStorePost: async (req, res) => {
        try {
            let idJobPost = req.body.idJobPost;
            let userId = req.body.userId;
            let label = req.body.label;
            let priceStartingAt = req.body.priceStartingAt;
            let priceEndingAt = req.body.priceEndingAt;
            let hourEstimate = req.body.hourEstimate;
            let description = req.body.description;
            

            let fields = [label, priceStartingAt, priceEndingAt,hourEstimate, description, idJobPost, userId];
            let tarkistusStatus = u.checkEmptyFields(["Otsikko", "Hinta","", "Tunti arvio", "Kuvaus","",""],fields);


            if(tarkistusStatus.status == false){
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: tarkistusStatus.kentat });
            }
            else{
            let hae = await sql.modifyStorePost(fields);
            let posts = await hae;
            
            res.statusCode = 200;
            res.json( {posts} );
            }
           
        }
        catch (e) {

            console.log("Virhe", e);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "virhe!" });

        }
    },
    postStorePosts: async (req, res) => {
        try {     
            let userId = req.body.userId;
            let label = req.body.label;
            let priceStartingAt = req.body.priceStartingAt;
            let priceEndingAt = req.body.priceEndingAt;
            let hourEstimate = req.body.hourEstimate;
            let description = req.body.description;

            let fields = [label, priceStartingAt,priceEndingAt,hourEstimate, description, userId];
            let tarkistusStatus = u.checkEmptyFields(["Otsikko", "Hinta","", "Tunti arvio", "Kuvaus",""],fields);
            


            if(tarkistusStatus.status == false){
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: tarkistusStatus.kentat });
            }
            else{
            let hae = await sql.postStorePosts(fields);
            let posts = await hae;
            
            res.statusCode = 200;
            res.json( {posts} );
        }
        }
        catch (err) {

            console.log("Virhe", err);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "virhe!" });

        }
    }
}