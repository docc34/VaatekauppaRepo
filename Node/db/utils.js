var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'tuotanto',      // ÄLÄ käytä root:n tunnusta tuotannossa
    password: 'S@lasana',
    database: 'yrityskanta'
});
//Täällä on 2 funktioita jotka suorittaa sql lauseita. Niile pitää antaa vain query ja parametrit. käytetään lähes kaikkialla backendissä
const executeSingleSql = (query, params) => {
    return new Promise((resolve, reject) => {
        connection.query(query, params, function (error, results, fields) {
            error ? reject(error) : resolve(results);
        });
    })
}

const getSingleSql = (query, params) => {
    return new Promise((resolve, reject) => {
        connection.query(query, params, function (error, results, fields) {
            error ? reject(error) : resolve(results.length > 0 ? results[0] : null);
        });
    })
}

module.exports = {
    executeSingleSql,
    getSingleSql
}