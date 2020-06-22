export const defaultSettings = {
  saving: false,
  display_saved_notice: false,
  data: {
    bar_notice_hidden: false,
    design: {
      theme: {
        upsell_page: {
          background_color: '#FFFFFF',
          top_background_color: '#FFFFFF',
          next_offer_text: 'Next offer',
          previous_offer_text: 'Previous offer',
        },
        top_bar: {
          show: true,
          bar_text: 'Wait! buy {{product name}} and get {{upsell-offer}}',
          text_size: 15,
          background_color: '#FFFFFF',
          text_color: '#2D2D2D',
          font: 'Cabin',
        },
        countdown_timer: {
          show: true,
          bar_text: 'HURRY! OFFER WILL EXPIRE IN',
          offer_expired_text: 'Offer expired',
          text_size: 18,
          background_color: '#2D2D2D',
          text_color: '#ffffff',
          font: 'Lato',
          start_countdown_from: [0, 1, 5, 9],
        },
        price: {
          old_price_color: '#A4A4A4',
          new_price_color: '#CE1948',
          discount_text: 'You save {{discount-amount}}!',
          text: 'Free Shipping included',
          text_color: '#CE1948',
          font: 'Cabin',
        },
        product: {
          show_quantity: true,
          quantity_text: "Quantity",
          image_layout: 'square',
          show_description: true,
          text_color: '#2D2D2D',
          font: 'Lato',
          vartiants_bg_color: '#FFFFFF',
          variants_text_color: '#2D2D2D',
          button_text: 'Add to Order',
          button_color: '#18A95E',
          button_text_color: '#FFFFFF',
          go_to_checkout_text: 'Continue to Checkout',
          go_to_checkout_text_color: '#18A95E',
          go_to_checkout_bg_color: '#FFFFFF',
          description_bg_color: '#FFFFFF',
          description_text_color: '#A4A4A4',
        },
        minimized_view: {
          start_minimized: false,
          minimized_button_text: 'See Offer',
        },
      },
    },
    advanced: {
      facebook_pixel_id: '',
      google_analytics_id: '',
      snapchat_pixel_id: '',
      pinterest_tag_id: '',
      custom_css: '',
      custom_js: '',
    },
  },
};

const reducer = (state = { }, action) => {
  switch (action.type) {
    case 'GET_SETTINGS':
      return {
        ...defaultSettings,
        data: {
          ...action.data,
          design: {
            ...defaultSettings.data.design,
            ...action.data.design,
          },
          advanced: {
            ...defaultSettings.data.advanced,
            ...action.data.advanced,
          },
        },
      };
    case 'SET_SETTINGS':
      return {
        ...state,
        saving: false,
        data: {
          ...state.data,
          ...action.data,
        },
      };
    case 'SET_SETTINGS_SAVING':
      return {
        ...state,
        saving: action.data,
      };
    case 'SET_SETTINGS_DISPAY_SAVED_NOTICE':
      return {
        ...state,
        display_saved_notice: action.data,
      };
    default:
      return state;
  }
};

export default reducer;
