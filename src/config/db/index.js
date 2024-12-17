const mysql =  require('mysql2');
const { promisify } =  require('util');

const dbConnect = () => { 
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Cekh009009',
        database: 'promptopia'
    })

    const query = promisify(db.query).bind(db);

    db.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
        } else {
            console.log('Connected to the database.');
        }
    });


    return {query, db};
}

module.exports = {dbConnect};