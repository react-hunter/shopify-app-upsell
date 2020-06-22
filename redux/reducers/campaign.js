import moment from 'moment';

export const defaulCampaigns = {
  list: [],
  item: {
    trigger: 'trigger_all',
    offers: [
      {
        product: null,
        upsell_type: 'discount',
        free_shipping: true,
        limit_products_amount: 1,
        limit_products: false,
        offer_text: 'Deal unlocked! Get this product for 20% off',
        show_offer_description: false,
        offer_description: '',
        discount: {
          amount: 20,
          discount_type: 'percent_off',
        },
      },
    ],
    show_campaign_only: 'both',
    skip_offers_already_icluded: false,
    start_time: false,
    end_time: false,
    action_accept_offer: 'go_to_checkout',
    start_date_value: moment().format('YYYY-MM-DD'),
    end_date_value: moment().add(7, 'days').format('YYYY-MM-DD'),
  },
};

const reducer = (state = defaulCampaigns, action) => {
  switch (action.type) {
    case 'GET_CAMPAIGNS':
      return { ...state, list: action.data };
    case 'SET_CAMPAIGN':
      return { ...state, item: action.data };
    case 'NEW_CAMPAIGN':
      return { ...state, list: [...state.list, action.data] };
    case 'UPDATE_CAMPAIGN':
      return { ...state, list: state.list.map((item) => {
        if (item._id === action.data._id) {
          return { ...item, ...action.data };
        }
        return { ...item };
      }) };
    default:
      return state;
  }
};

export default reducer;
