
// const mysql = require('mysql');

// class DatabaseMysql {
//     constructor() {
//         if (!DatabaseMysql.instance) {
//         this.connection = mysql.createConnection({
//             host: process.env.DB_HOST,
//             user: process.env.DB_USER,
//             password: process.env.DB_PASSWORD,
//             database: process.env.DB_NAME
//         });
//         this.connection.connect((err) => {
//             if (err) {
//             console.error('Error connecting to database: ' + err.stack);
//             return;
//             }
//             console.log('Connected to database as id ' + this.connection.threadId);
//         });
//         DatabaseMysql.instance = this;
//         }
//         return DatabaseMysql.instance;
//     }

//     static getInstance() {
//         return new DatabaseMysql();
//     }

//     handleDisconnect() {
//         console.log('handleDisconnect()');
//         connection.destroy();
//         connection = mysql.createConnection({
//             host: process.env.DB_HOST,
//             user: process.env.DB_USER,
//             password: process.env.DB_PASSWORD,
//             database: process.env.DB_NAME
//         });
//         connection.connect(function(err) {
//             if(err) {
//                 console.log(' Error when connecting to db  (DBERR001):', err);
//                 setTimeout(this.handleDisconnect, 1000);
//             }
//         });
    
//     }

//     query(sql, params, callback) {
        
//         this.connection.query(sql, params, (err, results, fields) => {
//         if (err) {
//             console.error(err);
//             return callback(err);
//         }
//         return callback(null, results);
//         });
//     }
// }

// module.exports = DatabaseMysql;