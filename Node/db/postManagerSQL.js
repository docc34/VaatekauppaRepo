var sql = require('./utils');

const deleteStorePost = (v) => {
    let query = "update jobpost set deleted = 1 where idjobPost = ? and userId = ? ";
    return sql.executeSingleSql(query, v);
}

const modifyStorePost = (v) => {
    let query = "update jobpost set label = ?, priceStartingAt = ?,priceEndingAt = ?, hourEstimate = ?, description = ? where idjobPost = ? and userId = ? ";
    return sql.executeSingleSql(query, v);
}
const getJobPostSql = (v) => {
    let query = "select j.idJobPost,j.label,j.priceStartingAt, j.priceEndingAt,j.hourEstimate,j.description, u.name, u.userId,p.image,r.stars ";
    query += "from jobpost j inner join userData u on j.userId = u.userId inner join profile p on j.userId = p.userId inner join ratings r on p.userId = r.profile_userId where j.deleted = 0 and p.deleted= 0 and j.idJobPost = ? limit 30;";
    return sql.executeSingleSql(query, v);
}
const postStorePostFunction = (v) => {
    let query = "insert into jobpost (label, priceStartingAt, priceEndingAt, hourEstimate,description, userId,deleted) values(?,?,?,?,?,?,0);";
    return sql.executeSingleSql(query, v);
}
// const deleteStorePost = (v) => {
//     let query = "delete from jobpost where idjobPost = ? and userId = ?";
//     return sql.executeSingleSql(query, v);
// }

module.exports = {
    deleteStorePost: (v) => {
        return deleteStorePost(v);
    },
    modifyStorePost: (v) => {
        return modifyStorePost(v);
    },
    getJobPostSql: (v) => {
        return getJobPostSql(v);
    },
    postStorePosts: (v) => {
        return postStorePostFunction(v);
    }
}