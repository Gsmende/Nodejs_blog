const express = require("express"); // Extensao do express  
const router = express.Router(); //Parametro de Rotas
const Category = require("./Category"); // Importar Model Category 
const slugify = require("slugify"); // Extensao do Slug

router.get("/admin/categories/new", (req, res) => { // Rota de menu principal 
    res.render("admin/categories/new"); // Rederizar View Categories
});

router.post("/categories/save", (req, res) => { // Rota POST p/ salvar dados Category
    var title = req.body.title; // Capturando elemento do Body na view
    if(title != undefined){
        Category.create({ // Retorna informacoes para o Banco 
            title: title, // Coluna do Banco de dados recebendo variavel 
            slug: slugify(title) // Coluna do Banco de dados recebendo e convertendo Title
        }).then(() => {
            res.redirect("/admin/categories"); // Retorna para Page inicial apos captura
        })
    }else{
        res.redirect("/admin/categories/new"); // Return p/ Page se Titulo = Null
    }

});

router.get("/admin/categories", (req, res) => { // Rota de Listagem de Categorias
    Category.findAll().then(categories => { // Find All elementos dentro da tabela categories
        res.render("admin/categories/index", {categories: categories}); // CallBack
    });
    
});

router.post("/admin/delete", (req, res) => { // Rota p/ Excluir Categoria/ Referenciando Button
    var id = req.body.id; // Capturando id do Form na variavel VAR 
    if(id != undefined){ // Se diferente de Null
        if(!isNaN(id)){ // Se o Valor for numerico
            Category.destroy({ // Metodo Delete/ Pagar informacoes do Banco
                where: {
                    id: id
                }
            }).then(() => { // CallBack
                res.redirect("/admin/categories"); // Rota Listagem
            });
        }else{ // CallBack
            res.redirect("/admin/categories"); // Rota Listagem
        }
    }else{ // CallBack 
        res.redirect("/admin/categories"); // Rota Listagem
    }
});

router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id; // Var que recebe ID do Parametro URL
    if(isNaN(id)){ // Se o ID contem apenas Numero
        res.redirect("/admin/categories"); // Rota Listagem
    }
    Category.findByPk(id).then(category => { // Metodo de pesquisa por ID, buscando na URL (Params)
        if(category != undefined){ // Se diferente de Null
            res.render("admin/categories/edit",{category: category});


        }else{
            res.redirect("/admin/categories"); // Rota Listagem
        }

    }).catch(erro => { // Caso retorne erro
        res.redirect("/admin/categories"); // Rota Listagem
    });
});

router.post("/categories/update", (req, res) => {
    var id = req.body.id; // Extraindo ID do front End
    var title = req.body.title; // Extraindo Title no Front End

    Category.update({title: title, slug: slugify(title)}, { // Metodo de Update/ Sequelize
        where: { // Atualizar onde ID for igual a selecao
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories"); // Rota Listagem
    })
});

module.exports = router; // Exportando elemento de Rotas


