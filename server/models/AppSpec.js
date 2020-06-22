const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const AppSpec = mongoose.Schema({
  id: ObjectId,
  key: String,
  type: String,
  value: mongoose.Schema.Types.Mixed,
}, { timestamps: false });

module.exports = mongoose.model('AppSpec', AppSpec);
