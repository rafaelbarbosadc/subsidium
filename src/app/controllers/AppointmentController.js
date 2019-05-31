const { User, Appointment } = require('../models')
const  moment  = require('moment')
const { Op } = require('sequelize')
const nodemailer = require('nodemailer')

class AppointmentController {
  async create (req, res) {
    const provider = await User.findByPk(req.params.provider)
    return res.render('appointments/create', { provider })
  }

  async store (req, res) {
    const { id } = req.session.user
    const { provider } = req.params
    const { date, duration, people_quantity } = req.body

    console.log("DATE", date)
    const duration_int = parseInt(duration[1])
    // const duration_date = new Date(date)
    const date_end = moment(date).add(duration_int,'hours').format()//.add(duration_int, 'hours')

    console.log("==============================================")
    console.log(date_end)
    const count_appointment = await Appointment.count({
      distinct: true,
      col: 'Appointment.id',
      where: {
        provider_id: provider,
        date: { [Op.between]: [date, date_end] }
      }
    })
    console.log("==============================================")

    const restaurant = await User.findByPk(provider)
    const total_people = restaurant.people_quantity

    if (total_people >= people_quantity) {
      if (count_appointment == 0) {
       let appointment = await Appointment.create({
          user_id: id,
          provider_id: provider,
          date,
          duration,
          people_quantity: people_quantity
        })
        const user = await User.findByPk(id)

        const EMAIL = 'subsidium.app@gmail.com'; // Adicionar email do subsidium e autorizar email aqui 'https://myaccount.google.com/lesssecureapps?pli=1'
        const PASSWORD = 'subsidium123'; // Adicionar senha do email do subsidium
    
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
                 user: EMAIL,
                 pass: PASSWORD
             }
         });
    
         const mailOptions = {
          from: EMAIL,
          to: [user.email, provider.email].join(), 
          subject: 'Confirmação de Agendamento', 
          html: `<h1>Olá, ${user.name} </h1>
          Só passamos para avisá-lo de que seu agendamento foi efetuado com sucesso! <br>
          <ul> 
            <li> Código da Reserva: <strong>#${appointment.id}</strong></li>
            <li> Data: ${moment(date).format('DD/MM/YYYY HH:mm')}</li>
            <li> Restaurante: ${restaurant.name}</li>
          </ul>
          <br />Este é um email automático, favor não respondê-lo.</p> `
        };
    
        let info = await transporter.sendMail(mailOptions);
    
        console.log("Mensagem enviada: %s", info.messageId);
        
        return res.render('app')
      }
     else {
      const people_reserved = await Appointment.sum('people_quantity', {
        where: {
          provider_id: provider,
          date: { [Op.between]: [date, date_end] }
        }
      })

      const table_quantity = restaurant.table_quantity
      const table_available = Math.trunc(table_quantity - (people_reserved / 4))
      const table_requested = Math.ceil(people_quantity / 4)

      if (people_reserved < total_people && table_requested < table_available) {
        let appointment = await Appointment.create({
          user_id: id,
          provider_id: provider,
          date,
          duration,
          people_quantity: people_quantity
        })

        const user = await User.findByPk(id)

        const EMAIL = 'subsidium.app@gmail.com'; // Adicionar email do subsidium e autorizar email aqui 'https://myaccount.google.com/lesssecureapps?pli=1'
        const PASSWORD = 'subsidium123'; // Adicionar senha do email do subsidium
    
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
                 user: EMAIL,
                 pass: PASSWORD
             }
         });
    
         const mailOptions = {
          from: EMAIL,
          to: [user.email, provider.email].join(), 
          subject: 'Confirmação de Agendamento', 
          html: `<h1>Olá, ${user.name} </h1>
          Só passamos para avisá-lo de que seu agendamento foi efetuado com sucesso! <br>
          <ul> 
            <li> Código da Reserva: <strong>#${appointment.id}</strong></li>
            <li> Data: ${moment(date).format('DD/MM/YYYY HH:mm')}</li>
            <li> Restaurante: ${restaurant.name}</li>
          </ul>
          <br />Este é um email automático, favor não respondê-lo.</p> `
        };
    
        let info = await transporter.sendMail(mailOptions);
    
        console.log("Mensagem enviada: %s", info.messageId);
        
      } else {
        req.flash('error','Sem vagas suficientes')
      }
    }
  }
    return res.redirect('/app/dashboard')
  }
}

module.exports = new AppointmentController()
