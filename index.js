const express = require("express"); // Carregar os modulos do Express
const app =  express(); // Criar uma instancia do Express
const bodyParser = require("body-parser"); // Carregar os modulos do Body-Parser
const connection = require("./database/connection"); // Importar conexao com banco de Dados
const CategoriesController = require("./categories/CategoriesController"); // Importar Rota Categorias
const ArticlesController = require("./articles/ArticlesController"); // Importar Rota Artigos
const Category = require("./categories/Category"); // importar Model Categories
const Article = require("./articles/Article"); // Importar Model Article
const { render } = require("ejs");

app.set('view engine','ejs'); // carregar view engine HTML da pasta views

app.use(express.static('public')); // Aceitar arquivos Static como media e Front-End na pasta public
app.use(bodyParser.urlencoded({extended: false})); // Capturar dados HTML/FrontEnd para o bannco de Dados
app.use(bodyParser.json()); // Aceitar arquivos Json

connection.authenticate() // Metodo de Autenticacao com Banco de Dados
    .then(() => {
        console.log("CONNECTION SUCCESS"); // CallBack
    }).catch((error) => {
        console.log(error); // Retorna erro caso a Conexao nao realize
    });

app.use("/", CategoriesController); // Utilizar Rotas importadas de Categories
app.use("/", ArticlesController); // Utilizar Rotas importadas de Artigos

app.get("/", (req,res) => { // Rota da tela inicial 
    Article.findAll({
        order: [['id','DESC']]
    }).then(articles => { // Procurar tudo em Model Article
        Category.findAll().then(categories => { // Procurar todos os tipos de Categorias
            res.render("index", {articles: articles, categories: categories}); // Rederizar view ejs criada na tela com os Dados de Artigos
        });
    });
});

app.get("/:slug", (req, res) => { //Rota para exibir Artigos atraves do Slugify
    var slug = req.params.slug; // Absorvendo dados de Slug passado na URL
    Article.findOne({ // Efetuar busca no Banco por Slug
        where: {
            slug: slug
        }
    }).then(article => { // Se encontrada a informacao
        if(article != undefined){ // Se diferente de Null
            Category.findAll().then(categories => { // Procurar todos os tipos de Categorias
                res.render("article", {article: article, categories: categories}); // Rederizar view ejs criada na tela com os Dados de Artigos
            });
        }else{
            res.redirect("/"); // Callback
        }
    }).catch(erro => { // Caso retorne erro na busca 
        res.redirect("/"); // Callback
    });
});

app.get("/category/:slug", (req, res) => { //Rota para exibir Categorias atraves do Slugify
    var slug = req.params.slug; // Absorvendo dados de Slug passado na URL
    Category.findOne({ // Efetuar busca no Banco por Slug
        where: {
            slug: slug
        },
        include: [{model: Article}] // Join para inclusao das informacao de Artigos nos indices de Categorias
    }).then(category => { // Se encontrada a informacao
        if(category != undefined){ // Se diferente de Null
            Category.findAll().then(categories => { // Efetuando busca das Categorias para NavBar
                res.render("index",{articles: category.articles, categories: categories}); // Passando var para view
            });
        }else{
            res.redirect("/"); // Callback
        }
    }).catch(error => { // Caso retorne erro na busca 
        res.redirect("/"); // Callback
    })
})

app.listen(8080, () => { // Atribuido porta do server
    console.log("SERVER RUNNING"); // CallBack 
});
