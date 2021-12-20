const connection = require('../database/connection');
const nodemailer = require('nodemailer');
const SMTP_CONFIG = require('../email/config');

module.exports = {

    //AUTENTICAÇÃO DE USUÁRIO (MOBILE). 
    async login(request , response) {
        const {password,user} = request.body;
        const login = await connection('user')
        .select( 'id','user_buddy', 'password_buddy')
        console.log(login.id)
        console.log(request.body)
        
        let result = 'deu erro';
        
        login.forEach(element => {
            if(element.user_buddy == user && element.password_buddy == password) {
            result = 'deu certo'
            }
        });

        if(result === 'deu certo') {
            return response.json({message : 'deu certo' , id : login} )
        }else {
            return response.json({message : 'deu erro'})
        }
        
        
    },

    //REDEFINIR SENHA DE USUÁRIO NO APP (FUNCIONALIDADE EXTRA MOBILE).
    async replaceUserPortal(request , response){
        const {id} = request.params;
        const password_buddy = Math.floor(Math.random() * 10 + 10); 
        await connection('user')
        .where({id})
        .update({password_buddy});

        return response.json({message : 'senha redefinida'})
    }

}