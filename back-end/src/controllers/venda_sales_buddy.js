const connection = require('../database/connection');
const nodemailer = require('nodemailer')
const SMTP_CONFIG = require('../email/config')
const PDF = require('html-pdf');

module.exports = {
    //METÓDO PARA CRIAR UMA VENDA
    async create(request , response){
        const {
            client_buddy, //NOME DO CLIENTE
            cpf_buddy, //CPF DO CLIENTE
            email_buddy, //EMAIL DO CLIENTE
            value_sale_buddy, //VALOR DA VENDA
            value_received,  //VALOR OBTIDO DA VENDA
            description, //RECEBE UM ARRAY COM OS ITENS
        } = request.body;
      
        const id_venda =  await connection('venda_sales_buddy').insert({
            client_buddy,
            cpf_buddy, 
            email_buddy,
            value_sale_buddy,
            value_received,
        });
      
        const id_itens = description.map(description => {
            return {
                description
            }
        });
      
        id_itens.map(async (descriptio) => {
            await connection('itens').insert(descriptio).then(async function(id) { 
                const venda_item = {
                    item_id : id, 
                    venda_id : id_venda[0]
                }
                await connection('venda_itens').insert(venda_item);
            });
                  
             
                  
      });
  
  
  
      
      //GERAR O COMPROVANTE DA VENDA NO FORMATO .PDF
      PDF.create( `        
      NOME : ${client_buddy} <br>
      CPF : ${cpf_buddy} <br>
      E-MAIL : ${email_buddy} <br> <hr>
      <ul style= 'list-style: none;'>${description.map((item , index) => (index + 1) + '<li>' + item + '</li>')}</ul>
      <hr style='border-top: 1px solid #A32C65;'>
      VALOR RECEBIDO : ${value_received}<br>
      VALOR DA VENDA : ${value_sale_buddy}<br>
      TROCO DEVIDO : ${value_received - value_sale_buddy}
  `).toFile('./comprovante/salesBuddy-'+client_buddy+'.pdf' , (err , res) => {
          if(err) console.log('Erro' + err)
          else console.log(res)
      })
  
  
      return response.json({msn : 'venda registrada'});
   
  },

    //LISTA UMA VENDA ESPECIFICA
    async index(request , response){
        const {id} = request.params;

        const vendas = await connection('venda_sales_buddy').where('id',id).first();
        //const idItem = await connection('venda_itens').select('item.id').where();
        console.log(vendas)
        const item = await connection('itens')
        .join('venda_itens', 'itens.id', '=', 'venda_itens.item_id')
        .where('venda_itens.venda_id',id)
        .select('itens.description')
        console.log(item)
        return response.json( item);
    },
    
    //ENVIO DE COMPROVANTE PARA O E-MAIL
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
    },

    async dados(request , response){
       const venda= await connection('venda_sales_buddy')
       .select([ 'id' , 'client_buddy' , 'cpf_buddy','email_buddy' , 'number_sale','value_received' , 'value_sale_buddy' , 'q_itens']);
       //const id_v = await connection('venda_sales_buddy').select('id');
       
      
       

       //const result = await connection('itens').select()

     
    

       return response.json(venda);
    }
}