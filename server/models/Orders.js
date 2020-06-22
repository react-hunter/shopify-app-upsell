const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const Orders = mongoose.Schema({
  id: ObjectId,
  shopId: ObjectId,
  campaign_id: {
    type: ObjectId,
    ref: 'Campaigns',
  },
  order_init_id: {
    type: String,
    default: null,
  },
  order_id: {
    type: String,
    default: null,
  },
  order_draft_id: {
    type: String,
    default: null,
  },
  amount: {
    type: Number,
    default: 0,
  },
  upsell_amount: {
    type: Number,
    default: 0,
  },
  tmp_upsell_amount: {
    type: Number,
    default: 0,
  },
  order_init_amount: {
    type: Number,
    default: 0,
  },
  is_order: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Orders', Orders);
