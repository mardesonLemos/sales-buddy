//TABELA DE VENDA
exports.up = function(knex) {
    return knex.schema.createTable('venda_sales_buddy' , table => {
        table.increments('id').primary();
        table.string('client_buddy').notNullable();
        table.string('cpf_buddy').notNullable();
        table.string('email_buddy').notNullable();
        table.integer('number_sale').notNullable();
        table.decimal('value_sale_buddy').notNullable();
        table.decimal('value_received').notNullable();
        table.integer('q_itens').notNullable();
    })
};
exports.down = function(knex) {
    return knex.schema.dropTable('venda_sales_buddy');
};
