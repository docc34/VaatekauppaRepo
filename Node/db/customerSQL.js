var sql = require('./utils');

const getTunnusData = (v) => {
    let query ="select * from userdata"
        return sql.executeSingleSql(query,v);
}
const postTunnusData = (v) => {
    let query ="insert into userdata (username, password, name, email, userIsSeller, userIsAdmin) values(?,?,?,?,false,false) "
        return sql.executeSingleSql(query,v);
}

module.exports = {
    getTunnukset: (v) => {
        return getTunnusData(v); 
    }, 
    postTunnus: (v) => {
        return postTunnusData(v); 
    }
}