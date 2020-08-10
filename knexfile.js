module.exports = {
    development: {
        client: 'mysql',
        connection: {
            //Live Server

            // host: 'localhost',
            // user: 'mindfin',
            // password: 'mindfin!@#$%',
            // database: 'mindfin_live',

            //Test Server

            host: 'localhost',
            user: 'mindfin',
            password: 'mindfin!@#$%',
            database: 'mindfin_test',

            //Local System

            // host: 'localhost',
            // user: 'root',
            // password: '',
            // database: 'mindfin',


            charset: 'utf8'
        },
    }
};