const defaultState = {};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case "GET_BIGBEAR_SHOP_DATA":
      return { ...state, shop: action.data } || {};
    case "GET_BIGBEAR_APPS_DATA":
      return { ...state, apps: action.data } || {};
    default:
      return state;
  }
};

export default reducer;
