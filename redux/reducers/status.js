const defaultState = {
  loaded: false,
  isActive: false,
  hasOrders: false,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_LOADED':
      return { ...state, loaded: action.data } || {};
    case 'SET_IS_ACTIVE':
      return { ...state, isActive: action.data } || {};
    case 'GET_ORDERS_COUNT':
      return { ...state, hasOrders: (action.data > 0) } || {};
    default:
      return state;
  }
};

export default reducer;
