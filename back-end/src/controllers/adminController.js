const connection = require("../database/connection")
const nodemailer = require('nodemailer');
const SMTP_CONFIG = require('../email/config');

module.exports ={
    //CADASTRAR ADMINISTRADOR PRICIPAL DO PORTAL (PORTAL)
    async create(request , response){
        const {admin_buddy , email_buddy , password_admin_buddy} = request.body;
        await connection('admin').insert({
             admin_buddy, 
             email_buddy,
             password_admin_buddy
        })
        return response.json({message : 'SUCCESS !!'})
    },

    //METODO DE LOGIN DO ADIMINISTRADOR (PORTAL)
    async login(request , response){
        const {
            admin_buddy, 
            password_admin_buddy
        } = request.body;

        
        const login = await connection('admin').select(['admin_buddy' , 'password_admin_buddy'])
        
        let result = 'erro';
        
        login.forEach(element => {
            if(element.admin_buddy === admin_buddy && element.password_admin_buddy === password_admin_buddy) {
               result = 'success'
            }
        });

        if (result === 'success') return response.json({message : 'success'}) 
        else return response.status(400).send('Usuário Não existe');
             
    },

    //METODO PARA RECUPERAR SENHA DO ADMINISTRADOR (PORTAL)
    async forgotAdimin(request , response){
        
        const {email_buddy} = request.body;

        const result = await connection('admin')
        .select('password_admin_buddy')
        .where('email_buddy' , email_buddy)
        .first();
        let pass = Object.values(result)
       
       
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
            text : 'RECUPERAÇÃO DE SENHA',
            subject : 'SALES BUDDY',
            from : '',
            to : email_buddy , 
            html : `<h2>SUA SENHA É :${ pass.toString()}</h2>`
        }).then(message => console.log('UM EMAIL FOI ENVIADO')).catch(err => console.log(err));
 
       return response.json({msn : 'sucess !'}) 
    }
   
}