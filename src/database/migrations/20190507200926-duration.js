'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      (queryInterface.addColumn('appointments', 'price', {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0
      }),
      queryInterface.addColumn('appointments', 'duration', {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: "00:00"
      }))
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('appointments', 'price'),
      queryInterface.removeColumn('appointments', 'duration')
    ])
  }
}
