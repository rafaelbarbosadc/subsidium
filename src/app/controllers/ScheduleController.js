const { Appointment, User } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')

class ScheduleController {
  async index (req, res) {
    const appointments = await Appointment.findAll({
      include: [{ model: User, as: 'user' }],
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            moment()
              .startOf('day')
              .format(),
            moment()
              .endOf('week')
              .format()
          ]
        }
      },
      order: [['date', 'ASC']]
    })
    let daysWeek = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado'
    ]
    return res.render('schedule/index', { appointments, daysWeek })
  }

  async history (req, res) {
    const appointments = await Appointment.sequelize.query(
      `SELECT * FROM appointments
      JOIN users ON users.id = appointments.provider_id
      WHERE user_id = ${req.session.user.id}
      ORDER BY date DESC
      `,
      {
        type: Appointment.sequelize.QueryTypes.SELECT
      }
    )
    return res.render('schedule/history', { appointments })
  }
}

module.exports = new ScheduleController()
