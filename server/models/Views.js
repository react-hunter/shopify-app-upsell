const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const Views = mongoose.Schema({
  id: ObjectId,
  shopId: ObjectId,
  campaign_id: {
    type: ObjectId,
    ref: 'Campaigns',
  },
  amount: Number,
  views: JSON,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Views', Views);
