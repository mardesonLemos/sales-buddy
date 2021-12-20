const connection = require('../database/connection');
const nodemailer = require('nodemailer')
const SMTP_CONFIG = require('../email/config')

//ENVIO DE EMAIL
module.exports = {
    async sendEmail(request , response){

        const { client_buddy } = request.body;
        const clientEmail = await connection('venda_sales_buddy')
                                  .select('*')
                                  .where('client_buddy',client_buddy)
                                  .first();
        //ENVIO DO COMPROVANTE                          
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
            text : 'compra feita',
            subject : 'SALES BUDDY',
            from : '',
            to : clientEmail.email_buddy , 
            html :'<h2>SEU COMPROVATE CHEGOU !</h2>' ,
            attachments: [
                {
                    filename: `salesBuddy-${clientEmail.client_buddy}.pdf`,                                         
                    contentType: 'comprovante' 
                }]
        }).then(message => console.log('COMPROVANTE ENVIADO')).catch(err => console.log('ERROR : ' + err));

        return response.json({msn : 'comprovante enviado'});
    

    }
       

}
