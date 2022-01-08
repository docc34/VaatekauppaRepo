var sql = require('./utils');

const postEducationData = (v) => {
    let query ="insert into education (profile_userId,schoolName, degree, startDate, endDate) values(?,?,?,?,?);";
        return sql.executeSingleSql(query,v);
}
const postJobsData = (v) => {
    let query ="insert into jobs (profile_userId,workplace, profession, startDate, endDate) values(?,?,?,?,?);";
        return sql.executeSingleSql(query,v);
}
const deleteJobsRow = (v) => {
    let query ="delete from jobs where profile_userId = ? and jobsId = ?";
        return sql.executeSingleSql(query,v);
}
const deleteEducationRow = (v) => {
    let query ="delete from education where profile_userId = ? and educationId = ?";
        return sql.executeSingleSql(query,v);
}
const postImgPath = (v) => {
    let query ="UPDATE profile SET image=? WHERE userId = ?";
        return sql.executeSingleSql(query,v);
}
const getProfileData = (v) => {   
    let query = "select p.userId, p.userInfo,p.phonenumber,p.image, u.email,u.name from profile p inner join userdata u "
        query += "where u.userid = p.userId and p.deleted = 0 and p.userId = ?"
        return sql.executeSingleSql(query,v);
}
const getProfileJobsData = (v) => {
    let query ="select profile_userid, jobsId, workplace, profession, DATE_FORMAT(startDate, '%d.%m.%Y') as startDate,  DATE_FORMAT(endDate, '%d.%m.%Y') as endDate from jobs where profile_userId = ?";
        return sql.executeSingleSql(query,v);
}
const getProfileEducationData = (v) => {
    let query ="select profile_userid, educationId, schoolName, degree, DATE_FORMAT(startDate, '%d.%m.%Y') as startDate,  DATE_FORMAT(endDate, '%d.%m.%Y') as endDate from education where profile_userId = ? order by startDate;";
        return sql.executeSingleSql(query,v);
}
const PostProfileData = (v) => {
    let query ="insert into profile (userInfo, phonenumber, userId,deleted) values(?,?,?,0)";
        return sql.executeSingleSql(query,v);
}
const SetProfileData = (v) => {
    let query ="UPDATE profile p inner join userdata u on p.userId = u.userId SET p.userInfo = ?, p.phonenumber=? ,u.email =? WHERE p.userId = ?;";
        return sql.executeSingleSql(query,v);
}

module.exports = {
   postEducation: (v) => {
        return postEducationData(v); 
    },
    postJobs: (v) => {
        return postJobsData(v); 
    },
    deleteJobs: (v) => {
        return deleteJobsRow(v); 
    },
    deleteEducation: (v) => {
        return deleteEducationRow(v); 
    },
    postImgPath : (v) => {
        return postImgPath(v); 
    },
    getProfileData : (v) => {
        return getProfileData(v); 
    },
    getProfileJobs : (v) => {
        return getProfileJobsData(v); 
    },
    getProfileEducation : (v) => {
        return getProfileEducationData(v); 
    },
    PostProfileData : (v) => {
        return PostProfileData(v); 
    },
    SetProfileData : (v) => {
        return SetProfileData(v); 
    }
}