exports.up = function(knex) {
    return knex.schema.createTable('itens' , table => {
        table.increments('id').primary(); 
        table.string('description').notNullable();
    })
};
  
  exports.down = function(knex) {
      return knex.schema.dropTable('itens');
    
};
