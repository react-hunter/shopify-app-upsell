const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const Settings = mongoose.Schema({
  shopId: ObjectId,
  shopify_domain: String,
  displayUpgradeModal: {
    type: Boolean,
    default: false,
  },
  bar_notice_hidden: {
    type: Boolean,
    default: false,
  },
  bar_notice_dashboard_hidden: {
    type: Boolean,
    default: false,
  },
  is_created_first_campaign: {
    type: Boolean,
    default: false,
  },
  is_recieved_expert_review: {
    type: Boolean,
    default: false,
  },
  has_active_pre_purchase_funnels: {
    type: Boolean,
    default: false,
  },
  design: {
    theme: {
      upsell_page: {
        background_color: {
          type: String,
          default: '#FFFFFF',
        },
        text_color: {
          type: String,
          default: '#2D2D2D',
        },
        top_background_color: {
          type: String,
          default: '#FFFFFF',
        },
        next_offer_text: {
          type: String,
          default: 'Next offer',
        },
        previous_offer_text: {
          type: String,
          default: 'Previous offer',
        },
      },
      top_bar: {
        show: {
          type: Boolean,
          default: true,
        },
        bar_text: {
          type: String,
          default: 'Wait! buy {{product name}} and get {{upsell-offer}}',
        },
        text_size: {
          type: String,
          default: 15,
        },
        background_color: {
          type: String,
          default: '#FFFFFF',
        },
        text_color: {
          type: String,
          default: '#2D2D2D',
        },
        font: {
          type: String,
          default: 'Cabin',
        },
      },
      countdown_timer: {
        show: {
          type: Boolean,
          default: true,
        },
        bar_text: {
          type: String,
          default: 'HURRY! OFFER WILL EXPIRE IN',
        },
        offer_expired_text: {
          type: String,
          default: 'Offer expired',
        },
        text_size: {
          type: String,
          default: 18,
        },
        background_color: {
          type: String,
          default: '#2D2D2D',
        },
        text_color: {
          type: String,
          default: '#ffffff',
        },
        font: {
          type: String,
          default: 'Cabin',
        },
        start_countdown_from: {
          type: Array,
          default: [0, 1, 5, 9],
        },
      },
      price: {
        old_price_color: {
          type: String,
          default: '#A4A4A4',
        },
        new_price_color: {
          type: String,
          default: '#CE1948',
        },
        discount_text: {
          type: String,
          default: 'You save {{discount-amount}}!',
        },
        text: {
          type: String,
          default: 'Free Shipping included',
        },
        text_color: {
          type: String,
          default: '#CE1948',
        },
        font: {
          type: String,
          default: 'Cabin',
        },
      },
      product: {
        show_quantity: {
          type: Boolean,
          default: true,
        },
        image_layout: {
          type: String,
          default: 'square',
        },
        quantity_text: {
          type: String,
          default: "Quantity",
        },
        out_of_stock_text: {
          type: String,
          default: "Unavailable",
        },
        show_description: {
          type: Boolean,
          default: true,
        },
        text_color: {
          type: String,
          default: '#2D2D2D',
        },
        font: {
          type: String,
          default: 'Cabin',
        },
        vartiants_bg_color: {
          type: String,
          default: '#FFFFFF',
        },
        variants_text_color: {
          type: String,
          default: '#2D2D2D',
        },
        button_text: {
          type: String,
          default: 'Grab this deal!',
        },
        product_page_button_text: {
          type: String,
          default: 'Add to Cart',
        },
        cart_page_button_text: {
          type: String,
          default: 'Add to Cart',
        },
        thank_you_page_button_text: {
          type: String,
          default: 'Grab this deal!',
        }, 
        redirection_text: {
          type: String,
          default: 'Redirecting to Checkout',
        },
        button_color: {
          type: String,
          default: '#18A95E',
        },
        button_text_color: {
          type: String,
          default: '#FFFFFF',
        },
        go_to_checkout_text: {
          type: String,
          default: 'Continue to Checkout',
        },
        product_page_text: {
          type: String,
          default: 'Continue to Cart',
        },
        cart_page_text: {
          type: String,
          default: 'Skip and Continue to Checkout',
        },
        thank_you_page_text: {
          type: String,
          default: 'Continue to Checkout',
        },
        go_to_checkout_text_color: {
          type: String,
          default: '#18A95E',
        },
        go_to_checkout_bg_color: {
          type: String,
          default: '#FFFFFF',
        },
        description_bg_color: {
          type: String,
          default: '#FFFFFF',
        },
        description_text_color: {
          type: String,
          default: '#A4A4A4',
        },
      },
      minimized_view: {
        start_minimized: {
          type: Boolean,
          default: false,
        },
        minimized_button_text: {
          type: String,
          default: 'See Offer',
        },
      },
    },
  },
  advanced: {
    facebook_pixel_id: {
      type: String,
      default: '',
    },
    snapchat_pixel_id: {
      type: String,
      default: '',
    },
    google_analytics_id: {
      type: String,
      default: '',
    },
    pinterest_tag_id: {
      type: String,
      default: '',
    },
    custom_css: {
      type: String,
      default: '',
    },
    custom_js: {
      type: String,
      default: '',
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('Settings', Settings);
