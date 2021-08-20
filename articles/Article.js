const Sequelize  = require("sequelize"); // Extensao do Sequelize
const connection = require("../database/connection"); // Importar conexao com Banco de Dados
const Category = require("../categories/Category"); // Importar Model Category p/ Chave Estrangeira

const Article = connection.define('articles',{ // Criar tabela e Colunas
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Category.hasMany(Article); // Relacionamento 1/N
Article.belongsTo(Category); // Relacionamento 1/1

// Article.sync({force: true}); Criar tabela sempre que chamar o metodo/ Atualiza Tabela

module.exports = Article; // Exportar Model Artigos
