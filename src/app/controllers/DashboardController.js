const { User } = require('../models')

class DashboardController {
  async index (req, res) {
    const providers = await User.findAll({ where: { provider: true } })

    return res.render('dashboard', { providers })
  }

  async editProfile (req, res) {
    const providers = await User.findAll({ where: { provider: true } })

    return res.render('editProfile', { providers })
  }

  async saveProfile (req, res) {
    const { name, email, table_quantity, people_quantity, operating_start, operating_end } = req.body

    const userData = await User.update(
      {
        name,
        email,
        people_quantity,
        table_quantity,
        operating_start,
        operating_end
      },
      { where: { id: req.session.user.id } }
    )

    const providers = await User.findAll({ where: { provider: true } })

    return res.render('dashboard', { providers })
  }
}

module.exports = new DashboardController()
