const { Score } = require('../models');

module.exports = {
  create(req, res) {
    return Score
      .create({
        player: req.body.player,
        score: req.body.score,
      })
      .then(todo => res.status(201).send(todo))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return Score
      .all()
      .then(todos => res.status(200).send(todos))
      .catch(error => res.status(400).send(error));
  },
};
