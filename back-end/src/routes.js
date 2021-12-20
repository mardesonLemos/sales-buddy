const express = require('express');
const userController = require('./controllers/userController');
const vendaController = require('./controllers/vendaController');
const userLogin = require('./controllers/userFeatures');
const adminController = require('./controllers/adminController')
const vendaFeature = require('./controllers/vendaFeatures');
const userFeatures = require('./controllers/userFeatures');
const teste = require('./controllers/venda_sales_buddy')

const routes = express.Router();
//ROTA RAIZ
routes.get('/' , (request , response) => {
    response.json({message : 'PROJETO SALES BUDDY'});
});

//ROTAS DE USUÁRIO.
routes.post('/user' , userController.create); //CRIA UM USUÁRIO (PORTAL).
routes.get('/user' , userController.index); //LISTA TODOS OS USUÁRIOS (PORTAL).
routes.get('/user/:id' , userController.details); //LISTA UM USUÁRIO ESPECIFICO (EXTRA).
routes.delete('/user/:id' , userController.delete); //DELETA USUÁRIO (PORTAL).
routes.put('/user/:id' , userController.update); //ATUALIZA USUÁRIO (PORTAL).
//FEATURES DE USUÁRIO.
routes.post('/login' , userLogin.login); //AUTENTICAÇÃO DE USUÁRIO (MOBILE). 
routes.put('/passwordReplace/:id' , userLogin.replaceUserPortal) //REDEFINIR SENHA DO USUÁRIO (PORTAL).

//ROTA DE VENDAS
routes.post('/sales' , vendaController.create); //CRIA UMA VENDA(MOBILE)
routes.get('/sales/:id' , vendaController.details); //LISTA VENDA ESPERCIFICA(MOBILE)
//FEATURES DE VENDA
routes.post('/envio' , vendaFeature.sendEmail); 

//ROTAS DO ADMINISTRADOR.
routes.post('/admin' , adminController.create); 
routes.post('/adminLogin' , adminController.login);
routes.post('/adminForgot' , adminController.forgotPassword)


//routes.delete('/sales/:id' , vendaController.delete); //DELETA VENDA
//routes.put('/sales/:id' , vendaController.update); //ATUALIZA VENDA
//ROTAS PARA VENDA
//routes.post('/vendaSales' , teste.create)
routes.get('/vendaSales/:id' , teste.index);
routes.get('/listVenda/:id' , vendaController.listVenda)
//routes.post('/envio' , teste.sendEmail);
routes.get('/listSales' , teste.dados)
routes.post('/numberSale' , vendaController.numberSale)

module.exports = routes;