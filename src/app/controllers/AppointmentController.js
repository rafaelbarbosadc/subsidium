const { User, Appointment } = require('../models')

class AppointmentController {
  async create (req, res) {
    const provider = await User.findByPk(req.params.provider)
    return res.render('appointments/create', { provider })
  }

  async store (req, res) {
    const { id } = req.session.user
    const { provider } = req.params
    const { date, duration, people_quantity } = req.body

    const count_appointment = await Appointment.count({
      where: {
        provider_id: provider,
        date: date
      }
    })
    const restaurant = await User.findByPk(provider)
    const total_people = restaurant.people_quantity
    
    if((count_appointment == 0 ) && (total_people >= people_quantity)){
      await Appointment.create({
        people_quantity: people_quantity
      })
    } else {
      const people_reserved = await Appointment.sum('people_quantity', {
        where: {
          provider_id: provider,
          date: date
        }
      })
    
      const table_quantity= restaurant.table_quantity
      const table_available = Math.trunc(table_quantity - (people_reserved/4));
      const table_requested = Math.ceil(people_quantity/4);
      
      if((people_reserved < total_people) && (table_requested < table_available)){
        
        await Appointment.create({
          user_id: id,
          provider_id: provider,
          date,
          duration,
          people_quantity: people_quantity
        })
      }
    }

    return res.redirect('/app/dashboard')
  }
}

module.exports = new AppointmentController()
