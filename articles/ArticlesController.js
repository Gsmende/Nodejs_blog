const express = require("express"); // Extensao do Express
const router = express.Router(); // Parametro de Rotas
const Category = require("../categories/Category"); // Importar Conexao com Table Categories
const Article = require("./Article"); // Importar Conexao com table Articles
const slugify = require("slugify");

router.get("/admin/articles", (req,res) => { // Rota do Menu principal
    Article.findAll({ // Objeto de pesquisa
        include: [{model: Category}] // Join, Array, Objeto/ Buscar nomes em Category 
    }).then(articles => { // Exibir todos os Artigos no Banco
        res.render("admin/articles/index",{articles: articles}) //CallBack
    });
});

router.get("/admin/articles/new", (req, res) => { // Rota de Criacao de Artigo
    Category.findAll().then(categories => { // FindAll para selecionar a Categoria para o Artigo
        res.render("admin/articles/new", {categories: categories}); // Render da variavel na View/ Lista de Cat
    });
    
});

router.post("/articles/save", (req, res) => { // Rota p/ Salvar formulario 
    var title =  req.body.title; // Title de Artigo 
    var body =  req.body.body; // Var da TextArea
    var category = req.body.category; // Name atribuido ao ID no Selection da Option 

    Article.create({ // Passando para o Banco as variaveis da View
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => { // CallBack
        res.redirect("/admin/articles");
    })

});

router.post("/articles/delete", (req, res) => { // Rota p/ Excluir Artigo/ Referenciando Button
    var id = req.body.id; // Capturando id do Form na variavel VAR 
    if(id != undefined){ // Se diferente de Null
        if(!isNaN(id)){ // Se o Valor for numerico
            Article.destroy({ // Metodo Delete/ Pagar informacoes do Banco
                where: {
                    id: id
                }
            }).then(() => { // CallBack
                res.redirect("/admin/articles"); // Rota Listagem
            });
        }else{ // CallBack
            res.redirect("/admin/articles"); // Rota Listagem
        }
    }else{ // CallBack 
        res.redirect("/admin/articles"); // Rota Listagem
    }
});

router.get("/admin/articles/edit/:id", (req, res) => { // Rota p/ Editar Artigo/ Referenciando Button
    var id = req.params.id; // Capturando id do Form na variavel VAR 
    Article.findByPk(id).then(article => { // Procurando ID pela Primary Key
        if(article != undefined){ // Se diferente de Null
            Category.findAll().then(categories => { // Search em todas as categorias
                res.render("admin/articles/editor", {categories: categories}); // Passando VAR para a View Editor
            });
        }else{ // Senao
            res.redirect("/"); // Callback
        }
    }).catch(error => { // Se erro
        res.redirect("/"); // CallBack
    });
});

module.exports = router; // Exportar elemento de Rotas
