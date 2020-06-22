const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const TriggerItem = mongoose.Schema({
  title: {
    type: String,
  },
  id: {
    type: Number,
  },
});

const Offer = mongoose.Schema({
  product: TriggerItem,
  upsell_type: {
    type: String,
    enum: ['discount', 'free_shipping', 'none'],
  },
  offer_text: String,
  show_offer_description: Boolean,
  offer_description: String,
  discount: {
    discount_type: {
      type: String,
      enum: ['percent_off', 'amount_off', 'fixed_price'],
    },
    amount: Number,
  },
  limit_products: Boolean,
  limit_products_amount: Number,
  free_shipping: Boolean,
});

const Campaigns = mongoose.Schema({
  shopId: ObjectId,
  name: {
    type: String,
  },
  trigger: {
    type: String,
    enum: ['trigger_products', 'trigger_collections', 'trigger_amount', 'trigger_all'],
  },
  trigger_products: [TriggerItem],
  trigger_collections: [TriggerItem],
  offers: [Offer],
  trigger_amount: Number,
  isActive: {
    type: Boolean,
  },
  show_campaign_only: {
    type: String,
    enum: ['mobile', 'desktop', 'both'],
  },
  skip_offers_already_icluded: Boolean,
  show_this_funnel_once: Boolean,
  start_time: Boolean,
  start_date_value: Date,
  end_time: Boolean,
  end_date_value: Date,
  event: {
    type: String,
    default: 'checkout_click',
    enum: ['add_to_cart_click', 'page_view', 'checkout_click'],
  },
  page_to_show: {
    type: String,
    default: 'cart_page',
  },
  action_accept_offer: {
    type: String,
    default: 'go_to_checkout'
  },
  include_free_shipping: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

module.exports = mongoose.model('Campaigns', Campaigns);
