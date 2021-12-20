const connection = require('../database/connection');
const nodemailer = require('nodemailer')
const SMTP_CONFIG = require('../email/config')

module.exports = {
    //ROTA PARA CADASTRAR USUÁRIO (PORTAL).
    async create(request , response){
        const {
             user_buddy, 
             name_buddy,  
             email_buddy, 
             company_buddy, 
             cnpj_buddy 
            } = request.body;
        const password_buddy = Math.floor(Math.random() * 10 + 1); //GERA UMA SENHA INICIAL ALEATÓRIA.
        const result = await connection('user').insert({
            user_buddy , 
            name_buddy , 
            email_buddy , 
            company_buddy , 
            cnpj_buddy , 
            password_buddy
        });
       
        
        //ENVIA A SENHA GERADA PARA O EMAIL CADASTRADO.
        const transport = nodemailer.createTransport({
            host : SMTP_CONFIG.host ,
            port : SMTP_CONFIG.port , 
            secure : false , 
           auth :{
            user : SMTP_CONFIG.user , 
            pass : SMTP_CONFIG.pass
           }
        });
        
        transport.sendMail({
            text : 'REDEFINIR SENHA',
            subject : 'SALES BUDDY',
            from : '',
            to : email_buddy , 
            html : `<h2>SEU CADASTRO FOI REALIZADO COM SUCESSO SUA SENHA INICIAL É ${password_buddy}</h2>
                    PARA TROCAR , ACESSE O APLICATIVO`
        }).then(message => console.log('UM EMAIL FOI ENVIADO')).catch(err => console.log(err));

    
        
        return response.json({message : 'USUÁRIO CADASTRADO !' , 
        user_id : result
    });

    },
    
    //LISTA USUÁRIOS CADASTRADOS (PORTAL).
    async index(request , response){
        const users = await connection('user')
        .select(['id' ,'user_buddy' , 'name_buddy' , 'email_buddy' , 'company_buddy' , 'cnpj_buddy']);
        return response.json(users);
    },

    //DELETA UM USUÁRIO CADASTRADO (PORTAL).
    async delete(request , response){
        const {id} = request.params;
        await connection('user')
        .where('id' , id)
        .delete(); 
        
        return response.json({message : 'deletado'})
    },

    //LISTA UM ÚNICO USUÁRIO (FUNCIONALIDADE EXTRA)
    async details(request , response){
        const { id }= request.params;
        const user = await connection('user')
        .select(['user_buddy' , 'name_buddy' , 'email_buddy' , 'company_buddy' , 'cnpj_buddy']).where({id}).first();
        
        if(!user) return console.log('erro');
    
        return response.json(user);
        
    },

    //ATUALIZA USUÁRIO (PORTAL).
    async update(request , response){
        const {id} = request.params;
        const {user_buddy ,  name_buddy, email_buddy, company_buddy, cnpj_buddy} = request.body;

        await connection('user')
        .where({id})
        .update({user_buddy ,  name_buddy, email_buddy, company_buddy, cnpj_buddy})
 
        return response.json({message : 'SUCCESS !'})
    }


}