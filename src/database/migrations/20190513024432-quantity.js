'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      (queryInterface.addColumn('appointments', 'people_quantity', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
      }))
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('appointments', 'people_quantity')
    ])
  }
}
