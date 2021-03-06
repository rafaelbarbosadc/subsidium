'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      (queryInterface.addColumn('users', 'people_quantity', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      }),
      queryInterface.addColumn('users', 'table_quantity', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      }))
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'people_quantity'),
      queryInterface.removeColumn('users', 'table_quantity')
    ])
  }
}
