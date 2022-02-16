module.exports = {
    development: 
    {
        client: 'mysql2',
        connection: 
        {
          host : '127.0.0.1',
          database : 'posts_control',
          user : 'admin',
          password : 'admin',
          charset :'utf8'
        },
        migrations:{
            directory:'./src/database/migrations'
        },
        useNullAsDefault:true,
    }
};