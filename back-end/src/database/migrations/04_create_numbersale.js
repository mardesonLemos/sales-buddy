exports.up = function(knex) {
    return knex.schema.createTable('numberSales' , table =>{
        table.increments('id').primary();
        table.integer('user_id').notNullable().references('id').inTable('user');
        table.integer('n_sale');
        
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('numberSales');
};
