exports.up = function(knex) {
    return knex.schema.createTable('venda_itens' , table => {
        table.increments('id').primary();
        table.integer('venda_id').notNullable().references('id').inTable('venda_sales_buddy');
        table.integer('item_id').notNullable().references('id').inTable('itens');
          
    })
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('venda_itens');
};

