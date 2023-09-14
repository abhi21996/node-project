const mysql = require('mysql');

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'crud-project'
})

db.connect(err =>{
    if (err) {
        throw err 
    }
    console.log('connected to mysql')
})

module.exports.db = db