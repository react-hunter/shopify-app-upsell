const defaultState = {};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'GET_SHOP':
      return { ...state, ...action.data } || {};
    default:
      return state;
  }
};

export default reducer;
