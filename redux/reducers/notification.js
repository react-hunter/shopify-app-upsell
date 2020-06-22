export const defaulNotification = {
  list: [],
};

const reducer = (state = defaulNotification, action) => {
  switch (action.type) {
    case 'NEW_NOTIFICATION':
      return { list: [...state.list, { message: action.message, active: true }] };
    case 'CLOSE_NOTIFICATION':
      return { list: state.list.map((item, index) => {
        if (index === action.index) {
          return { ...item, active: false };
        }
        return { ...item };
      }) };
    case 'CLEAR_NOTIFICATION':
      return { list: state.list.filter((item, index) => index !== action.index) };
    default:
      return state;
  }
};

export default reducer;
