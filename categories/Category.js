const Sequelize = require("sequelize"); // Extensao do Sequelize para o Model
const connection = require("../database/connection"); // Importar Conexao com Banco

const Category = connection.define('categories',{ // Criar tabela e Colunas
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{ // Abreviar textos para utilizar em URL
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Category; // Exportar Model
// Category.sync({force: true}) Criar tabela sempre que chamar o metodo/ Atualiza Tabela