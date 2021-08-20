const Sequelize = require("sequelize"); // Importar Sequelize

const connection = new Sequelize('projetopress','seu usuario','sua senha',{ // objeto de conexao com Banco
    host: 'localhost', // localizacao do server
    dialect: 'mysql',  // qual tipo de banco de dados
    timezone: "-03:00" // Seta a hora no formato BR
});

module.exports = connection;
