const mongoose = require('mongoose');

const Shop = mongoose.Schema({
  shopify_domain: String,
  accessToken: String,
  isActive: { type: Boolean, default: false },
  isActiveManual: { type: Boolean, default: false },
  premiumForFree: { type: Boolean, default: false },
  premiumPaid: { type: Boolean, default: false },
  paymentConfirmationUrl: { type: String, default: '' },
  chargeId: String,
  pricingPlan: {
    type: String,
    default: null,
  },
  overLimit: {
    type: Boolean,
    default: false,
  },
  periodStartedAt: {
    type: Date,
  },
  periodRenewAt: {
    type: Date,
  },
  sentEmailAfter: {
    type: Number,
    default: 0,
  },
  shopInformation: Object,
  requires_session_refresh: { type: Boolean, default: false },
  partnerCode: {
    type: String,
    default: null,
  },
  // will be used for info
  partnerCodeName: {
    type: String,
    default: null,
  },
  // will be used for check limits !important field
  customViewsLimit: {
    type: Number,
    default: null,
  },
  unlimitedViews: {
    type: Boolean,
    default: false,
  },
  // will be used for info
  customPrice: {
    type: Number,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Shop', Shop);
