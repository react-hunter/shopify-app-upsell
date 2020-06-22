import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { i18nReducer } from 'react-redux-i18n';
import settings from './reducers/settings';
import shop from './reducers/shop';
import status from './reducers/status';
import campaign from './reducers/campaign';
import notification from './reducers/notification';
import bigBear from './reducers/bigBear';

export default combineReducers({
  form: formReducer,
  i18n: i18nReducer,
  status,
  settings,
  shop,
  campaign,
  notification,
  bigBear,
});
