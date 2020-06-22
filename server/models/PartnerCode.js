const mongoose = require('mongoose');

const PartnerCode = mongoose.Schema({
  code: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  trialDays: {
    type: Number,
    default: 7,
  },
  price: {
    type: Number,
    default: null,
  },
  viewsLimit: {
    type: Number,
    default: null,
  },
  unlimitedViews: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('PartnerCode', PartnerCode);
