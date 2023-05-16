const scoresController = require('../controllers').scores;

module.exports = app => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the API!',
  }));

  app.post('/api/scores', scoresController.create);
  app.get('/api/scores', scoresController.list);
};
