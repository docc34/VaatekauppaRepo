var sql = require('./utils');


const getStoreFunction = (v) => {
    let query = "select j.idJobPost,j.priceStartingAt, j.priceEndingAt,j.hourEstimate,j.description,j.label,r.stars, u.name, u.userId,p.image ";
    query += "from jobpost j inner join userData u on j.userId = u.userId inner join profile p on j.userId = p.userId inner join ratings r on p.userId = r.profile_userId where j.deleted = 0 and p.deleted= 0";
    console.log(v);
    var params = [];

    if(v != null){
        var j = 0;
        v.forEach(e => {

            if(e?.jobPostId != 0 && e?.jobPostId != null && e?.jobPostId != undefined){
                query += " and j.idJobPost = ?";
                params[j] = e?.jobPostId
                ++j;
            }
            if (e?.jobPostTitle != "" && e?.jobPostTitle != null && e?.jobPostTitle != undefined) {
                query += " and j.label LIKE ?";
                params[j] = e?.jobPostTitle
                ++j;
            }

            //Pitää olla viimesenä
            if(e?.priceSort == "asc" && e?.priceSort != null && e?.priceSort != undefined){
            query += " order by j.priceStartingAt "+e.priceSort;
            }
        });
    }
    query += " limit 30";
    return sql.executeSingleSql(query, params);
}

const getProfilePostsFunction = (v) => {
    let query = "select j.idJobPost,j.label,j.priceStartingAt, j.priceEndingAt,j.hourEstimate,j.description, u.name, u.userId,p.image,r.stars ";
    query += "from jobpost j inner join userData u on j.userId = u.userId inner join profile p on j.userId = p.userId inner join ratings r on p.userId = r.profile_userId where j.deleted = 0 and p.deleted= 0 and j.userId = ? limit 30";
    return sql.executeSingleSql(query, v);
}




module.exports = {
    getStorePosts: (v) => {
        return getStoreFunction(v);
    },
    getProfilePosts: (v) => {
        return getProfilePostsFunction(v);
    }
}