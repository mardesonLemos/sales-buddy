exports.up = function(knex) {
    return knex.schema.createTable('user' , table =>{
        table.increments('id').primary();
        table.string('user_buddy').notNullable();
        table.string('name_buddy').notNullable();
        table.string('email_buddy').notNullable();
        table.string('company_buddy').notNullable();
        table.string('cnpj_buddy').notNullable();
        table.string('password_buddy').notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('user_sales_buddy');
};

//npx knex migrate:latest
