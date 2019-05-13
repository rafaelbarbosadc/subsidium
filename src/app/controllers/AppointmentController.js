const { User, Appointment } = require('../models')

class AppointmentController {
  async create (req, res) {
    const provider = await User.findByPk(req.session.user.id)

    return res.render('appointments/create', { provider })
  }

  async store (req, res) {
    const { id } = req.session.user
    const { provider } = req.params
    const { date, duration, people_quantity } = req.body

    await Appointment.create({
      user_id: id,
      provider_id: provider,
      date,
      duration,
      people_quantity
    })

    return res.redirect('/app/dashboard')
  }
}

module.exports = new AppointmentController()
