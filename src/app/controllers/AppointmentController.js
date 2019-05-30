const { User, Appointment } = require('../models')
const nodemailer = require("nodemailer");

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
      where:{
        provider_id: provider,
        date: date
      }
    })

    if(count_appointment == 0){
      await Appointment.create({
        user_id: id,
        provider_id: provider,
        date,
        duration,
        people_quantity:people_quantity
      })
    }else{

      const people_reserved = await Appointment.sum('people_quantity',{
        where:{
          provider_id: provider,
          date: date
        }
      })

      const restaurant = await User.findByPk(provider)
      const total_people= restaurant.people_quantity
      const table_quantity= restaurant.table_quantity
      const table_available = Math.trunc(table_quantity - (people_reserved/4));
      const table_requested = Math.ceil(people_quantity/4);

      if((people_reserved < total_people) && (table_requested < table_available)){

        await Appointment.create({
          user_id: id,
          provider_id: provider,
          date,
          duration,
          people_quantity:people_quantity
        })
      }
    }

    const user = await User.findByPk(id)

    const EMAIL = ''; // Adicionar email do subsidium e autorizar email aqui 'https://myaccount.google.com/lesssecureapps?pli=1'
    const PASSWORD = ''; // Adicionar senha do email do subsidium

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
      html: '<p>Olá<br />Só passamos para avisá-lo de que seu agendamento foi efetuado com sucesso!<br />Este é um email automático, favor não respondê-lo.</p>'
    };

    let info = await transporter.sendMail(mailOptions);

    console.log("Mensagem enviada: %s", info.messageId);

    return res.redirect('/app/dashboard')
  }

}

module.exports = new AppointmentController()
