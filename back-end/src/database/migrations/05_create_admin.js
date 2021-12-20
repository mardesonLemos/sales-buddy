//TABELA DE VENDA
exports.up = function(knex) {
    return knex.schema.createTable('admin' , table => {
        table.increments('id').primary();
        table.string('admin_buddy').notNullable();
        table.string('email_buddy').notNullable();
        table.string('password_admin_buddy').notNullable();
        
    })
};
exports.down = function(knex) {
    return knex.schema.dropTable('admin');
};
