'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      (queryInterface.addColumn('users', 'operating_start', {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: "00:00"
      }),
      queryInterface.addColumn('users', 'operating_end', {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: "00:00"
      }))
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'operating_start'),
      queryInterface.removeColumn('users', 'operating_end')
    ])
  }
}
