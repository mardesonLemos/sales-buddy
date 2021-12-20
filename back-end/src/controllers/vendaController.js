const connection = require('../database/connection');
const PDF = require('html-pdf');


module.exports ={
    //REGISTRO DE VENDA
    async create(request , response){
      const {
        client_buddy,
        cpf_buddy,
        description,
        email_buddy,
        number_sale,
        value_received,
        value_sale_buddy

    } = request.body;


    const q_itens = description.length; //VAI PEGAR O TAMANHO DO ARRAY, PARA OBETER A QUANTIDADE DE ITENS
    
    
    const id_venda =  await connection('venda_sales_buddy').insert({
        client_buddy,
        cpf_buddy, 
        email_buddy,
        number_sale,
        value_sale_buddy,
        value_received,
        q_itens //quantidade de itens
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

    async index(request , response){
        const sales = await connection('venda').select('*');
        return response.json(sales)
    },

    async delete(request , response){
      const {id} = request.params;
      await connection('venda').where('id' , id).delete();
      return response.json({message : 'deletado'})
    },

    async update(request , response){
      const {id} = request.params;
      const {cliente , cpf ,  email , item , valorVenda , valorRecebido} = request.body;

      await connection('venda')
      .update({cliente , cpf ,  email , item , valorVenda , valorRecebido})
      .where({id});

      return response.json({message : 'atualizado'})
    }, 
    async details(request , response){
      const {id} = request.params;

        const vendas = await connection('venda_sales_buddy').where('id',id).first();
        //const idItem = await connection('venda_itens').select('item.id').where();
        console.log(vendas)
        const item = await connection('itens')
        .join('venda_itens', 'itens.id', '=', 'venda_itens.item_id')
        .where('venda_itens.venda_id',id)
        .select('itens.description')
        console.log(item)
        return response.json(item);
    
    },

    async numberSale(request , response){


        const {user_buddy} = request.body;
        console.log(request.body)

         var number_sale;
        const user_id = await connection('user')
        .select(['id' , 'cnpj_buddy'])
        .where('user_buddy' ,user_buddy)
        .first();
        const ids = user_id.id
        
        //const ids = user_id.map(user=>console.log(user))
        const bd = await connection('numberSales')
        .select('*').where('user_id' , ids);
        if(bd == ""){
          await connection('numberSales').insert({
            user_id : ids, 
            n_sale : 1
            
          });
           number_sale = 1;
        }else {
          const bd_number_last = bd.pop();
          number_sale = bd_number_last.n_sale + 1;

          await connection('numberSales').insert(
            {
              user_id : ids , 
              n_sale : number_sale
            }
          )

        }

        //console.log(bd)
        //const n_sale = 3;
        /**await connection('numberSales').insert({
          user_id : ids, 
          n_sale
        }); */


        

        return response.json({number_sale});



        




    } , 
    async listVenda(request , response){
      const {id} = request.params;

      const vendas = await connection('venda_sales_buddy')
      .select('*')
      .where('id',id)
      .first();

      return response.json(vendas);


    }
}