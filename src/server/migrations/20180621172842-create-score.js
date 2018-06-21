

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Scores', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    player: {
      allowNull: false,
      type: Sequelize.STRING
    },
    score: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface =>
    queryInterface.dropTable('Scores'),
};
