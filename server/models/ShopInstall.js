const mongoose = require('mongoose');

const ShopInstall = mongoose.Schema({
  shopify_domain: String,
  trialStartedAt: Date,
  trialDays: Number,
  premiumForFree: { type: Boolean, default: false },
  cancelledAt: Date,
  periodStartedAt: Date,
  views: Number,
}, { timestamps: true });

module.exports = mongoose.model('ShopInstall', ShopInstall);
