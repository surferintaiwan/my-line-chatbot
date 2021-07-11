

export const dbConfig = {
    "development": {
        host: "localhost",
        user: "root",
        password: "password",
        database: "my_line_chatbot",
        // "host": "127.0.0.1",
        // "dialect": "mysql",
        // "operatorsAliases": false
    },
    "test": {
        "username": "travis",
        "database": "masungo",
        "host": "127.0.0.1",
        "dialect": "mysql",
        "operatorsAliases": false
    },
    "production": {
        host: process.env.MYCLEARDB_HOST,
        user: process.env.MYCLEARDB_USER,
        password: process.env.MYCLEARDB_PASSWORD,
        database: process.env.MYCLEARDB_DATABASE
        // "dialect": "mysql"
    }
}
