const { User, Appointment } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')
class DashboardController {
  async index (req, res) {
    const providers = await User.findAll({ where: { provider: true } })
    const peopleQuantity = await Appointment.sum('people_quantity', {
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            moment()
              .startOf('day')
              .format(),
            moment()
              .endOf('day')
              .format()
          ]
        }
      }
    })

    const reserveQuantity = await Appointment.count({
      distinct: true,
      col: 'Appointment.id',
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            moment()
              .startOf('day')
              .format(),
            moment()
              .endOf('day')
              .format()
          ]
        }
      },
      order: [['date', 'ASC']]
    })

    console.log(reserveQuantity)

    return res.render('dashboard', {
      providers,
      peopleQuantity,
      reserveQuantity
    })
  }

  async editProfile (req, res) {
    const providers = await User.findAll({ where: { provider: true } })

    return res.render('editProfile', { providers })
  }

  async saveProfile (req, res) {
    const { name, email, table_quantity, people_quantity } = req.body

    const userData = await User.update(
      {
        name,
        email,
        people_quantity,
        table_quantity
      },
      { where: { id: req.session.user.id } }
    )

    const providers = await User.findAll({ where: { provider: true } })

    return res.render('dashboard', { providers })
  }
}

module.exports = new DashboardController()
