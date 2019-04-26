module.exports = (sequelize, DataTypes) => {
  const Reserve = sequelize.define('Reserve', {
    date: DataTypes.DATE
  })

  Reserve.associate = models => {
    Reserve.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' })
    Reserve.belongsTo(models.User, {
      as: 'provider',
      foreignKey: 'provider_id'
    })
  }

  return Reserve
}
