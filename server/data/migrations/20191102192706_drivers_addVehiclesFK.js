
exports.up = function(knex) {
  return knex.schema.alterTable('drivers', table => {
    table.uuid('currentVehicleId').unsigned().index()
      .references('id').inTable('vehicles').alter();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('drivers');
};
